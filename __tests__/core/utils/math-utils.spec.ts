import * as MathUtils from '@galacean/effects-math';

describe('Maths', () => {
  describe('Math', () => {
    it('clamp', () => {
      expect(MathUtils.clamp(0.5, 0, 1)).toEqual(0.5);
      expect(MathUtils.clamp(0, 0, 1)).toEqual(0);
      expect(MathUtils.clamp(- 0.1, 0, 1)).toEqual(0);
      expect(MathUtils.clamp(1.1, 0, 1)).toEqual(1);
    });

    it('euclideanModulo', () => {
      expect(isNaN(MathUtils.euclideanModulo(6, 0))).toEqual(true);
      expect(MathUtils.euclideanModulo(6, 1)).toEqual(0);
      expect(MathUtils.euclideanModulo(6, 2)).toEqual(0);
      expect(MathUtils.euclideanModulo(6, 5)).toEqual(1);
      expect(MathUtils.euclideanModulo(6, 6)).toEqual(0);
      expect(MathUtils.euclideanModulo(6, 7)).toEqual(6);
    });

    it('mapLinear', () => {
      expect(MathUtils.mapLinear(0.5, 0, 1, 0, 10)).toEqual(5);
      expect(MathUtils.mapLinear(0.0, 0, 1, 0, 10)).toEqual(0);
      expect(MathUtils.mapLinear(1.0, 0, 1, 0, 10)).toEqual(10);
    });

    it('inverseLerp', () => {
      expect(MathUtils.inverseLerp(1, 2, 1.5)).toEqual(0.5);
      expect(MathUtils.inverseLerp(1, 2, 2)).toEqual(1);
      expect(MathUtils.inverseLerp(1, 2, 1)).toEqual(0);
      expect(MathUtils.inverseLerp(1, 1, 1)).toEqual(0);
    });

    it('lerp', () => {
      expect(MathUtils.lerp(1, 2, 0)).toEqual(1);
      expect(MathUtils.lerp(1, 2, 1)).toEqual(2);
      expect(MathUtils.lerp(1, 2, 0.4)).toEqual(1.4);
    });

    it('damp', () => {
      expect(MathUtils.damp(1, 2, 0, 0.016)).toEqual(1);
      expect(MathUtils.damp(1, 2, 10, 0.016)).toEqual(1.1478562110337887);
    });

    it('pingpong', () => {
      expect(MathUtils.pingpong(2.5)).toEqual(0.5);
      expect(MathUtils.pingpong(2.5, 2)).toEqual(1.5);
      expect(MathUtils.pingpong(- 1.5)).toEqual(0.5);
    });

    it('smoothstep', () => {
      expect(MathUtils.smoothstep(- 1, 0, 2)).toEqual(0);
      expect(MathUtils.smoothstep(0, 0, 2)).toEqual(0);
      expect(MathUtils.smoothstep(0.5, 0, 2)).toEqual(0.15625);
      expect(MathUtils.smoothstep(1, 0, 2)).toEqual(0.5);
      expect(MathUtils.smoothstep(1.5, 0, 2)).toEqual(0.84375);
      expect(MathUtils.smoothstep(2, 0, 2)).toEqual(1);
      expect(MathUtils.smoothstep(3, 0, 2)).toEqual(1);
    });

    it('smootherstep', () => {
      expect(MathUtils.smootherstep(- 1, 0, 2)).toEqual(0);
      expect(MathUtils.smootherstep(0, 0, 2)).toEqual(0);
      expect(MathUtils.smootherstep(0.5, 0, 2)).toEqual(0.103515625);
      expect(MathUtils.smootherstep(1, 0, 2)).toEqual(0.5);
      expect(MathUtils.smootherstep(1.5, 0, 2)).toEqual(0.896484375);
      expect(MathUtils.smootherstep(2, 0, 2)).toEqual(1);
      expect(MathUtils.smootherstep(3, 0, 2)).toEqual(1);
    });

    it('randInt', () => {
      const low = 1;
      const high = 3;
      const a = MathUtils.randInt(low, high);

      expect(a >= low).toEqual(true);
      expect(a <= high).toEqual(true);
    });

    it('randFloat', () => {
      const low = 1;
      const high = 3;
      const a = MathUtils.randFloat(low, high);

      expect(a >= low).toEqual(true);
      expect(a <= high).toEqual(true);
    });

    it('randFloatSpread', () => {
      const a = MathUtils.randFloatSpread(3);

      expect(a > - 3 / 2).toEqual(true);
      expect(a < 3 / 2).toEqual(true);
    });

    it('degToRad', () => {
      expect(MathUtils.degToRad(0)).toEqual(0);
      expect(MathUtils.degToRad(90)).toEqual(Math.PI / 2);
      expect(MathUtils.degToRad(180)).toEqual(Math.PI);
      expect(MathUtils.degToRad(360)).toEqual(Math.PI * 2);
    });

    it('radToDeg', () => {
      expect(MathUtils.radToDeg(0)).toEqual(0);
      expect(MathUtils.radToDeg(Math.PI / 2)).toEqual(90);
      expect(MathUtils.radToDeg(Math.PI)).toEqual(180);
      expect(MathUtils.radToDeg(Math.PI * 2)).toEqual(360);
    });

    it('isPowerOfTwo', () => {
      expect(MathUtils.isPowerOfTwo(0)).toEqual(false);
      expect(MathUtils.isPowerOfTwo(1)).toEqual(true);
      expect(MathUtils.isPowerOfTwo(2)).toEqual(true);
      expect(MathUtils.isPowerOfTwo(3)).toEqual(false);
      expect(MathUtils.isPowerOfTwo(4)).toEqual(true);
    });

    it('ceilPowerOfTwo', () => {
      expect(MathUtils.ceilPowerOfTwo(1)).toEqual(1);
      expect(MathUtils.ceilPowerOfTwo(3)).toEqual(4);
      expect(MathUtils.ceilPowerOfTwo(4)).toEqual(4);
    });

    it('floorPowerOfTwo', () => {
      expect(MathUtils.floorPowerOfTwo(1)).toEqual(1);
      expect(MathUtils.floorPowerOfTwo(3)).toEqual(2);
      expect(MathUtils.floorPowerOfTwo(4)).toEqual(4);
    });
  });
});
