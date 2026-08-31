import { Box2, Circle, Vector2 } from '@galacean/effects-math';

describe('Maths', () => {
  describe('Circle', () => {
    it('checks whether an AABB is contained', () => {
      const box = new Box2(new Vector2(-1, -1), new Vector2(1, 1));

      expect(new Circle(new Vector2(), 2).containsBox(box)).toBe(true);
      expect(new Circle(new Vector2(), Math.sqrt(2)).containsBox(box)).toBe(false);
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
  });
});
