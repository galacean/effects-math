import { IntervalType, isRangeIn } from '@galacean/effects-math';

describe('test isRangeIn', () => {
  it('int range in', () => {
    expect(isRangeIn(1, 0, 5)).toEqual(true);
    expect(isRangeIn(1, 1, 5)).toEqual(false);
    expect(isRangeIn(1, 1, 5, IntervalType.OPEN)).toEqual(false);
    expect(isRangeIn(1, 1, 5, IntervalType.CLOSE)).toEqual(true);
    expect(isRangeIn(1, 1, 5, IntervalType.LEFT_CLOSE)).toEqual(true);
    expect(isRangeIn(1, 1, 5, IntervalType.RIGHT_CLOSE)).toEqual(false);
    expect(isRangeIn(1, -5, 2)).toEqual(true);
    expect(isRangeIn(1, -5, 1)).toEqual(false);
    expect(isRangeIn(1, -5, 1, IntervalType.OPEN)).toEqual(false);
    expect(isRangeIn(1, -5, 1, IntervalType.CLOSE)).toEqual(true);
    expect(isRangeIn(1, -5, 1, IntervalType.LEFT_CLOSE)).toEqual(false);
    expect(isRangeIn(1, -5, 1, IntervalType.RIGHT_CLOSE)).toEqual(true);
  });

  it('float range in', () => {
    expect(isRangeIn(1.0, 0, 5)).toEqual(true);
    expect(isRangeIn(1.0, 1, 5)).toEqual(false);
    expect(isRangeIn(1.0, 1, 5, IntervalType.OPEN)).toEqual(false);
    expect(isRangeIn(1.0, 1, 5, IntervalType.CLOSE)).toEqual(true);
    expect(isRangeIn(1.0, 1, 5, IntervalType.LEFT_CLOSE)).toEqual(true);
    expect(isRangeIn(1.0, 1, 5, IntervalType.RIGHT_CLOSE)).toEqual(false);
    expect(isRangeIn(1.0, -5, 2)).toEqual(true);
    expect(isRangeIn(1.0, -5, 1)).toEqual(false);
    expect(isRangeIn(1.0, -5, 1, IntervalType.OPEN)).toEqual(false);
    expect(isRangeIn(1.0, -5, 1, IntervalType.CLOSE)).toEqual(true);
    expect(isRangeIn(1.0, -5, 1, IntervalType.LEFT_CLOSE)).toEqual(false);
    expect(isRangeIn(1.0, -5, 1, IntervalType.RIGHT_CLOSE)).toEqual(true);
  });
});
