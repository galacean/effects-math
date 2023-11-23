/**
 * 最近的 2 的指数值，未超过 90% 使用较低值
 * @param value
 * @returns
 */
export function floorNearestPowerOfTwo (value: number): number {
  const n = Math.log(value) / Math.LN2;
  const m = (Math.pow(2, Math.ceil(n)) + Math.pow(2, Math.floor(n))) / 2;

  return Math.pow(2, value > m ? Math.ceil(n) : Math.floor(n));
}
