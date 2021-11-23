import { ImgurClient } from 'imgur';
import { ImageData } from 'imgur/lib/common/types';

import Server from '../server';

export default class ImageManager {
  client: ImgurClient | null;

  constructor(public server: Server) {
    this.client = (process.env.IMGUR_CLIENT_ID)
      ? new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID })
      : null;
  }

  async upload(file: Express.Multer.File): Promise<ImageData | null> {
    if (!this.client) {
      console.log('IMGUR_CLIENT_ID IS NOT GIVEN!!!');
      return null;
    }

    const extension = file.mimetype.split('/')[1];
    if (!extension) {
      console.log('WRONG MIMETYPE', file.mimetype);
      return null;
    }

    const response = (<T>(a: T | T[]) => (Array.isArray(a) ? a[0] : a))(
      await this.client.upload(file.path),
    );
    return response.success ? response.data : null;
  }

  async delete(deleteHash: string): Promise<boolean> {
    if (!this.client) {
      console.log('IMGUR_CLIENT_ID IS NOT GIVEN!!!');
      return false;
    }

    const response = await this.client.deleteImage(deleteHash);
    return response.success;
  }
}
