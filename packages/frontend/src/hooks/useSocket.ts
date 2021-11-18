import { Socket } from 'socket.io-client';
import { useSocket as useSocketIO } from 'socket.io-react-hook';

type SocketLikeWithNamespace<L, E, T extends Socket<L, E> = Socket<L, E>> = T & {
  namespaceKey: string;
};
type UseSocketReturnType<L, E> = {
  socket: SocketLikeWithNamespace<L, E>;
  connected: boolean;
  error: any;
};

const useSocket = <L, E>(namespace: string) => useSocketIO(
  namespace,
  process.env.NODE_ENV === 'production' || !process.env.REACT_APP_PROXY_URL
    ? undefined
    : {
      host: process.env.REACT_APP_PROXY_URL.replace(/https?:\/\//g, ''),
    },
) as UseSocketReturnType<L, E>;

export default useSocket;
