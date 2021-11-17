import { range, sum } from './math';

// eslint-disable-next-line import/prefer-default-export
export function concatArrayBuffer(buffers: ArrayBuffer[]) {
  if (buffers.length === 0) return new ArrayBuffer(0);
  if (buffers.length === 1) return buffers[0];

  const tmp = new Uint8Array(sum(buffers.map((buffer) => buffer.byteLength)));

  let length = 0;
  for (let i = 0; i < buffers.length; i += 1) {
    tmp.set(new Uint8Array(buffers[i]), length);
    length += buffers[i].byteLength;
  }
  return tmp.buffer as ArrayBuffer;
}

export function findInArrayBuffer(needle: ArrayBuffer, haystack: ArrayBuffer): number {
  let i = 0;

  for (;;) {
    if (i + needle.byteLength > haystack.byteLength) return -1;

    const needleAsArray = new Uint8Array(needle);
    const haystackAsArray = new Uint8Array(haystack);
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    if (range(needle.byteLength).every((j) => needleAsArray[j] === haystackAsArray[i + j])) {
      return i;
    }

    i += 1;
  }
}

export function findInArrayBufferFirst(needle: ArrayBuffer, haystack: ArrayBuffer): boolean {
  if (needle.byteLength > haystack.byteLength) return false;

  const needleAsArray = new Uint8Array(needle);
  const haystackAsArray = new Uint8Array(haystack);
  // eslint-disable-next-line @typescript-eslint/no-loop-func
  return range(needle.byteLength).every((j) => needleAsArray[j] === haystackAsArray[j]);
}

export function arrayBufferToString(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer)).map((x) => x.toString(16).padStart(2, '0')).join(' ');
}
