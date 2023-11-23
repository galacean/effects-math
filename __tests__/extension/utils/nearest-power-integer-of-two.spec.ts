import { nearestPowerIntegerOfTwo } from '@galacean/effects-math';

describe('test nearestPowerIntegerOfTwo', () => {
  it('the invalid number', () => {
    expect(nearestPowerIntegerOfTwo(Infinity)).toEqual(1);
    expect(nearestPowerIntegerOfTwo(-Infinity)).toEqual(1);
    expect(nearestPowerIntegerOfTwo(NaN)).toEqual(1);
  });

  it('the number less than 1', () => {
    expect(nearestPowerIntegerOfTwo(0.99)).toEqual(1);
    expect(nearestPowerIntegerOfTwo(+0)).toEqual(1);
    expect(nearestPowerIntegerOfTwo(0)).toEqual(1);
    expect(nearestPowerIntegerOfTwo(-0)).toEqual(1);
    expect(nearestPowerIntegerOfTwo(-1)).toEqual(1);
    expect(nearestPowerIntegerOfTwo(-2)).toEqual(1);
    expect(nearestPowerIntegerOfTwo(-100)).toEqual(1);
  });

  it('the power of two', () => {
    expect(nearestPowerIntegerOfTwo(1)).toEqual(1);
    expect(nearestPowerIntegerOfTwo(+1)).toEqual(1);
    expect(nearestPowerIntegerOfTwo(1.0)).toEqual(1);
    expect(nearestPowerIntegerOfTwo(2)).toEqual(2);
    expect(nearestPowerIntegerOfTwo(+2)).toEqual(2);
    expect(nearestPowerIntegerOfTwo(2.0)).toEqual(2);
    expect(nearestPowerIntegerOfTwo(4)).toEqual(4);
    expect(nearestPowerIntegerOfTwo(+4)).toEqual(4);
    expect(nearestPowerIntegerOfTwo(4.00)).toEqual(4);
    expect(nearestPowerIntegerOfTwo(8)).toEqual(8);
    expect(nearestPowerIntegerOfTwo(16)).toEqual(16);
    expect(nearestPowerIntegerOfTwo(32)).toEqual(32);
    expect(nearestPowerIntegerOfTwo(64)).toEqual(64);
    expect(nearestPowerIntegerOfTwo(128)).toEqual(128);
    expect(nearestPowerIntegerOfTwo(256)).toEqual(256);
    expect(nearestPowerIntegerOfTwo(256.0000000000000)).toEqual(256);
  });

  it('use mid value of numbers them are power of two', () => {
    expect(nearestPowerIntegerOfTwo(1.5)).toEqual(1);
    expect(nearestPowerIntegerOfTwo(3)).toEqual(2);
    expect(nearestPowerIntegerOfTwo(6)).toEqual(4);
    expect(nearestPowerIntegerOfTwo(6.0)).toEqual(4);
    expect(nearestPowerIntegerOfTwo(12)).toEqual(8);
    expect(nearestPowerIntegerOfTwo(12.000000)).toEqual(8);
    expect(nearestPowerIntegerOfTwo(24)).toEqual(16);
    expect(nearestPowerIntegerOfTwo(48)).toEqual(32);
    expect(nearestPowerIntegerOfTwo(96)).toEqual(64);
  });

  it('use the non-power of two', () => {
    expect(nearestPowerIntegerOfTwo(1.499999999)).toEqual(1);
    expect(nearestPowerIntegerOfTwo(1.500000001)).toEqual(2);
    expect(nearestPowerIntegerOfTwo(2.9999)).toEqual(2);
    expect(nearestPowerIntegerOfTwo(3.0001)).toEqual(4);
    expect(nearestPowerIntegerOfTwo(5.999999999999)).toEqual(4);
    expect(nearestPowerIntegerOfTwo(6.000000000001)).toEqual(8);
    expect(nearestPowerIntegerOfTwo(11.9999999)).toEqual(8);
    expect(nearestPowerIntegerOfTwo(12.0000001)).toEqual(16);
    expect(nearestPowerIntegerOfTwo(23.99999999999999)).toEqual(16);
    expect(nearestPowerIntegerOfTwo(24.00000000000001)).toEqual(32);
    expect(nearestPowerIntegerOfTwo(47.5)).toEqual(32);
    expect(nearestPowerIntegerOfTwo(48.5)).toEqual(64);
    expect(nearestPowerIntegerOfTwo(95.9)).toEqual(64);
    expect(nearestPowerIntegerOfTwo(96.1)).toEqual(128);

    expect(nearestPowerIntegerOfTwo(0.5)).toEqual(1);
    expect(nearestPowerIntegerOfTwo(1.1)).toEqual(1);
    expect(nearestPowerIntegerOfTwo(5)).toEqual(4);
    expect(nearestPowerIntegerOfTwo(9)).toEqual(8);
    expect(nearestPowerIntegerOfTwo(88)).toEqual(64);
    expect(nearestPowerIntegerOfTwo(127.9999999)).toEqual(128);
    expect(nearestPowerIntegerOfTwo(256.0000000000001)).toEqual(256);
  });
});
