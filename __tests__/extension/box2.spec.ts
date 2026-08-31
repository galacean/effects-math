import { Box2, Vector2 } from '@galacean/effects-math';

const negativeOne = new Vector2(-1, -1);
const zero = new Vector2(0, 0);
const one = new Vector2(1, 1);
const two = new Vector2(2, 2);
const positiveInfinity = new Vector2(+Infinity, +Infinity);
const negativeInfinity = new Vector2(-Infinity, -Infinity);

describe('Maths', () => {
  describe('Box2', () => {
    it('constructs an empty AABB without OBB state', () => {
      const box = new Box2();

      expect(box.min.equals(positiveInfinity)).toBe(true);
      expect(box.max.equals(negativeInfinity)).toBe(true);
      expect('corners' in box).toBe(false);
    });

    it('sets min and max', () => {
      const box = new Box2().set(zero, one);

      expect(box.min.equals(zero)).toBe(true);
      expect(box.max.equals(one)).toBe(true);
    });

    it('sets from points and supports empty and degenerate input', () => {
      const box = new Box2().setFromPoints([zero, one, two]);

      expect(box.min.equals(zero)).toBe(true);
      expect(box.max.equals(two)).toBe(true);

      box.setFromPoints([one]);
      expect(box.min.equals(one)).toBe(true);
      expect(box.max.equals(one)).toBe(true);
      expect(box.isEmpty()).toBe(false);

      box.setFromPoints([]);
      expect(box.isEmpty()).toBe(true);
    });

    it('sets from center and size', () => {
      const box = new Box2().setFromCenterAndSize(zero, two);

      expect(box.min.equals(negativeOne)).toBe(true);
      expect(box.max.equals(one)).toBe(true);

      box.setFromCenterAndSize(one, two);
      expect(box.min.equals(zero)).toBe(true);
      expect(box.max.equals(two)).toBe(true);
    });

    it('clones and copies without sharing min and max', () => {
      const source = new Box2(zero, one);
      const clone = source.clone();
      const copy = new Box2().copyFrom(source);

      source.min.set(-1, -1);
      source.max.set(2, 2);

      expect(clone.equals(new Box2(zero, one))).toBe(true);
      expect(copy.equals(new Box2(zero, one))).toBe(true);
    });

    it('makes a box empty and treats zero-area boxes as non-empty', () => {
      const pointBox = new Box2(zero, zero);
      const verticalLineBox = new Box2(zero, new Vector2(0, 1));
      const horizontalLineBox = new Box2(zero, new Vector2(1, 0));

      expect(pointBox.isEmpty()).toBe(false);
      expect(verticalLineBox.isEmpty()).toBe(false);
      expect(horizontalLineBox.isEmpty()).toBe(false);

      pointBox.makeEmpty();
      expect(pointBox.isEmpty()).toBe(true);
      expect(pointBox.min.equals(positiveInfinity)).toBe(true);
      expect(pointBox.max.equals(negativeInfinity)).toBe(true);
    });

    it('gets center and size', () => {
      const box = new Box2(negativeOne, one);
      const center = new Vector2();
      const size = new Vector2();

      expect(box.getCenter(center)).toBe(center);
      expect(center.equals(zero)).toBe(true);
      expect(box.getSize(size)).toBe(size);
      expect(size.equals(two)).toBe(true);

      const empty = new Box2();

      expect(empty.getCenter(center).equals(zero)).toBe(true);
      expect(empty.getSize(size).equals(zero)).toBe(true);
    });

    it('expands by point, vector and scalar', () => {
      const byPoint = new Box2(zero, zero)
        .expandByPoint(one)
        .expandByPoint(negativeOne);
      const byVector = new Box2(zero, zero).expandByVector(one);
      const byScalar = new Box2(zero, zero).expandByScalar(1);

      expect(byPoint.equals(new Box2(negativeOne, one))).toBe(true);
      expect(byVector.equals(new Box2(negativeOne, one))).toBe(true);
      expect(byScalar.equals(new Box2(negativeOne, one))).toBe(true);
    });

    it('checks point and box containment', () => {
      const pointBox = new Box2(zero, zero);
      const unitBox = new Box2(zero, one);
      const centeredBox = new Box2(negativeOne, one);

      expect(pointBox.containsPoint(zero)).toBe(true);
      expect(pointBox.containsPoint(one)).toBe(false);
      expect(centeredBox.containsPoint(negativeOne)).toBe(true);
      expect(centeredBox.containsPoint(one)).toBe(true);

      expect(pointBox.containsBox(pointBox)).toBe(true);
      expect(pointBox.containsBox(unitBox)).toBe(false);
      expect(unitBox.containsBox(pointBox)).toBe(true);
      expect(centeredBox.containsBox(unitBox)).toBe(true);
    });

    it('gets normalized parameters', () => {
      const box = new Box2(negativeOne, one);
      const target = new Vector2();

      expect(box.getParameter(negativeOne, target)).toBe(target);
      expect(target.equals(zero)).toBe(true);
      expect(box.getParameter(zero, target).equals(new Vector2(0.5, 0.5))).toBe(true);
      expect(box.getParameter(one, target).equals(one)).toBe(true);
    });

    it('checks AABB intersections including touching boundaries', () => {
      const pointBox = new Box2(zero, zero);
      const unitBox = new Box2(zero, one);
      const centeredBox = new Box2(negativeOne, one);

      expect(pointBox.intersectsBox(pointBox)).toBe(true);
      expect(pointBox.intersectsBox(unitBox)).toBe(true);
      expect(unitBox.intersectsBox(centeredBox)).toBe(true);

      unitBox.translate(two);
      expect(pointBox.intersectsBox(unitBox)).toBe(false);
      expect(unitBox.intersectsBox(centeredBox)).toBe(false);
    });

    it('clamps points and calculates distance', () => {
      const box = new Box2(negativeOne, one);
      const target = new Vector2();

      expect(box.clampPoint(two, target)).toBe(target);
      expect(target.equals(one)).toBe(true);
      expect(box.clampPoint(zero, target).equals(zero)).toBe(true);
      expect(box.distanceToPoint(zero)).toBe(0);
      expect(box.distanceToPoint(two)).toBeCloseTo(Math.sqrt(2));
    });

    it('intersects boxes and canonicalizes an empty result', () => {
      const overlap = new Box2(negativeOne, one).intersect(new Box2(zero, two));
      const disjoint = new Box2(one, two).intersect(new Box2(negativeOne, zero));

      expect(overlap.equals(new Box2(zero, one))).toBe(true);
      expect(disjoint.isEmpty()).toBe(true);
      expect(disjoint.min.equals(positiveInfinity)).toBe(true);
      expect(disjoint.max.equals(negativeInfinity)).toBe(true);
    });

    it('unions boxes', () => {
      const box = new Box2(zero, one).union(new Box2(negativeOne, zero));

      expect(box.equals(new Box2(negativeOne, one))).toBe(true);
    });

    it('translates boxes', () => {
      const box = new Box2(negativeOne, zero).translate(one);

      expect(box.equals(new Box2(zero, one))).toBe(true);
    });

    it('checks equality', () => {
      expect(new Box2().equals(new Box2())).toBe(true);
      expect(new Box2(one, two).equals(new Box2(one, two))).toBe(true);
      expect(new Box2(one, two).equals(new Box2(one, one))).toBe(false);
    });
  });
});
