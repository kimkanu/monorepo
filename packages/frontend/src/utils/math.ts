export function arrayFill<T>(length: number, value: T): T[] {
  return new Array(length).fill(value);
}

export function range(start: number, end?: number, step?: number): number[] {
  if (typeof end === 'undefined') {
    return range(0, start, 1);
  }

  if (typeof step === 'undefined') {
    return range(start, end, 1);
  }

  const length = Math.ceil((end - start) / step);
  if (length <= 0) return [];
  return new Array(length).fill(0).map((_, i) => start + i * step);
}

export function rangeEnd(start: number, end?: number, step?: number): number[] {
  if (typeof end === 'undefined') {
    return [...range(start), start];
  }
  return [
    ...range(start, end, step),
    ...(
      (end - start) % (step ?? 1) === 0
        ? [end]
        : []
    ),
  ];
}

export function random(start?: number, end?: number): number {
  if (typeof start === 'undefined') {
    return random(0, 1);
  }

  if (typeof end === 'undefined') {
    return random(0, start);
  }

  return start + Math.random() * (end - start);
}

export function randomInt(start: number, end?: number): number {
  return Math.floor(random(start, end));
}

export function sum(array: number[]): number {
  return array.reduce((a, b) => a + b, 0);
}

export function newtonRaphson(
  f: (x: number) => number, df: (x: number) => number, guess: number, iter: number = 6,
): number {
  if (iter === 0) return guess;
  const better = guess - f(guess) / df(guess);
  return newtonRaphson(f, df, better, iter - 1);
}

export function clamp(min: number, x: number, max: number): number {
  if (x < min) return min;
  if (x > max) return max;
  return x;
}
