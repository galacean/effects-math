import { floorNearestPowerOfTwo } from '@galacean/effects-math';

describe('test floorNearestPowerOfTwo', () => {
  it('case <= 50%', () => {
    expect(floorNearestPowerOfTwo(1536)).toEqual(1024);
    expect(floorNearestPowerOfTwo(1410)).toEqual(1024);
    expect(floorNearestPowerOfTwo(768)).toEqual(512);
    expect(floorNearestPowerOfTwo(755.4)).toEqual(512);
  });
  it('case > 50%', () => {
    expect(floorNearestPowerOfTwo(1537)).toEqual(2048);
    expect(floorNearestPowerOfTwo(2000)).toEqual(2048);
    expect(floorNearestPowerOfTwo(768.5)).toEqual(1024);
    expect(floorNearestPowerOfTwo(1000)).toEqual(1024);
  });
});
