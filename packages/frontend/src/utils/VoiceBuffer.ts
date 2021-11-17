/* eslint-disable max-classes-per-file */
import { SocketVoice } from '@team-10/lib';

import {
  arrayBufferToString,
  concatArrayBuffer,
  findInArrayBuffer,
  findInArrayBufferFirst,
} from './arrayBuffer';

const SECONDS_IN_MILLIS = 0.001;

const DEFAULT_HEADER = new Uint8Array([
  0x1a, 0x45, 0xdf, 0xa3, 0x9f, 0x42, 0x86, 0x81, 0x01, 0x42, 0xf7, 0x81, 0x01, 0x42, 0xf2,
  0x81, 0x04, 0x42, 0xf3, 0x81, 0x08, 0x42, 0x82, 0x84, 0x77, 0x65, 0x62, 0x6d, 0x42, 0x87,
  0x81, 0x04, 0x42, 0x85, 0x81, 0x02, 0x18, 0x53, 0x80, 0x67, 0x01, 0xff, 0xff, 0xff, 0xff,
  0xff, 0xff, 0xff, 0x15, 0x49, 0xa9, 0x66, 0x99, 0x2a, 0xd7, 0xb1, 0x83, 0x0f, 0x42, 0x40,
  0x4d, 0x80, 0x86, 0x43, 0x68, 0x72, 0x6f, 0x6d, 0x65, 0x57, 0x41, 0x86, 0x43, 0x68, 0x72,
  0x6f, 0x6d, 0x65, 0x16, 0x54, 0xae, 0x6b, 0xbf, 0xae, 0xbd, 0xd7, 0x81, 0x01, 0x73, 0xc5,
  0x87, 0x27, 0xe8, 0x73, 0xb6, 0x44, 0x82, 0x53, 0x83, 0x81, 0x02, 0x86, 0x86, 0x41, 0x5f,
  0x4f, 0x50, 0x55, 0x53, 0x63, 0xa2, 0x93, 0x4f, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64,
  0x01, 0x01, 0x00, 0x00, 0x80, 0xbb, 0x00, 0x00, 0x00, 0x00, 0x00, 0xe1, 0x8d, 0xb5, 0x84,
  0x47, 0x3b, 0x80, 0x00, 0x9f, 0x81, 0x01, 0x62, 0x64, 0x81, 0x20, 0x1f, 0x43, 0xb6, 0x75,
  0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xe7, 0x81, 0x00,
]).buffer;

export default class VoiceBuffer {
  private header: ArrayBuffer;

  private initial: boolean = true;

  private bufferAddTime: number;

  static BUFFERING_DELAY = 120; // in millis

  constructor(public audioContext: AudioContext) {
    this.header = DEFAULT_HEADER;
    this.bufferAddTime = this.audioContext.currentTime;
  }

  public reset() {
    this.bufferAddTime = this.audioContext.currentTime;
    this.initial = true;
  }

  // `1a 45 df a3`의 magic number로 시작하는 buffer를 받아 헤더를 저장
  // 헤더는 마트료시카의 Cluster 섹션 `1f 43 b6 75 01 ff ff ff ff ff ff ff e7 XX XX`까지임
  private setHeader(buffer: ArrayBuffer) {
    const needle = new Uint8Array([
      0x1f, 0x43, 0xb6, 0x75, 0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
    ]).buffer;

    const headerIndex = findInArrayBuffer(needle, buffer);
    if (headerIndex === -1) return;

    const header = concatArrayBuffer([
      buffer.slice(0, headerIndex),
      needle,
      new Uint8Array([0xe7, 0x81, 0x00]).buffer,
    ]);

    this.header = header;
  }

  private attachHeader(buffer: ArrayBuffer): ArrayBuffer {
    const needle = new Uint8Array([0x1a, 0x45, 0xdf, 0xa3]).buffer;
    if (
      findInArrayBufferFirst(needle, buffer)
    ) {
      this.setHeader(buffer);
      return buffer;
    }

    return concatArrayBuffer([
      this.header,
      buffer,
    ]);
  }

  private static moveSectionSymbol(buffer: ArrayBuffer): ArrayBuffer {
    if (!buffer.byteLength) return buffer;

    if (
      new Uint8Array(buffer.slice(0, 1))[0] !== 0xa3
      && new Uint8Array(buffer.slice(-1))[0] === 0xa3
    ) {
      return concatArrayBuffer([new Uint8Array([0xa3]).buffer, buffer.slice(0, -1)]);
    }
    return buffer;
  }

  public async appendVoices(voices: SocketVoice.Voice[]): Promise<void> {
    const typedVoices: { type: 'opus' | 'mpeg', buffers: ArrayBuffer[] }[] = [];
    for (let i = 0; i < voices.length; i += 1) {
      const voice = voices[i];

      if (typedVoices.slice(-1)[0]?.type === voice.type) {
        typedVoices.slice(-1)[0].buffers.push(voice.buffer);
      } else {
        typedVoices.push({ type: voice.type, buffers: [voice.buffer] });
      }
    }

    const voiceDataArray = await Promise.all(typedVoices.map(
      ({ type, buffers }) => this.decodeVoiceData(type, buffers),
    ));

    voiceDataArray.forEach(
      (buffers) => buffers.forEach(this.appendVoiceBuffer.bind(this)),
    );
  }

  private async decodeVoiceData(type: 'opus' | 'mpeg', buffers: ArrayBuffer[]): Promise<AudioBuffer[]> {
    try {
      if (type === 'opus') {
        const buffer = this.attachHeader(
          VoiceBuffer.moveSectionSymbol(concatArrayBuffer(buffers)),
        );
        const audioBuffer = await this.audioContext.decodeAudioData(buffer);
        return [audioBuffer];
      }
      return await Promise.all(
        buffers.map((buffer) => this.audioContext.decodeAudioData(buffer)),
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to append an audio segment.', e);
      return [];
    }
  }

  private appendVoiceBuffer(buffer: AudioBuffer) {
    const sourceNode = new AudioBufferSourceNode(this.audioContext, { buffer });
    sourceNode.connect(this.audioContext.destination);
    if (this.initial) {
      this.bufferAddTime = this.audioContext.currentTime
      + VoiceBuffer.BUFFERING_DELAY * SECONDS_IN_MILLIS;
      this.initial = false;
    }
    sourceNode.start(this.bufferAddTime);
    this.bufferAddTime = Math.max(
      this.bufferAddTime,
      this.audioContext.currentTime + VoiceBuffer.BUFFERING_DELAY * SECONDS_IN_MILLIS,
    );
    this.bufferAddTime += buffer.duration - 0.05;
  }
}
