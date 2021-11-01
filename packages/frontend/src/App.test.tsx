import { render, screen } from '@testing-library/react';
import React from 'react';

import SocketMock from 'socket.io-mock';
import { useSocket } from 'socket.io-react-hook';

import App from './App';

jest.mock('socket.io-react-hook');

beforeEach(() => {
  const mockUseSocket = useSocket as jest.MockedFunction<typeof useSocket>;
  const { socketClient } = new SocketMock();
  mockUseSocket.mockImplementationOnce((namespaceKey: string) => {
    (socketClient as any).namespaceKey = namespaceKey;
    return ({
      socket: socketClient as any,
      connected: socketClient.connected,
      error: undefined,
    });
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
