export enum IntervalType {
  OPEN,
  CLOSE,
  LEFT_CLOSE,
  RIGHT_CLOSE,
}

export function isRangeIn (num: number, min: number, max: number, intervalType = IntervalType.OPEN): boolean {
  switch (intervalType) {
    case IntervalType.OPEN:
      return num > min && num < max;
    case IntervalType.CLOSE:
      return num >= min && num <= max;
    case IntervalType.LEFT_CLOSE:
      return num >= min && num < max;
    case IntervalType.RIGHT_CLOSE:
      return num > min && num <= max;
  }
}
