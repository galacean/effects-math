import { isPowerIntegerOfTwo } from '@galacean/effects-math';

describe('test isPowerIntegerOfTwo', () => {
  it('the power of two', () => {
    expect(isPowerIntegerOfTwo(1)).toEqual(true);
    expect(isPowerIntegerOfTwo(+1)).toEqual(true);
    expect(isPowerIntegerOfTwo(1.0)).toEqual(true);
    expect(isPowerIntegerOfTwo(2)).toEqual(true);
    expect(isPowerIntegerOfTwo(+2)).toEqual(true);
    expect(isPowerIntegerOfTwo(2.0)).toEqual(true);
    expect(isPowerIntegerOfTwo(4)).toEqual(true);
    expect(isPowerIntegerOfTwo(+4)).toEqual(true);
    expect(isPowerIntegerOfTwo(4.00)).toEqual(true);
    expect(isPowerIntegerOfTwo(8)).toEqual(true);
    expect(isPowerIntegerOfTwo(16)).toEqual(true);
    expect(isPowerIntegerOfTwo(32)).toEqual(true);
    expect(isPowerIntegerOfTwo(64)).toEqual(true);
    expect(isPowerIntegerOfTwo(128)).toEqual(true);
    expect(isPowerIntegerOfTwo(256)).toEqual(true);
    expect(isPowerIntegerOfTwo(256)).toEqual(true);
  });

  it('the non-power of two', () => {
    expect(isPowerIntegerOfTwo(Infinity)).toEqual(false);
    expect(isPowerIntegerOfTwo(-Infinity)).toEqual(false);
    expect(isPowerIntegerOfTwo(NaN)).toEqual(false);
    expect(isPowerIntegerOfTwo(-0)).toEqual(false);
    expect(isPowerIntegerOfTwo(0)).toEqual(false);
    expect(isPowerIntegerOfTwo(+0)).toEqual(false);
    expect(isPowerIntegerOfTwo(0.5)).toEqual(false);
    expect(isPowerIntegerOfTwo(1.1)).toEqual(false);
    expect(isPowerIntegerOfTwo(-1)).toEqual(false);
    expect(isPowerIntegerOfTwo(-2)).toEqual(false);
    expect(isPowerIntegerOfTwo(-4)).toEqual(false);
    expect(isPowerIntegerOfTwo(3)).toEqual(false);
    expect(isPowerIntegerOfTwo(9)).toEqual(false);
    expect(isPowerIntegerOfTwo(88)).toEqual(false);
    expect(isPowerIntegerOfTwo(127.9999999)).toEqual(false);
    expect(isPowerIntegerOfTwo(256.0000000000001)).toEqual(false);
  });
});
