import { clamp } from '@galacean/effects-math';

describe('test clamp', () => {
  it('works as expected', () => {
    expect(clamp(0, 0, 3)).toEqual(0);
    expect(clamp(0, -3, 0)).toEqual(0);
    expect(clamp(0, -1, 5)).toEqual(0);
    expect(clamp(0, 4, 6)).toEqual(4);
  });

  it('works if max/min reversed', () => {
    expect(clamp(0, 3, 0)).toEqual(0);
    expect(clamp(0, 0, -3)).toEqual(0);
    expect(clamp(0, 5, -1)).toEqual(0);
    expect(clamp(0, -1, -2)).toEqual(-1);
    expect(clamp(0, 6, 4)).toEqual(4);
  });

  it('works on negative numbers', () => {
    expect(clamp(0, -2, -1)).toEqual(-1);
    expect(clamp(-10, -5, 5)).toEqual(-5);
    expect(clamp(-10.2, -5.5, 5.5)).toEqual(-5.5);
    expect(clamp(-Infinity, -5, 5)).toEqual(-5);
  });

  it('works on positive numbers', () => {
    expect(clamp(10, -5, 5)).toEqual(5);
    expect(clamp(10.6, -5.6, 5.4)).toEqual(5.4);
    expect(clamp(Infinity, -5, 5)).toEqual(5);
  });

  it('should not alter negative numbers in range', () => {
    expect(clamp(-4, -5, 5)).toEqual(-4);
    expect(clamp(-5, -5, 5)).toEqual(-5);
    expect(clamp(-5.5, -5.6, 5.6)).toEqual(-5.5);
  });

  it('should not alter positive numbers in range', () => {
    expect(clamp(2, -7, 3)).toEqual(2);
    expect(clamp(8, -8, 8)).toEqual(8);
    expect(clamp(3.4, -5.3, 5.4)).toEqual(3.4);
  });

  it('should works on `0`, `+0` or `-0`', () => {
    expect(1 / clamp(+0, -5, 5)).toEqual(Infinity);
    expect(1 / clamp(0, -5, 5)).toEqual(Infinity);
    expect(1 / clamp(-10, 0, 5)).toEqual(Infinity);
    expect(1 / clamp(-0, -5, 5)).toEqual(-Infinity);
    expect(1 / clamp(-5, -0, 5)).toEqual(-Infinity);
  });

  it('should return `NaN` when `number` is `NaN`', () => {
    expect(clamp(NaN, 0, 5)).toEqual(NaN);
  });

  it('should coerce `min` to `-Infinity` and `max` to `Infinity`', () => {
    expect(clamp(1, -5, NaN)).toEqual(1);
    expect(clamp(1, 5, NaN)).toEqual(5);
    expect(clamp(-1, NaN, 5)).toEqual(-1);
    expect(clamp(-1, NaN, -5)).toEqual(-5);
  });
});

