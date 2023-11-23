export { roundNumber } from './round-number';
export { intMultiplyFloat } from './int-multiply-float';
export { isPowerIntegerOfTwo } from './is-power-integer-of-two';
export { nearestPowerIntegerOfTwo } from './nearest-power-integer-of-two';
export { floorNearestPowerOfTwo } from './floor-nearest-power-of-two';
export { round } from './round';
export { IntervalType, isRangeIn } from './is-range-in';

let seed = 1234567;

export const fixed = (value: number, size: number): number => Math.round(value * Math.pow(10, size)) / Math.pow(10, size);

// compute euclidian modulo of m % n
// https://en.wikipedia.org/wiki/Modulo_operation
export const euclideanModulo = (n: number, m: number): number => ((n % m) + m) % m;

export const mapLinear = (
  x: number,
  a1: number,
  a2: number,
  b1: number,
  b2: number,
): number => b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);

// https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/inverse-lerp-a-super-useful-yet-often-overlooked-function-r5230/
export const inverseLerp = (x: number, y: number, value: number): number => {
  if (x !== y) {
    return (value - x) / (y - x);
  } else {
    return 0;
  }
};

// https://www.desmos.com/calculator/vcsjnyz7x4
export const pingpong = (x: number, length = 1): number => length - Math.abs(euclideanModulo(x, length * 2) - length);

// http://en.wikipedia.org/wiki/Smoothstep
export const smoothstep = (x: number, min: number, max: number): number => {
  if (x <= min) { return 0; }
  if (x >= max) { return 1; }

  x = (x - min) / (max - min);

  return x * x * (3 - 2 * x);
};

export const smootherstep = (x: number, min: number, max: number): number => {
  if (x <= min) { return 0; }
  if (x >= max) { return 1; }

  x = (x - min) / (max - min);

  return x * x * x * (x * (x * 6 - 15) + 10);
};

// Random integer from <low, high> interval
export const randInt = (low: number, high: number): number => low + Math.floor(Math.random() * (high - low + 1));

// Random float from <low, high> interval
export const randFloat = (low: number, high: number): number => low + Math.random() * (high - low);

// Random float from <-range/2, range/2> interval
export const randFloatSpread = (range: number): number => range * (0.5 - Math.random());

// Deterministic pseudo-random float in the interval [ 0, 1 ]
export const seededRandom = (s: number): number => {
  if (s !== undefined) { seed = s % 2147483647; }
  // Park-Miller algorithm
  seed = (seed * 16807) % 2147483647;

  return (seed - 1) / 2147483646;
};

export const isPowerOfTwo = (value: number): boolean => (value & (value - 1)) === 0 && value !== 0;

export const ceilPowerOfTwo = (value: number): number => Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));

export const floorPowerOfTwo = (value: number): number => Math.pow(2, Math.floor(Math.log(value) / Math.LN2));

export function modByFloat (number: number, mod: number): number {
  const left = number % mod;

  number -= left;
  if (Math.abs(left) >= mod / 2) {
    number += mod * Math.sign(number);
  }

  return number;
}
