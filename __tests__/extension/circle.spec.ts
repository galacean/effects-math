import { Box2, Circle, Vector2 } from '@galacean/effects-math';

describe('Maths', () => {
  describe('Circle', () => {
    it('checks whether an AABB is contained', () => {
      const box = new Box2(new Vector2(-1, -1), new Vector2(1, 1));

      expect(new Circle(new Vector2(), 2).containsBox(box)).toBe(true);
      expect(new Circle(new Vector2(), Math.sqrt(2)).containsBox(box)).toBe(true);
      expect(new Circle(new Vector2(), 2).containsBox(new Box2())).toBe(false);
    });

    it('checks intersections using the closest point on an AABB', () => {
      const circle = new Circle(new Vector2(), 1);

      expect(circle.intersectsBox(new Box2(
        new Vector2(-2, -2),
        new Vector2(2, 2),
      ))).toBe(true);
      expect(circle.intersectsBox(new Box2(
        new Vector2(1, -0.5),
        new Vector2(2, 0.5),
      ))).toBe(true);
      expect(circle.intersectsBox(new Box2(
        new Vector2(0.8, 0.8),
        new Vector2(2, 2),
      ))).toBe(false);
      expect(circle.intersectsBox(new Box2())).toBe(false);
    });

    it('distinguishes empty circles from point circles', () => {
      const pointCircle = new Circle(new Vector2(1, 2), 0);
      const emptyCircle = new Circle().makeEmpty();

      expect(pointCircle.isEmpty()).toBe(false);
      expect(pointCircle.containsPoint(new Vector2(1, 2))).toBe(true);
      expect(pointCircle.containsPoint(new Vector2(1, 2.001))).toBe(false);
      expect(emptyCircle.isEmpty()).toBe(true);
      expect(emptyCircle.containsPoint(new Vector2())).toBe(false);
    });

    it('expands without excluding existing contents', () => {
      const circle = new Circle(new Vector2(), 2);

      circle.expandByPoint(new Vector2(1, 0));
      expect(circle.equals(new Circle(new Vector2(), 2))).toBe(true);

      circle.expandByPoint(new Vector2(4, 0));
      expect(circle.center.equals(new Vector2(1, 0))).toBe(true);
      expect(circle.radius).toBe(3);

      const empty = new Circle().makeEmpty().expandByPoint(new Vector2(2, 3));

      expect(empty.equals(new Circle(new Vector2(2, 3), 0))).toBe(true);
    });

    it('computes a minimal enclosing union', () => {
      const circle = new Circle(new Vector2(), 1).union(new Circle(new Vector2(4, 0), 1));

      expect(circle.equals(new Circle(new Vector2(2, 0), 3))).toBe(true);
      expect(new Circle(new Vector2(), 1).union(new Circle(new Vector2(), 2))
        .equals(new Circle(new Vector2(), 2))).toBe(true);
      expect(new Circle().makeEmpty().union(new Circle(new Vector2(4, 0), 1))
        .equals(new Circle(new Vector2(4, 0), 1))).toBe(true);
    });

    it('returns a conservative circle for intersections', () => {
      const unit = new Circle(new Vector2(), 1);

      expect(unit.clone().intersect(unit).equals(unit)).toBe(true);
      expect(new Circle(new Vector2(), 3).intersect(new Circle(new Vector2(1, 0), 1))
        .equals(new Circle(new Vector2(1, 0), 1))).toBe(true);
      expect(new Circle(new Vector2(), 1).intersect(new Circle(new Vector2(3, 0), 1)).isEmpty()).toBe(true);
    });
  });
});
