import { Vector4, Matrix4 } from '@galacean/effects-math';

const x = 2;
const y = 3;
const z = 4;
const w = 5;
const eps = 0.0001;

describe('Maths', () => {
  describe('Vector4', () => {
    // INSTANCING
    it('Instancing', () => {
      let a = new Vector4();

      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);
      expect(a.z).toEqual(0);
      expect(a.w).toEqual(0);

      a = new Vector4(x, y, z, w);
      expect(a.x).toEqual(x);
      expect(a.y).toEqual(y);
      expect(a.z).toEqual(z);
      expect(a.w).toEqual(w);
    });

    it('set', () => {
      const a = new Vector4();

      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);
      expect(a.z).toEqual(0);
      expect(a.w).toEqual(0);

      a.set(x, y, z, w);
      expect(a.x).toEqual(x);
      expect(a.y).toEqual(y);
      expect(a.z).toEqual(z);
      expect(a.w).toEqual(w);
    });

    it('copyFrom', () => {
      const a = new Vector4(x, y, z, w);
      const b = new Vector4().copyFrom(a);

      expect(b.x).toEqual(x);
      expect(b.y).toEqual(y);
      expect(b.z).toEqual(z);
      expect(b.w).toEqual(w);

      // ensure that it is a true copy
      a.x = 0;
      a.y = - 1;
      a.z = - 2;
      a.w = - 3;
      expect(b.x).toEqual(x);
      expect(b.y).toEqual(y);
      expect(b.z).toEqual(z);
      expect(b.w).toEqual(w);
    });

    it('add', () => {
      const a = new Vector4(x, y, z, w);
      const b = new Vector4(- x, - y, - z, - w);

      a.add(b);
      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);
      expect(a.z).toEqual(0);
      expect(a.w).toEqual(0);
    });

    it('addVectors', () => {
      const b = new Vector4(- x, - y, - z, - w);
      const c = new Vector4().addVectors(b, b);

      expect(c.x).toEqual(- 2 * x);
      expect(c.y).toEqual(- 2 * y);
      expect(c.z).toEqual(- 2 * z);
      expect(c.w).toEqual(- 2 * w);
    });

    it('addScaledVector', () => {
      const a = new Vector4(x, y, z, w);
      const b = new Vector4(6, 7, 8, 9);
      const s = 3;

      a.addScaledVector(b, s);
      expect(a.x).toEqual(x + b.x * s);
      expect(a.y).toEqual(y + b.y * s);
      expect(a.z).toEqual(z + b.z * s);
      expect(a.w).toEqual(w + b.w * s);
    });

    it('sub', () => {
      const a = new Vector4(x, y, z, w);
      const b = new Vector4(- x, - y, - z, - w);

      a.subtract(b);
      expect(a.x).toEqual(2 * x);
      expect(a.y).toEqual(2 * y);
      expect(a.z).toEqual(2 * z);
      expect(a.w).toEqual(2 * w);
    });

    it('subtractVectors', () => {
      const a = new Vector4(x, y, z, w);
      const c = new Vector4().subtractVectors(a, a);

      expect(c.x).toEqual(0);
      expect(c.y).toEqual(0);
      expect(c.z).toEqual(0);
      expect(c.w).toEqual(0);
    });

    it('applyMatrix4', () => {
      const a = new Vector4(x, y, z, w);
      const m = new Matrix4().setFromRotationX(Math.PI);
      const expected = new Vector4(2, - 3, - 4, 5);

      a.applyMatrix(m);
      expect(Math.abs(a.x - expected.x) <= eps).toEqual(true);
      expect(Math.abs(a.y - expected.y) <= eps).toEqual(true);
      expect(Math.abs(a.z - expected.z) <= eps).toEqual(true);
      expect(Math.abs(a.w - expected.w) <= eps).toEqual(true);

      a.set(x, y, z, w);
      m.setFromTranslation(5, 7, 11);
      expected.set(27, 38, 59, 5);

      a.applyMatrix(m);
      expect(Math.abs(a.x - expected.x) <= eps).toEqual(true);
      expect(Math.abs(a.y - expected.y) <= eps).toEqual(true);
      expect(Math.abs(a.z - expected.z) <= eps).toEqual(true);
      expect(Math.abs(a.w - expected.w) <= eps).toEqual(true);

      a.set(x, y, z, w);
      m.setFromRowMajorData(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0);
      expected.set(2, 3, 4, 4);

      a.applyMatrix(m);
      expect(Math.abs(a.x - expected.x) <= eps).toEqual(true);
      expect(Math.abs(a.y - expected.y) <= eps).toEqual(true);
      expect(Math.abs(a.z - expected.z) <= eps).toEqual(true);
      expect(Math.abs(a.w - expected.w) <= eps).toEqual(true);

      a.set(x, y, z, w);
      m.setFromRowMajorData(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53);
      expected.set(68, 224, 442, 664);

      a.applyMatrix(m);
      expect(Math.abs(a.x - expected.x) <= eps).toEqual(true);
      expect(Math.abs(a.y - expected.y) <= eps).toEqual(true);
      expect(Math.abs(a.z - expected.z) <= eps).toEqual(true);
      expect(Math.abs(a.w - expected.w) <= eps).toEqual(true);
    });

    it('clamp', () => {
      const a = new Vector4(- 0.1, 0.01, 0.5, 1.5);
      const clamped = new Vector4(0.1, 0.1, 0.5, 1.0);

      a.clamp(0.1, 1.0);
      expect(Math.abs(a.x - clamped.x) <= eps).toEqual(true);
      expect(Math.abs(a.y - clamped.y) <= eps).toEqual(true);
      expect(Math.abs(a.z - clamped.z) <= eps).toEqual(true);
      expect(Math.abs(a.w - clamped.w) <= eps).toEqual(true);
    });

    it('negate', () => {
      const a = new Vector4(x, y, z, w);

      a.negate();
      expect(a.x).toEqual(- x);
      expect(a.y).toEqual(- y);
      expect(a.z).toEqual(- z);
      expect(a.w).toEqual(- w);
    });

    it('dot', () => {
      const a = new Vector4(x, y, z, w);
      const b = new Vector4(- x, - y, - z, - w);
      const c = new Vector4(0, 0, 0, 0);
      let result = a.dot(b);

      expect(result).toEqual((- x * x - y * y - z * z - w * w));

      result = a.dot(c);
      expect(result).toEqual(0);
    });

    it('normalize', () => {
      const a = new Vector4(x, 0, 0, 0);
      const b = new Vector4(0, - y, 0, 0);
      const c = new Vector4(0, 0, z, 0);
      const d = new Vector4(0, 0, 0, - w);

      a.normalize();
      expect(a.length()).toEqual(1);
      expect(a.x).toEqual(1);

      b.normalize();
      expect(b.length()).toEqual(1);
      expect(b.y).toEqual(- 1);

      c.normalize();
      expect(c.length()).toEqual(1);
      expect(c.z).toEqual(1);

      d.normalize();
      expect(d.length()).toEqual(1);
      expect(d.w).toEqual(- 1);
    });

    it('setLength', () => {
      let a = new Vector4(x, 0, 0, 0);

      expect(a.length()).toEqual(x);
      a.setLength(y);
      expect(a.length()).toEqual(y);

      a = new Vector4(0, 0, 0, 0);
      expect(a.length()).toEqual(0);
      a.setLength(y);
      expect(a.length()).toEqual(0);
    });

    it('equals', () => {
      const a = new Vector4(x, 0, z, 0);
      const b = new Vector4(0, - y, 0, - w);

      expect(a.x != b.x).toEqual(true);
      expect(a.y != b.y).toEqual(true);
      expect(a.z != b.z).toEqual(true);
      expect(a.w != b.w).toEqual(true);

      expect(!a.equals(b)).toEqual(true);
      expect(!b.equals(a)).toEqual(true);

      a.copyFrom(b);
      expect(a.x).toEqual(b.x);
      expect(a.y).toEqual(b.y);
      expect(a.z).toEqual(b.z);
      expect(a.w).toEqual(b.w);

      expect(a.equals(b)).toEqual(true);
      expect(b.equals(a)).toEqual(true);
    });

    it('setFromArray', () => {
      const a = new Vector4();
      const array = [1, 2, 3, 4, 5, 6, 7, 8];

      a.setFromArray(array);
      expect(a.x).toEqual(1);
      expect(a.y).toEqual(2);
      expect(a.z).toEqual(3);
      expect(a.w).toEqual(4);

      a.setFromArray(array, 4);
      expect(a.x).toEqual(5);
      expect(a.y).toEqual(6);
      expect(a.z).toEqual(7);
      expect(a.w).toEqual(8);
    });

    it('toArray', () => {
      const a = new Vector4(x, y, z, w);
      const array = a.toArray();

      expect(array[0]).toEqual(x);
      expect(array[1]).toEqual(y);
      expect(array[2]).toEqual(z);
      expect(array[3]).toEqual(w);
    });

    it('setElement,getElement', () => {
      const a = new Vector4();

      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);
      expect(a.z).toEqual(0);
      expect(a.w).toEqual(0);

      a.setElement(0, 1);
      a.setElement(1, 2);
      a.setElement(2, 3);
      a.setElement(3, 4);
      expect(a.getElement(0)).toEqual(1);
      expect(a.getElement(1)).toEqual(2);
      expect(a.getElement(2)).toEqual(3);
      expect(a.getElement(3)).toEqual(4);
    });

    it('setFromNumber/add/subtract', () => {
      const a = new Vector4();
      const s = 3;

      a.setFromNumber(s);
      expect(a.x).toEqual(s);
      expect(a.y).toEqual(s);
      expect(a.z).toEqual(s);
      expect(a.w).toEqual(s);

      a.add(s);
      expect(a.x).toEqual(2 * s);
      expect(a.y).toEqual(2 * s);
      expect(a.z).toEqual(2 * s);
      expect(a.w).toEqual(2 * s);

      a.subtract(2 * s);
      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);
      expect(a.z).toEqual(0);
      expect(a.w).toEqual(0);
    });

    it('multiply/divide', () => {
      const a = new Vector4(x, y, z, w);
      const b = new Vector4(- x, - y, - z, - w);

      a.multiply(- 2);
      expect(a.x).toEqual(x * - 2);
      expect(a.y).toEqual(y * - 2);
      expect(a.z).toEqual(z * - 2);
      expect(a.w).toEqual(w * - 2);

      b.multiply(- 2);
      expect(b.x).toEqual(2 * x);
      expect(b.y).toEqual(2 * y);
      expect(b.z).toEqual(2 * z);
      expect(b.w).toEqual(2 * w);

      a.divide(- 2);
      expect(a.x).toEqual(x);
      expect(a.y).toEqual(y);
      expect(a.z).toEqual(z);
      expect(a.w).toEqual(w);

      b.divide(- 2);
      expect(b.x).toEqual(- x);
      expect(b.y).toEqual(- y);
      expect(b.z).toEqual(- z);
      expect(b.w).toEqual(- w);
    });

    it('min/max/clamp', () => {
      const a = new Vector4(x, y, z, w);
      const b = new Vector4(- x, - y, - z, - w);
      const c = new Vector4();

      c.copyFrom(a).min(b);
      expect(c.x).toEqual(- x);
      expect(c.y).toEqual(- y);
      expect(c.z).toEqual(- z);
      expect(c.w).toEqual(- w);

      c.copyFrom(a).max(b);
      expect(c.x).toEqual(x);
      expect(c.y).toEqual(y);
      expect(c.z).toEqual(z);
      expect(c.w).toEqual(w);

      c.set(- 2 * x, 2 * y, - 2 * z, 2 * w);
      c.clamp(b, a);
      expect(c.x).toEqual(- x);
      expect(c.y).toEqual(y);
      expect(c.z).toEqual(- z);
      expect(c.w).toEqual(w);
    });

    it('length/lengthSquared', () => {
      const a = new Vector4(x, 0, 0, 0);
      const b = new Vector4(0, - y, 0, 0);
      const c = new Vector4(0, 0, z, 0);
      const d = new Vector4(0, 0, 0, w);
      const e = new Vector4(0, 0, 0, 0);

      expect(a.length()).toEqual(x);
      expect(a.lengthSquared()).toEqual(x * x);
      expect(b.length()).toEqual(y);
      expect(b.lengthSquared()).toEqual(y * y);
      expect(c.length()).toEqual(z);
      expect(c.lengthSquared()).toEqual(z * z);
      expect(d.length()).toEqual(w);
      expect(d.lengthSquared()).toEqual(w * w);
      expect(e.length()).toEqual(0);
      expect(e.lengthSquared()).toEqual(0);

      a.set(x, y, z, w);
      expect(a.length()).toEqual(Math.sqrt(x * x + y * y + z * z + w * w));
      expect(a.lengthSquared()).toEqual((x * x + y * y + z * z + w * w));
    });

    it('lerp/clone', () => {
      const a = new Vector4(x, 0, z, 0);
      const b = new Vector4(0, - y, 0, - w);

      expect(a.lerp(a, 0).equals(a.lerp(a, 0.5))).toEqual(true);
      expect(a.lerp(a, 0).equals(a.lerp(a, 1))).toEqual(true);

      expect(a.clone().lerp(b, 0).equals(a)).toEqual(true);

      expect(a.clone().lerp(b, 0.5).x).toEqual(x * 0.5);
      expect(a.clone().lerp(b, 0.5).y).toEqual(- y * 0.5);
      expect(a.clone().lerp(b, 0.5).z).toEqual(z * 0.5);
      expect(a.clone().lerp(b, 0.5).w).toEqual(- w * 0.5);

      expect(a.clone().lerp(b, 1).equals(b)).toEqual(true);
    });
  });
});
