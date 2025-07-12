import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UploadGateway implements OnGatewayConnection {
  handleConnection(client: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }
  @WebSocketServer()
  server!: Server;

  emitProgress(sessionId: string, imageName: string, step: string) {
    this.server.emit('upload-progress', {
      sessionId,
      imageName,
      step,
    });
  }
}