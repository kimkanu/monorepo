import { render, act } from '@testing-library/react';
import React from 'react';
import { RecoilRoot } from 'recoil';

import Dialog from './Dialog';

test('It should be visible when it is set to be visible.', async () => {
  const { container } = render(
    <RecoilRoot>
      <Dialog className="___TEST___" visible onClose={() => {}}>
        Dialog
      </Dialog>
    </RecoilRoot>,
  );

  // Cover L32 of Dialog.tsx
  await new Promise((r) => setTimeout(r, 600));

  expect(
    (container.getElementsByClassName('___TEST___')[0] as HTMLDivElement)
      .textContent,
  ).toBe('Dialog');
});

test('Dialogs should be able to be shown or be hidden.', async () => {
  await act(async () => {
    const Wrapper: React.FC = () => {
      const [visible, setVisible] = React.useState(false);

      return (
        <RecoilRoot>
          <button type="button" className="___TEST___button" onClick={() => setVisible(true)}>
            Show dialog
          </button>
          <Dialog className="___TEST___dialog" visible={visible} onClose={() => setVisible(false)}>
            {visible ? 'visible' : 'invisible'}
          </Dialog>
        </RecoilRoot>
      );
    };

    const { container } = render(<Wrapper />);

    await new Promise((r) => setTimeout(r, 100));

    const button = container.getElementsByClassName('___TEST___button')[0] as HTMLDivElement;
    button.click();

    await new Promise((r) => setTimeout(r, 100));

    const dialog = container.getElementsByClassName('___TEST___dialog')[0] as HTMLDivElement;
    expect(dialog.textContent).toBe('visible');

    const background = dialog.parentElement as HTMLDivElement;
    background.click();

    await new Promise((r) => setTimeout(r, 100));

    expect(dialog.textContent).toBe('invisible');
  });
});

test('Clicking the dialog should not close itself.', async () => {
  await act(async () => {
    const Wrapper: React.FC = () => {
      const [visible, setVisible] = React.useState(true);

      return (
        <RecoilRoot>
          <Dialog className="___TEST___" visible={visible} onClose={() => setVisible(false)}>
            {visible ? 'visible' : 'invisible'}
          </Dialog>
        </RecoilRoot>
      );
    };

    const { container } = render(<Wrapper />);
    const dialog = container.getElementsByClassName('___TEST___')[0] as HTMLDivElement;
    dialog.click();

    await new Promise((r) => setTimeout(r, 100));

    expect(dialog.textContent).toBe('visible');
  });
});

test('Pressing esc (on the background) should close the dialog when onClose is set properly.', async () => {
  await act(async () => {
    const Wrapper: React.FC = () => {
      const [visible, setVisible] = React.useState(true);

      return (
        <RecoilRoot>
          <Dialog className="___TEST___" visible={visible} onClose={() => setVisible(false)}>
            {visible ? 'visible' : 'invisible'}
          </Dialog>
        </RecoilRoot>
      );
    };

    const { container } = render(<Wrapper />);
    const dialog = container.getElementsByClassName('___TEST___')[0] as HTMLDivElement;
    dialog.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Escape' }));

    await new Promise((r) => setTimeout(r, 100));

    expect(dialog.textContent).toBe('invisible');
  });
});

test('Pressing keys other than esc should not close the dialog.', async () => {
  await act(async () => {
    const Wrapper: React.FC = () => {
      const [visible, setVisible] = React.useState(true);

      return (
        <RecoilRoot>
          <Dialog className="___TEST___" visible={visible} onClose={() => setVisible(false)}>
            {visible ? 'visible' : 'invisible'}
          </Dialog>
        </RecoilRoot>
      );
    };

    const { container } = render(<Wrapper />);
    const dialog = container.getElementsByClassName('___TEST___')[0] as HTMLDivElement;
    dialog.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));

    await new Promise((r) => setTimeout(r, 100));

    expect(dialog.textContent).toBe('visible');
  });
});
