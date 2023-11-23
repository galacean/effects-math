/**
 * 是否是的 2 的指数值
 * 无法用来处理小数
 * @param value
 * @returns
 */
export function isPowerIntegerOfTwo (testNum: number) {
  return (
    !isNaN(testNum) &&
    testNum !== Infinity &&
    testNum !== -Infinity &&
    testNum % 1 === 0 &&
    (testNum & (testNum - 1)) === 0 &&
    testNum !== 0
  );
}
