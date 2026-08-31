import { Box3, Sphere, Vector3 } from '@galacean/effects-math';

describe('Maths', () => {
  describe('Sphere', () => {
    it('expands an empty sphere into a point sphere', () => {
      const sphere = new Sphere().expandByPoint(new Vector3(1, 2, 3));

      expect(sphere.center.equals(new Vector3(1, 2, 3))).toBe(true);
      expect(sphere.radius).toBe(0);
      expect(sphere.isEmpty()).toBe(false);
    });

    it('uses the farthest input point as the radius', () => {
      const points = [
        new Vector3(1, 0, 0), new Vector3(-1, 0, 0),
        new Vector3(0, 1, 0), new Vector3(0, -1, 0),
        new Vector3(0, 0, 1), new Vector3(0, 0, -1),
      ];
      const sphere = new Sphere().setFromPoints(points);

      expect(sphere.center.equals(new Vector3())).toBe(true);
      expect(sphere.radius).toBe(1);

      sphere.setFromPoints([new Vector3(3, 0, 0)], new Vector3(1, 0, 0));
      expect(sphere.center.equals(new Vector3(1, 0, 0))).toBe(true);
      expect(sphere.radius).toBe(2);
    });

    it('computes unions for empty, concentric, and separated spheres', () => {
      const large = new Sphere(new Vector3(), 2);

      expect(new Sphere().union(large).equals(large)).toBe(true);
      expect(new Sphere(new Vector3(), 1).union(large).equals(large)).toBe(true);
      expect(new Sphere(new Vector3(), 1).union(new Sphere(new Vector3(4, 0, 0), 1))
        .equals(new Sphere(new Vector3(2, 0, 0), 3))).toBe(true);
    });

    it('returns a conservative sphere for intersections', () => {
      const unit = new Sphere(new Vector3(), 1);

      expect(unit.clone().intersect(unit).equals(unit)).toBe(true);
      expect(new Sphere(new Vector3(), 3).intersect(new Sphere(new Vector3(1, 0, 0), 1))
        .equals(new Sphere(new Vector3(1, 0, 0), 1))).toBe(true);
      expect(new Sphere(new Vector3(), 1).intersect(new Sphere(new Vector3(3, 0, 0), 1)).isEmpty()).toBe(true);
    });

    it('keeps empty bounding volumes empty', () => {
      const sphere = new Sphere(new Vector3(5, 5, 5), 10);

      new Box3().getBoundingSphere(sphere);

      expect(sphere.isEmpty()).toBe(true);
      expect(new Box3().intersectsSphere(sphere)).toBe(false);

      new Box3(new Vector3(-1, -2, -3), new Vector3(1, 2, 3)).getBoundingSphere(sphere);
      expect(sphere.center.equals(new Vector3())).toBe(true);
      expect(sphere.radius).toBeCloseTo(Math.sqrt(14));
    });
  });
});
