export function roundNumber (number: number, precision: number, method = Math.round): number {
  // 已经是整数，则无需处理
  if (Number.isInteger(number)) {
    return number;
  }
  const decimal = Math.pow(10, precision);

  return method(number * decimal) / decimal;
}
