import { Socket } from 'socket.io';

import Server from '../server';

export default class SocketManager {
  private sockets: Map<number, { sockets: Set<Socket>; mainSocketId: string; }> = new Map();

  constructor(public server: Server) {}

  add(userId: number, socket: Socket) {
    if (this.sockets.has(userId)) {
      const entry = this.sockets.get(userId)!;
      entry.sockets.add(socket);
    } else {
      this.sockets.set(userId, {
        sockets: new Set([socket]),
        mainSocketId: socket.id,
      });
    }
  }

  remove(userId: number, socket: Socket): boolean {
    const entry = this.sockets.get(userId);
    if (!entry || !entry.sockets.has(socket)) return false;

    entry.sockets.delete(socket);
    return true;
  }

  setMain(userId: number, socket: Socket) {
    if (!this.sockets.has(userId)) {
      this.add(userId, socket);
    }
    const entry = this.sockets.get(userId)!;
    this.sockets.set(userId, { ...entry, mainSocketId: socket.id });
  }
}
