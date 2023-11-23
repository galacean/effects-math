export const PI2 = Math.PI * 2;

export const DEG2RAD = Math.PI / 180;

export const RAD2DEG = 180 / Math.PI;

export const NumberEpsilon = 1e-6;

export function isZero (v: number): boolean {
  return isNaN(v) || Math.abs(v) < NumberEpsilon;
}

export function isEqual (a: number, b: number): boolean {
  return Math.abs(a - b) < NumberEpsilon || (a === Infinity && b === Infinity) || (a === -Infinity && b === -Infinity);
}

// http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/
export const damp = (x: number, y: number, lambda: number, dt: number): number => lerp(x, y, 1 - Math.exp(-lambda * dt));

// https://en.wikipedia.org/wiki/Linear_interpolation
export const lerp = (x: number, y: number, t: number): number => (1 - t) * x + t * y;

export const degToRad = (degrees: number): number => degrees * DEG2RAD;

export const radToDeg = (radians: number): number => radians * RAD2DEG;

export function clamp (value: number, min: number, max: number): number {
  const fixedMin = isNaN(min) ? -Infinity : min;
  const fixedMax = isNaN(max) ? Infinity : max;
  const lower = Math.min(fixedMin, fixedMax);
  const upper = Math.max(fixedMin, fixedMax);

  return Math.min(Math.max(value, lower), upper);
}
