import { Line2, Vector2 } from '@galacean/effects-math';

describe('Maths', () => {
  describe('Line2', () => {
    it('handles zero-length segments when finding the closest point', () => {
      const line = new Line2(new Vector2(1, 2), new Vector2(1, 2));

      expect(line.closestPointToPointParameter(new Vector2(5, 6), false)).toBe(0);
      expect(line.closestPointToPoint(new Vector2(5, 6), true).equals(new Vector2(1, 2))).toBe(true);
    });

    it('detects crossings, endpoint contact, and collinear overlap', () => {
      const line = new Line2(new Vector2(0, 0), new Vector2(2, 0));

      expect(line.crossWithLine(new Line2(new Vector2(1, -1), new Vector2(1, 1)))).toBe(true);
      expect(line.crossWithLine(new Line2(new Vector2(2, 0), new Vector2(3, 1)))).toBe(true);
      expect(line.crossWithLine(new Line2(new Vector2(1, 0), new Vector2(3, 0)))).toBe(true);
      expect(line.crossWithLine(new Line2(new Vector2(3, 0), new Vector2(4, 0)))).toBe(false);
    });
  });
});
