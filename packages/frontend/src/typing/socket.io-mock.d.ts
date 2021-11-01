declare module 'socket.io-mock' {
  import { Socket } from 'socket.io-client';

  export default class SocketMock {
    rooms: [];

    joinedRooms: [];

    socketClient: Socket;

    _emitFn: Function[];

    generalCallbacks: {};

    broadcast: { to: Function[] };
  }
}
