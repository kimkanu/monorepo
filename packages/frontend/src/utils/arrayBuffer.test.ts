import Crypto from 'crypto';

import { concatArrayBuffer, findInArrayBuffer } from './arrayBuffer';
import { range } from './math';

describe('concatArrayBuffer works well', () => {
  test.each(range(1, 11))('%i/10', () => {
    const buffers = range(10).map(() => new Uint8Array(Crypto.randomBytes(20)).buffer);
    const bufferToArray = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer));
    expect(bufferToArray(concatArrayBuffer(buffers))).toStrictEqual(buffers.flatMap(bufferToArray));
  });
});

test('findInArrayBuffer works well', () => {
  expect(findInArrayBuffer(
    new Uint8Array([1, 3, 5, 2]).buffer,
    new Uint8Array([0, 1, 3, 4, 1, 3, 5, 2, 6, 7, 7]).buffer,
  )).toBe(4);
  expect(findInArrayBuffer(
    new Uint8Array([1, 3, 5, 3]).buffer,
    new Uint8Array([0, 1, 3, 4, 1, 3, 5, 2, 6, 7, 7]).buffer,
  )).toBe(-1);
});
