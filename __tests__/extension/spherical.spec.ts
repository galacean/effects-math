import { Spherical, Vector3 } from '@galacean/effects-math';

describe('Maths', () => {
  describe('Spherical', () => {
    it('converts spherical coordinates to Cartesian coordinates', () => {
      expect(new Spherical(2, 0, 1).getCartesianCoords().equals(new Vector3(0, 2, 0))).toBe(true);

      const point = new Spherical(2, Math.PI / 2, Math.PI / 2).getCartesianCoords();

      expect(point.x).toBeCloseTo(2);
      expect(point.y).toBeCloseTo(0);
      expect(point.z).toBeCloseTo(0);
    });

    it('round trips Cartesian coordinates', () => {
      const point = new Vector3(2, -3, 4);
      const result = new Spherical().setFromVec3(point).getCartesianCoords();

      expect(result.x).toBeCloseTo(point.x);
      expect(result.y).toBeCloseTo(point.y);
      expect(result.z).toBeCloseTo(point.z);
    });
  });
});
