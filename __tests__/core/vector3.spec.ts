import { Vector3, Vector4, Matrix3, Matrix4, Euler } from '@galacean/effects-math';

const x = 2;
const y = 3;
const z = 4;
const eps = 0.0001;

describe('Maths', () => {
  describe('Vector3', () => {
    // INSTANCING
    it('Instancing', () => {
      let a = new Vector3();

      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);
      expect(a.z).toEqual(0);

      a = new Vector3(x, y, z);
      expect(a.x).toEqual(x);
      expect(a.y).toEqual(y);
      expect(a.z).toEqual(z);
    });

    it('set', () => {
      const a = new Vector3();

      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);
      expect(a.z).toEqual(0);

      a.set(x, y, z);
      expect(a.x).toEqual(x);
      expect(a.y).toEqual(y);
      expect(a.z).toEqual(z);
    });

    it('copyFrom', () => {
      const a = new Vector3(x, y, z);
      const b = new Vector3().copyFrom(a);

      expect(b.x).toEqual(x);
      expect(b.y).toEqual(y);
      expect(b.z).toEqual(z);

      // ensure that it is a true copy
      a.x = 0;
      a.y = - 1;
      a.z = - 2;
      expect(b.x).toEqual(x);
      expect(b.y).toEqual(y);
      expect(b.z).toEqual(z);
    });

    it('add', () => {
      const a = new Vector3(x, y, z);
      const b = new Vector3(- x, - y, - z);

      a.add(b);
      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);
      expect(a.z).toEqual(0);

      const c = new Vector3().addVectors(b, b);

      expect(c.x).toEqual(- 2 * x);
      expect(c.y).toEqual(- 2 * y);
      expect(c.z).toEqual(- 2 * z);
    });

    it('addScaledVector', () => {
      const a = new Vector3(x, y, z);
      const b = new Vector3(2, 3, 4);
      const s = 3;

      a.addScaledVector(b, s);
      expect(a.x).toEqual(x + b.x * s);
      expect(a.y).toEqual(y + b.y * s);
      expect(a.z).toEqual(z + b.z * s);
    });

    it('sub', () => {
      const a = new Vector3(x, y, z);
      const b = new Vector3(- x, - y, - z);

      a.subtract(b);
      expect(a.x).toEqual(2 * x);
      expect(a.y).toEqual(2 * y);
      expect(a.z).toEqual(2 * z);

      const c = new Vector3().subtractVectors(a, a);

      expect(c.x).toEqual(0);
      expect(c.y).toEqual(0);
      expect(c.z).toEqual(0);
    });

    it('multiplyVectors', () => {
      const a = new Vector3(x, y, z);
      const b = new Vector3(2, 3, - 5);
      const c = new Vector3().multiplyVectors(a, b);

      expect(c.x).toEqual(x * 2);
      expect(c.y).toEqual(y * 3);
      expect(c.z).toEqual(z * - 5);
    });

    it('applyEuler', () => {
      const a = new Vector3(x, y, z);
      const euler = new Euler(90, - 45, 0);
      const expected = new Vector3(-0.7071067811865479, -3.999999999999999, 3.5355339059327373);

      a.applyEuler(euler);
      expect(Math.abs(a.x - expected.x) <= eps).toEqual(true);
      expect(Math.abs(a.y - expected.y) <= eps).toEqual(true);
      expect(Math.abs(a.z - expected.z) <= eps).toEqual(true);
    });

    it('applyMatrix3', () => {
      const a = new Vector3(x, y, z);
      const m = new Matrix3().set(2, 3, 5, 7, 11, 13, 17, 19, 23).transpose();

      a.applyMatrix(m);
      expect(a.x).toEqual(33);
      expect(a.y).toEqual(99);
      expect(a.z).toEqual(183);
    });

    it('applyMatrix4', () => {
      const a = new Vector3(x, y, z);
      const b = new Vector4(x, y, z, 1);
      let m = new Matrix4().setFromRotationX(Math.PI);

      a.applyProjectionMatrix(m);
      b.applyMatrix(m);
      expect(a.x).toEqual(b.x / b.w);
      expect(a.y).toEqual(b.y / b.w);
      expect(a.z).toEqual(b.z / b.w);

      m = new Matrix4().setFromTranslation(3, 2, 1);
      a.applyProjectionMatrix(m);
      b.applyMatrix(m);
      expect(a.x).toEqual(b.x / b.w);
      expect(a.y).toEqual(b.y / b.w);
      expect(a.z).toEqual(b.z / b.w);

      m = new Matrix4().set(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 1, 0
      ).transpose();
      a.applyProjectionMatrix(m);
      b.applyMatrix(m);
      expect(a.x).toEqual(b.x / b.w);
      expect(a.y).toEqual(b.y / b.w);
      expect(a.z).toEqual(b.z / b.w);
    });

    it('applyNormalMatrix', () => {
      const a = new Vector3(x, y, z);
      const m = new Matrix4();
      const transformed = new Vector3(0.3713906763541037, 0.5570860145311556, 0.7427813527082074);

      a.applyNormalMatrix(m);
      expect(Math.abs(a.x - transformed.x) <= eps).toEqual(true);
      expect(Math.abs(a.y - transformed.y) <= eps).toEqual(true);
      expect(Math.abs(a.z - transformed.z) <= eps).toEqual(true);
    });

    it('clamp', () => {
      const a = new Vector3(- 0.01, 0.5, 1.5);
      const clamped = new Vector3(0.1, 0.5, 1.0);

      a.clamp(0.1, 1.0);
      expect(Math.abs(a.x - clamped.x) <= 0.001).toEqual(true);
      expect(Math.abs(a.y - clamped.y) <= 0.001).toEqual(true);
      expect(Math.abs(a.z - clamped.z) <= 0.001).toEqual(true);
    });

    it('negate', () => {
      const a = new Vector3(x, y, z);

      a.negate();
      expect(a.x).toEqual(- x);
      expect(a.y).toEqual(- y);
      expect(a.z).toEqual(- z);
    });

    it('dot', () => {
      const a = new Vector3(x, y, z);
      const b = new Vector3(- x, - y, - z);
      const c = new Vector3();
      let result = a.dot(b);

      expect(result).toEqual((- x * x - y * y - z * z));

      result = a.dot(c);
      expect(result).toEqual(0);
    });

    it('normalize', () => {
      const a = new Vector3(x, 0, 0);
      const b = new Vector3(0, - y, 0);
      const c = new Vector3(0, 0, z);

      a.normalize();
      expect(a.length()).toEqual(1);
      expect(a.x).toEqual(1);

      b.normalize();
      expect(b.length()).toEqual(1);
      expect(b.y).toEqual(- 1);

      c.normalize();
      expect(c.length()).toEqual(1);
      expect(c.z).toEqual(1);
    });

    it('setLength', () => {
      let a = new Vector3(x, 0, 0);

      expect(a.length()).toEqual(x);
      a.setLength(y);
      expect(a.length()).toEqual(y);

      a = new Vector3(0, 0, 0);
      expect(a.length()).toEqual(0);
      a.setLength(y);
      expect(a.length()).toEqual(0);
    });

    it('cross', () => {
      const a = new Vector3(x, y, z);
      const b = new Vector3(2 * x, - y, 0.5 * z);
      const crossed = new Vector3(18, 12, - 18);

      a.cross(b);
      expect(Math.abs(a.x - crossed.x) <= eps).toEqual(true);
      expect(Math.abs(a.y - crossed.y) <= eps).toEqual(true);
      expect(Math.abs(a.z - crossed.z) <= eps).toEqual(true);
    });

    it('crossVectors', () => {
      const a = new Vector3(x, y, z);
      const b = new Vector3(x, - y, z);
      const c = new Vector3();
      const crossed = new Vector3(24, 0, - 12);

      c.crossVectors(a, b);
      expect(Math.abs(c.x - crossed.x) <= eps).toEqual(true);
      expect(Math.abs(c.y - crossed.y) <= eps).toEqual(true);
      expect(Math.abs(c.z - crossed.z) <= eps).toEqual(true);
    });

    it('reflect', () => {
      const a = new Vector3();
      const normal = new Vector3(0, 1, 0);
      const b = new Vector3();

      a.set(0, - 1, 0);
      expect(b.copyFrom(a).reflect(normal).equals(new Vector3(0, 1, 0))).toEqual(true);

      a.set(1, - 1, 0);
      expect(b.copyFrom(a).reflect(normal).equals(new Vector3(1, 1, 0))).toEqual(true);

      a.set(1, - 1, 0);
      normal.set(0, - 1, 0);
      expect(b.copyFrom(a).reflect(normal).equals(new Vector3(1, 1, 0))).toEqual(true);
    });

    it('equals', () => {
      const a = new Vector3(x, 0, z);
      const b = new Vector3(0, - y, 0);

      expect(a.x != b.x).toEqual(true);
      expect(a.y != b.y).toEqual(true);
      expect(a.z != b.z).toEqual(true);

      expect(!a.equals(b)).toEqual(true);
      expect(!b.equals(a)).toEqual(true);

      a.copyFrom(b);
      expect(a.x).toEqual(b.x);
      expect(a.y).toEqual(b.y);
      expect(a.z).toEqual(b.z);

      expect(a.equals(b)).toEqual(true);
      expect(b.equals(a)).toEqual(true);
    });

    it('setFromArray', () => {
      const a = new Vector3();
      const array = [1, 2, 3, 4, 5, 6];

      a.setFromArray(array);
      expect(a.x).toEqual(1);
      expect(a.y).toEqual(2);
      expect(a.z).toEqual(3);

      a.setFromArray(array, 3);
      expect(a.x).toEqual(4);
      expect(a.y).toEqual(5);
      expect(a.z).toEqual(6);
    });

    it('toArray', () => {
      const a = new Vector3(x, y, z);
      const array = a.toArray();

      expect(array[0]).toEqual(x);
      expect(array[1]).toEqual(y);
      expect(array[2]).toEqual(z);
    });

    it('setElement,getElement', () => {
      const a = new Vector3();

      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);
      expect(a.z).toEqual(0);

      a.setElement(0, 1);
      a.setElement(1, 2);
      a.setElement(2, 3);
      expect(a.getElement(0)).toEqual(1);
      expect(a.getElement(1)).toEqual(2);
      expect(a.getElement(2)).toEqual(3);
    });

    it('min/max/clamp', () => {
      const a = new Vector3(x, y, z);
      const b = new Vector3(- x, - y, - z);
      const c = new Vector3();

      c.copyFrom(a).min(b);
      expect(c.x).toEqual(- x);
      expect(c.y).toEqual(- y);
      expect(c.z).toEqual(- z);

      c.copyFrom(a).max(b);
      expect(c.x).toEqual(x);
      expect(c.y).toEqual(y);
      expect(c.z).toEqual(z);

      c.set(- 2 * x, 2 * y, - 2 * z);
      c.clamp(b, a);
      expect(c.x).toEqual(- x);
      expect(c.y).toEqual(y);
      expect(c.z).toEqual(- z);
    });

    it('distance/distanceSquared', () => {
      const a = new Vector3(x, 0, 0);
      const b = new Vector3(0, - y, 0);
      const c = new Vector3(0, 0, z);
      const d = new Vector3();

      expect(a.distance(d)).toEqual(x);
      expect(a.distanceSquared(d)).toEqual(x * x);

      expect(b.distance(d)).toEqual(y);
      expect(b.distanceSquared(d)).toEqual(y * y);

      expect(c.distance(d)).toEqual(z);
      expect(c.distanceSquared(d)).toEqual(z * z);
    });

    it('setFromNumber/add/subtract', () => {
      const a = new Vector3();
      const s = 3;

      a.setFromNumber(s);
      expect(a.x).toEqual(s);
      expect(a.y).toEqual(s);
      expect(a.z).toEqual(s);

      a.add(s);
      expect(a.x).toEqual(2 * s);
      expect(a.y).toEqual(2 * s);
      expect(a.z).toEqual(2 * s);

      a.subtract(2 * s);
      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);
      expect(a.z).toEqual(0);
    });

    it('multiply/divide', () => {
      const a = new Vector3(x, y, z);
      const b = new Vector3(2 * x, 2 * y, 2 * z);
      const c = new Vector3(4 * x, 4 * y, 4 * z);

      a.multiply(b);
      expect(a.x).toEqual(x * b.x);
      expect(a.y).toEqual(y * b.y);
      expect(a.z).toEqual(z * b.z);

      b.divide(c);
      expect(Math.abs(b.x - 0.5) <= eps).toEqual(true);
      expect(Math.abs(b.y - 0.5) <= eps).toEqual(true);
      expect(Math.abs(b.z - 0.5) <= eps).toEqual(true);
    });

    it('multiply/divide', () => {
      const a = new Vector3(x, y, z);
      const b = new Vector3(- x, - y, - z);

      a.multiply(- 2);
      expect(a.x).toEqual(x * - 2);
      expect(a.y).toEqual(y * - 2);
      expect(a.z).toEqual(z * - 2);

      b.multiply(- 2);
      expect(b.x).toEqual(2 * x);
      expect(b.y).toEqual(2 * y);
      expect(b.z).toEqual(2 * z);

      a.divide(- 2);
      expect(a.x).toEqual(x);
      expect(a.y).toEqual(y);
      expect(a.z).toEqual(z);

      b.divide(- 2);
      expect(b.x).toEqual(- x);
      expect(b.y).toEqual(- y);
      expect(b.z).toEqual(- z);
    });

    it('length/lengthSquared', () => {
      const a = new Vector3(x, 0, 0);
      const b = new Vector3(0, - y, 0);
      const c = new Vector3(0, 0, z);
      const d = new Vector3();

      expect(a.length()).toEqual(x);
      expect(a.lengthSquared()).toEqual(x * x);
      expect(b.length()).toEqual(y);
      expect(b.lengthSquared()).toEqual(y * y);
      expect(c.length()).toEqual(z);
      expect(c.lengthSquared()).toEqual(z * z);
      expect(d.length()).toEqual(0);
      expect(d.lengthSquared()).toEqual(0);

      a.set(x, y, z);
      expect(a.length()).toEqual(Math.sqrt(x * x + y * y + z * z));
      expect(a.lengthSquared()).toEqual((x * x + y * y + z * z));
    });

    it('lerp/clone', () => {
      const a = new Vector3(x, 0, z);
      const b = new Vector3(0, - y, 0);

      expect(a.lerp(a, 0).equals(a.lerp(a, 0.5))).toEqual(true);
      expect(a.lerp(a, 0).equals(a.lerp(a, 1))).toEqual(true);

      expect(a.clone().lerp(b, 0).equals(a)).toEqual(true);

      expect(a.clone().lerp(b, 0.5).x).toEqual(x * 0.5);
      expect(a.clone().lerp(b, 0.5).y).toEqual(- y * 0.5);
      expect(a.clone().lerp(b, 0.5).z).toEqual(z * 0.5);

      expect(a.clone().lerp(b, 1).equals(b)).toEqual(true);
    });
  });
});
