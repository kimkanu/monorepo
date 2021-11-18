import { render, screen } from '@testing-library/react';
import React from 'react';
import { RecoilRoot } from 'recoil';

import SocketMock from 'socket.io-mock';
import { useSocket } from 'socket.io-react-hook';

import App from './App';

jest.mock('socket.io-react-hook');

window.matchMedia = (query) => ({
  addEventListener: jest.fn(),
  addListener: jest.fn(), // Deprecated
  dispatchEvent: jest.fn(),
  matches: false,
  media: query,
  onchange: null,
  removeEventListener: jest.fn(),
  removeListener: jest.fn(), // Deprecated
});

beforeEach(() => {
  const mockUseSocket = useSocket as jest.MockedFunction<typeof useSocket>;
  const { socketClient } = new SocketMock();
  mockUseSocket.mockImplementation((namespaceKey: string) => {
    (socketClient as any).namespaceKey = namespaceKey;
    return ({
      connected: socketClient.connected,
      error: undefined,
      socket: socketClient as any,
    });
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('Renders `Connected!` message.', () => {
  render(<RecoilRoot><App /></RecoilRoot>);
  const linkElement = screen.getByText(/Connected!/i);
  expect(linkElement).toBeInTheDocument();

  expect('Lint-staged test').toBe('Lint-staged test');
});
