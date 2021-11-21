import { render, act } from '@testing-library/react';
import React from 'react';
import { RecoilRoot } from 'recoil';

import Dropdown from './Dropdown';

test('It should be visible when it is set to be visible.', async () => {
  const { container } = render(
    <RecoilRoot>
      <Dropdown className="___TEST___" visible onClose={() => {}}>
        Dropdown
      </Dropdown>
    </RecoilRoot>,
  );

  // Cover L32 of Dropdown.tsx
  await new Promise((r) => setTimeout(r, 600));

  expect(
    (container.getElementsByClassName('___TEST___')[0] as HTMLDivElement)
      .textContent,
  ).toBe('Dropdown');
});

test('Dropdowns should be able to be shown or be hidden.', async () => {
  await act(async () => {
    const Wrapper: React.FC = () => {
      const [visible, setVisible] = React.useState(false);

      return (
        <RecoilRoot>
          <button type="button" className="___TEST___button" onClick={() => setVisible(true)}>
            Show dropdown
          </button>
          <Dropdown className="___TEST___dropdown" visible={visible} onClose={() => setVisible(false)}>
            {visible ? 'visible' : 'invisible'}
          </Dropdown>
        </RecoilRoot>
      );
    };

    const { container } = render(<Wrapper />);

    await new Promise((r) => setTimeout(r, 100));

    const button = container.getElementsByClassName('___TEST___button')[0] as HTMLDivElement;
    button.click();

    await new Promise((r) => setTimeout(r, 100));

    const dropdown = container.getElementsByClassName('___TEST___dropdown')[0] as HTMLDivElement;
    expect(dropdown.textContent).toBe('visible');

    const background = dropdown.parentElement as HTMLDivElement;
    background.click();

    await new Promise((r) => setTimeout(r, 100));

    expect(dropdown.textContent).toBe('invisible');
  });
});

test('Clicking the dropdown should not close itself.', async () => {
  await act(async () => {
    const Wrapper: React.FC = () => {
      const [visible, setVisible] = React.useState(true);

      return (
        <RecoilRoot>
          <Dropdown className="___TEST___" visible={visible} onClose={() => setVisible(false)}>
            {visible ? 'visible' : 'invisible'}
          </Dropdown>
        </RecoilRoot>
      );
    };

    const { container } = render(<Wrapper />);
    const dropdown = container.getElementsByClassName('___TEST___')[0] as HTMLDivElement;
    dropdown.click();

    await new Promise((r) => setTimeout(r, 100));

    expect(dropdown.textContent).toBe('visible');
  });
});

test('Pressing esc (on the background) should close the dropdown when onClose is set properly.', async () => {
  await act(async () => {
    const Wrapper: React.FC = () => {
      const [visible, setVisible] = React.useState(true);

      return (
        <RecoilRoot>
          <Dropdown className="___TEST___" visible={visible} onClose={() => setVisible(false)}>
            {visible ? 'visible' : 'invisible'}
          </Dropdown>
        </RecoilRoot>
      );
    };

    const { container } = render(<Wrapper />);
    const dropdown = container.getElementsByClassName('___TEST___')[0] as HTMLDivElement;
    dropdown.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Escape' }));

    await new Promise((r) => setTimeout(r, 100));

    expect(dropdown.textContent).toBe('invisible');
  });
});

test('Pressing keys other than esc should not close the dropdown.', async () => {
  await act(async () => {
    const Wrapper: React.FC = () => {
      const [visible, setVisible] = React.useState(true);

      return (
        <RecoilRoot>
          <Dropdown className="___TEST___" visible={visible} onClose={() => setVisible(false)}>
            {visible ? 'visible' : 'invisible'}
          </Dropdown>
        </RecoilRoot>
      );
    };

    const { container } = render(<Wrapper />);
    const dropdown = container.getElementsByClassName('___TEST___')[0] as HTMLDivElement;
    dropdown.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));

    await new Promise((r) => setTimeout(r, 100));

    expect(dropdown.textContent).toBe('visible');
  });
});
