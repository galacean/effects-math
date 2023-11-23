import { intMultiplyFloat } from '@galacean/effects-math';

describe('test intMultiplyFloat', () => {
  it('0 multiply float or int cases', () => {
    expect(intMultiplyFloat(0, 0)).toEqual(0);
    expect(intMultiplyFloat(0, 1)).toEqual(0);
    expect(intMultiplyFloat(0, 10)).toEqual(0);
    expect(intMultiplyFloat(0, 0.1)).toEqual(0);
    expect(intMultiplyFloat(0, 0.01)).toEqual(0);
    expect(intMultiplyFloat(0, 0.02)).toEqual(0);
    expect(intMultiplyFloat(0, 0.03)).toEqual(0);
  });

  it('1 multiply float or int cases', () => {
    expect(intMultiplyFloat(1, 0)).toEqual(0);
    expect(intMultiplyFloat(1, 1)).toEqual(1);
    expect(intMultiplyFloat(1, 10)).toEqual(10);
    expect(intMultiplyFloat(1, 0.1)).toEqual(0.1);
    expect(intMultiplyFloat(1, 0.01)).toEqual(0.01);
    expect(intMultiplyFloat(1, 0.02)).toEqual(0.02);
    expect(intMultiplyFloat(1, 0.03)).toEqual(0.03);
  });
});

