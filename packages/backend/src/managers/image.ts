/* eslint-disable class-methods-use-this */
import { promises as fs } from 'fs';
import path from 'path';

import got from 'got';
import { ImgurClient } from 'imgur';
import { ImageData } from 'imgur/lib/common/types';
import { v4 as uuidV4 } from 'uuid';

import Server from '../server';

export default class ImageManager {
  client: ImgurClient | null;

  imaggaAPIKeys: string[];

  consumedImaggaAPIKeys: string[] = [];

  isAvailable: boolean = true;

  constructor(public server: Server) {
    this.client = (process.env.IMGUR_CLIENT_ID)
      ? new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID })
      : null;
    this.imaggaAPIKeys = process.env.IMAGGA_AUTH_KEYS?.split(',') ?? [];
  }

  async upload(file: Express.Multer.File): Promise<ImageData | null> {
    if (!this.client) {
      console.error('IMGUR_CLIENT_ID IS NOT GIVEN!!!');
      return null;
    }

    const extension = file.mimetype.split('/')[1];
    if (!extension) {
      console.error('WRONG MIMETYPE', file.mimetype);
      return null;
    }

    const response = (<T>(a: T | T[]) => (Array.isArray(a) ? a[0] : a))(
      await this.client.upload(file.path),
    );
    return response.success ? response.data : null;
  }

  async uploadArraybuffer(buffer: ArrayBuffer): Promise<ImageData | null> {
    if (!this.client) {
      console.error('IMGUR_CLIENT_ID IS NOT GIVEN!!!');
      return null;
    }

    const filepath = path.join(this.server.tempDir, uuidV4());
    try {
      await fs.writeFile(filepath, Buffer.from(buffer));

      const response = (<T>(a: T | T[]) => (Array.isArray(a) ? a[0] : a))(
        await this.client.upload(filepath),
      );
      return response.success ? response.data : null;
    } catch (e) {
      return null;
    }
  }

  async delete(deleteHash: string): Promise<boolean> {
    if (!this.client) {
      console.error('IMGUR_CLIENT_ID IS NOT GIVEN!!!');
      return false;
    }

    const response = await this.client.deleteImage(deleteHash);
    return response.success;
  }

  async getAltText(url: string): Promise<{ en: string; ko: string } | null> {
    if (this.imaggaAPIKeys.length === 0) return null;

    try {
      const response = await got(`https://api.imagga.com/v2/tags?language=en,ko&image_url=${url}`, {
        headers: {
          Authorization: `Basic ${this.imaggaAPIKeys[0]}`,
        },
      }).then((res) => JSON.parse(res.body));

      if (response.status.type !== 'success') {
        throw new Error('Response failed');
      }
      const hasJong = (string: string) => {
        const charCode = string.charCodeAt(string.length - 1);
        return (charCode - 0xac00) % 28 > 0;
      };
      const wrapper = {
        en: (x: string) => `An image attached to a message which may contain ${x}`,
        ko: (x: string) => `${x}${hasJong(x) ? '을' : '를'} 포함하는 것으로 보이는 채팅 첨부 이미지`,
      };

      this.isAvailable = true;

      return Object.fromEntries(['en', 'ko'].map((lang) => [
        lang,
        wrapper[lang](
          response.result.tags
            .filter(({ confidence }) => confidence > 10)
            .slice(0, 8)
            .map(({ tag }) => tag[lang] as string)
            .join(', '),
        ),
      ])) as { en: string; ko: string };
    } catch (e) {
      this.consumeImaggaAPIKey();
      return this.getAltText(url);
    }
  }

  private consumeImaggaAPIKey() {
    if (this.imaggaAPIKeys.length === 0 && !this.isAvailable) return;
    const consumedAPIKey = this.imaggaAPIKeys.shift()!;
    this.consumedImaggaAPIKeys.push(consumedAPIKey);
    if (this.imaggaAPIKeys.length === 0 && this.isAvailable) {
      this.isAvailable = false;
      this.imaggaAPIKeys = this.consumedImaggaAPIKeys.slice();
      this.consumedImaggaAPIKeys = [];
    }
  }
}
