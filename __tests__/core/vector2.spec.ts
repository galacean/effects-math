import { Vector2 } from '@galacean/effects-math';

const x = 2;
const y = 3;
const eps = 0.0001;

describe('Maths', () => {
  describe('Vector2', () => {
    // INSTANCING
    it('Instancing', () => {
      let a = new Vector2();

      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);

      a = new Vector2(x, y);
      expect(a.x).toEqual(x);
      expect(a.y).toEqual(y);
    });

    it('set', () => {
      const a = new Vector2();

      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);

      a.set(x, y);
      expect(a.x).toEqual(x);
      expect(a.y).toEqual(y);
    });

    it('copyFrom', () => {
      const a = new Vector2(x, y);
      const b = new Vector2().copyFrom(a);

      expect(b.x).toEqual(x);
      expect(b.y).toEqual(y);

      // ensure that it is a true copy
      a.x = 0;
      a.y = - 1;
      expect(b.x).toEqual(x);
      expect(b.y).toEqual(y);
    });

    it('add', () => {
      const a = new Vector2(x, y);
      const b = new Vector2(- x, - y);

      a.add(b);
      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);

      const c = new Vector2().addVectors(b, b);

      expect(c.x).toEqual(- 2 * x);
      expect(c.y).toEqual(- 2 * y);
    });

    it('sub', () => {
      const a = new Vector2(x, y);
      const b = new Vector2(- x, - y);

      a.subtract(b);
      expect(a.x).toEqual(2 * x);
      expect(a.y).toEqual(2 * y);

      const c = new Vector2().subtractVectors(a, a);

      expect(c.x).toEqual(0);
      expect(c.y).toEqual(0);
    });

    it('negate', () => {
      const a = new Vector2(x, y);

      a.negate();
      expect(a.x).toEqual(- x);
      expect(a.y).toEqual(- y);
    });

    it('dot', () => {
      const a = new Vector2(x, y);
      const b = new Vector2(- x, - y);
      const c = new Vector2();

      let result = a.dot(b);

      expect(result).toEqual((- x * x - y * y));

      result = a.dot(c);
      expect(result).toEqual(0);
    });

    it('cross', () => {
      const a = new Vector2(x, y);
      const b = new Vector2(2 * x, - y);
      const answer = - 18;
      const crossed = a.cross(b);

      expect(Math.abs(answer - crossed) <= eps).toEqual(true);
    });

    it('normalize', () => {
      const a = new Vector2(x, 0);
      const b = new Vector2(0, - y);

      a.normalize();
      expect(a.length()).toEqual(1);
      expect(a.x).toEqual(1);

      b.normalize();
      expect(b.length()).toEqual(1);
      expect(b.y).toEqual(- 1);
    });

    it('setLength', () => {
      let a = new Vector2(x, 0);

      expect(a.length()).toEqual(x);
      a.setLength(y);
      expect(a.length()).toEqual(y);

      a = new Vector2(0, 0);
      expect(a.length()).toEqual(0);
      a.setLength(y);
      expect(a.length()).toEqual(0);
    });

    it('equals', () => {
      const a = new Vector2(x, 0);
      const b = new Vector2(0, - y);

      expect(a.x != b.x).toEqual(true);
      expect(a.y != b.y).toEqual(true);

      expect(!a.equals(b)).toEqual(true);
      expect(!b.equals(a)).toEqual(true);

      a.copyFrom(b);
      expect(a.x).toEqual(b.x);
      expect(a.y).toEqual(b.y);

      expect(a.equals(b)).toEqual(true);
      expect(b.equals(a)).toEqual(true);
    });

    it('setFromArray', () => {
      const a = new Vector2();
      const array = [1, 2, 3, 4];

      a.setFromArray(array);
      expect(a.x).toEqual(1);
      expect(a.y).toEqual(2);

      a.setFromArray(array, 2);
      expect(a.x).toEqual(3);
      expect(a.y).toEqual(4);
    });

    it('toArray', () => {
      const a = new Vector2(x, y);
      const array = a.toArray();

      expect(array[0]).toEqual(x);
      expect(array[1]).toEqual(y);
    });

    it('setElement,getElement', () => {
      const a = new Vector2();

      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);

      a.setElement(0, 1);
      a.setElement(1, 2);
      expect(a.getElement(0)).toEqual(1);
      expect(a.getElement(1)).toEqual(2);

    });

    it('multiply/divide', () => {
      const a = new Vector2(x, y);
      const b = new Vector2(- x, - y);

      a.multiply(- 2);
      expect(a.x).toEqual(x * - 2);
      expect(a.y).toEqual(y * - 2);

      b.multiply(- 2);
      expect(b.x).toEqual(2 * x);
      expect(b.y).toEqual(2 * y);

      a.divide(- 2);
      expect(a.x).toEqual(x);
      expect(a.y).toEqual(y);

      b.divide(- 2);
      expect(b.x).toEqual(- x);
      expect(b.y).toEqual(- y);
    });

    it('min/max/clamp', () => {
      const a = new Vector2(x, y);
      const b = new Vector2(- x, - y);
      const c = new Vector2();

      c.copyFrom(a).min(b);
      expect(c.x).toEqual(- x);
      expect(c.y).toEqual(- y);

      c.copyFrom(a).max(b);
      expect(c.x).toEqual(x);
      expect(c.y).toEqual(y);

      c.set(- 2 * x, 2 * y);
      c.clamp(b, a);
      expect(c.x).toEqual(- x);
      expect(c.y).toEqual(y);

      c.set(- 2 * x, 2 * x);
      c.clamp(- x, x);
      expect(c.x).toEqual(- x);
      expect(c.y).toEqual(x);
    });

    it('rounding', () => {
      expect(new Vector2(- 0.1, 0.1).floor()).toEqual(new Vector2(- 1, 0));
      expect(new Vector2(- 0.5, 0.5).floor()).toEqual(new Vector2(- 1, 0));
      expect(new Vector2(- 0.9, 0.9).floor()).toEqual(new Vector2(- 1, 0));
      expect(new Vector2(- 0.1, 0.1).ceil()).toEqual(new Vector2(-0, 1));
      expect(new Vector2(- 0.5, 0.5).ceil()).toEqual(new Vector2(-0, 1));
      expect(new Vector2(- 0.9, 0.9).ceil()).toEqual(new Vector2(-0, 1));

      expect(new Vector2(- 0.1, 0.1).round()).toEqual(new Vector2(-0, 0));
      expect(new Vector2(- 0.5, 0.5).round()).toEqual(new Vector2(-0, 1));
      expect(new Vector2(- 0.9, 0.9).round()).toEqual(new Vector2(- 1, 1));
    });

    it('length/lengthSquared', () => {
      const a = new Vector2(x, 0);
      const b = new Vector2(0, - y);
      const c = new Vector2();

      expect(a.length()).toEqual(x);
      expect(a.lengthSquared()).toEqual(x * x);
      expect(b.length()).toEqual(y);
      expect(b.lengthSquared()).toEqual(y * y);
      expect(c.length()).toEqual(0);
      expect(c.lengthSquared()).toEqual(0);

      a.set(x, y);
      expect(a.length()).toEqual(Math.sqrt(x * x + y * y));
      expect(a.lengthSquared()).toEqual((x * x + y * y));
    });

    it('distance/distanceSquared', () => {
      const a = new Vector2(x, 0);
      const b = new Vector2(0, - y);
      const c = new Vector2();

      expect(a.distance(c)).toEqual(x);
      expect(a.distanceSquared(c)).toEqual(x * x);

      expect(b.distance(c)).toEqual(y);
      expect(b.distanceSquared(c)).toEqual(y * y);
    });

    it('lerp/clone', () => {
      const a = new Vector2(x, 0);
      const b = new Vector2(0, - y);

      expect(a.lerp(a, 0).equals(a.lerp(a, 0.5))).toEqual(true);
      expect(a.lerp(a, 0).equals(a.lerp(a, 1))).toEqual(true);

      expect(a.clone().lerp(b, 0).equals(a)).toEqual(true);

      expect(a.clone().lerp(b, 0.5).x).toEqual(x * 0.5);
      expect(a.clone().lerp(b, 0.5).y).toEqual(- y * 0.5);

      expect(a.clone().lerp(b, 1).equals(b)).toEqual(true);
    });

    it('setFromNumber/add/subtract', () => {
      const a = new Vector2(1, 1);
      const s = 3;

      a.setFromNumber(s);
      expect(a.x).toEqual(s);
      expect(a.y).toEqual(s);

      a.add(s);
      expect(a.x).toEqual(2 * s);
      expect(a.y).toEqual(2 * s);

      a.subtract(2 * s);
      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);
    });

    it('multiply/divide', () => {
      const a = new Vector2(x, y);
      const b = new Vector2(2 * x, 2 * y);
      const c = new Vector2(4 * x, 4 * y);

      a.multiply(b);
      expect(a.x).toEqual(x * b.x);
      expect(a.y).toEqual(y * b.y);

      b.divide(c);
      expect(b.x).toEqual(0.5);
      expect(b.y).toEqual(0.5);
    });
  });
});
