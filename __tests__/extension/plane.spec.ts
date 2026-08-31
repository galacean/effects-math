import { Plane, Vector3 } from '@galacean/effects-math';

describe('Maths', () => {
  describe('Plane', () => {
    it('uses a finite fallback for a zero normal', () => {
      const plane = new Plane(2, new Vector3());

      expect(plane.normal.equals(Vector3.Z)).toBe(true);
      expect(plane.distance).toBe(2);
      expect(Number.isFinite(plane.distanceToPoint(new Vector3()))).toBe(true);
    });
  });
});
