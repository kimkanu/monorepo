import { render, act, screen } from '@testing-library/react';
import React from 'react';

import { ToastType } from '../recoil/toast';
import { randomInt, range } from '../utils/math';

import ToastDisplay from './ToastDisplay';

jest.setTimeout(10000);

test('Toasts should be rendered.', async () => {
  await act(async () => {
    const TOTAL_TOASTS = randomInt(10, 30);
    const dateNow = Date.now();

    const randomDates: number[] = [];
    while (randomDates.length < TOTAL_TOASTS) {
      const date = dateNow + randomInt(-1000, 2000) * 10;
      if (!randomDates.includes(date)) {
        randomDates.push(date);
      }
    }

    const toasts = range(TOTAL_TOASTS).map((i) => ({
      type: [ToastType.INFO, ToastType.WARN, ToastType.ERROR][randomInt(3)],
      message: `Toast Message ${i}`,
      sentAt: new Date(randomDates[i]),
    }));

    render(<ToastDisplay toasts={toasts} />);

    range(TOTAL_TOASTS).forEach((i) => {
      expect(screen.getByText(`Toast Message ${i}`)).toBeInTheDocument();
    });
  });
});
