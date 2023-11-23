/**
 * 最近的 2 的指数值
 * 无法用来处理小于 1 的数
 * @param value
 * @returns
 */
export function nearestPowerIntegerOfTwo (value: number) {
  if (isNaN(value) || value === Infinity || value === -Infinity || value <= 1) {
    return 1;
  }

  let [upper, lower] = [2, 1];

  while (upper < value || lower > value) {
    [upper, lower] = [upper * 2, upper];
  }

  const dis1 = upper - value;
  const dis2 = value - lower;

  return dis1 >= dis2 ? lower : upper;
}
