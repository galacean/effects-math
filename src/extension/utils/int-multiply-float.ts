export function intMultiplyFloat (int: number, floatMultiplier: number, precision = 1): number {
  if (floatMultiplier % 1 !== 0) {
    return intMultiplyFloat(int, floatMultiplier * 10, precision * 10);
  }

  return (int * floatMultiplier) / precision;
}
