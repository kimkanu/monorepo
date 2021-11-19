import { render, act } from '@testing-library/react';
import React from 'react';

import WaveVisualizer from './WaveVisualizer';

jest.setTimeout(10000);

test('Should be rendered successfully with lots of paths.', async () => {
  await act(async () => {
    const { container } = render(<WaveVisualizer amplitude={60} frequency={300} />);

    await new Promise((r) => setTimeout(r, 2000));
    const paths = container.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'path');

    expect(paths.length > 5).toBe(true);
  });
});
