import { Quaternion, Vector3, Vector4, Euler, Matrix4, EulerOrder, RAD2DEG } from '@galacean/effects-math';

const x = 2;
const y = 3;
const z = 4;
const w = 5;
const eps = 0.0001;

const orders = [EulerOrder.XYZ, EulerOrder.YXZ, EulerOrder.ZXY, EulerOrder.ZYX, EulerOrder.YZX, EulerOrder.XZY];
const eulerAngles = new Euler(0.1, - 0.3, 0.25);

function qSub (a: Quaternion, b: Quaternion) {
  const result = new Quaternion();

  result.copyFrom(a);

  result.x -= b.x;
  result.y -= b.y;
  result.z -= b.z;
  result.w -= b.w;

  return result;
}

function changeEulerOrder (euler: Euler, order: EulerOrder) {
  return new Euler(euler.x, euler.y, euler.z, order);
}

describe('Maths', () => {
  describe('Quaternion', () => {
    // INSTANCING
    it('Instancing', () => {
      let a = new Quaternion();

      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);
      expect(a.z).toEqual(0);
      expect(a.w).toEqual(1);

      a = new Quaternion(x, y, z, w);
      expect(a.x).toEqual(x);
      expect(a.y).toEqual(y);
      expect(a.z).toEqual(z);
      expect(a.w).toEqual(w);
    });

    // PROPERTIES
    it('properties', () => {
      const a = new Quaternion();

      a.x = x;
      a.y = y;
      a.z = z;
      a.w = w;

      expect(a.x).toEqual(x);
      expect(a.y).toEqual(y);
      expect(a.z).toEqual(z);
      expect(a.w).toEqual(w);
    });

    it('x', () => {
      let a = new Quaternion();

      expect(a.x).toEqual(0);

      a = new Quaternion(1, 2, 3);
      expect(a.x).toEqual(1);

      a = new Quaternion(4, 5, 6, 1);
      expect(a.x).toEqual(4);

      a = new Quaternion(7, 8, 9);
      a.x = 10;
      expect(a.x).toEqual(10);

      a = new Quaternion(11, 12, 13);
      a.x = 14;
      expect(a.x).toEqual(14);
    });

    it('y', () => {
      let a = new Quaternion();

      expect(a.y).toEqual(0);

      a = new Quaternion(1, 2, 3);
      expect(a.y).toEqual(2);

      a = new Quaternion(4, 5, 6, 1);
      expect(a.y).toEqual(5);

      a = new Quaternion(7, 8, 9);
      a.y = 10;
      expect(a.y).toEqual(10);

      a = new Quaternion(11, 12, 13);
      a.y = 14;
      expect(a.y).toEqual(14);
    });

    it('z', () => {
      let a = new Quaternion();

      expect(a.z).toEqual(0);

      a = new Quaternion(1, 2, 3);
      expect(a.z).toEqual(3);

      a = new Quaternion(4, 5, 6, 1);
      expect(a.z).toEqual(6);

      a = new Quaternion(7, 8, 9);
      a.z = 10;
      expect(a.z).toEqual(10);

      a = new Quaternion(11, 12, 13);
      a.z = 14;
      expect(a.z).toEqual(14);
    });

    it('w', () => {
      let a = new Quaternion();

      expect(a.w).toEqual(1);

      a = new Quaternion(1, 2, 3);
      expect(a.w).toEqual(1);

      a = new Quaternion(4, 5, 6, 1);
      expect(a.w).toEqual(1);

      a = new Quaternion(7, 8, 9);
      a.w = 10;
      expect(a.w).toEqual(10);

      a = new Quaternion(11, 12, 13);
      a.w = 14;
      expect(a.w).toEqual(14);
    });

    it('set', () => {
      const a = new Quaternion();

      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);
      expect(a.z).toEqual(0);
      expect(a.w).toEqual(1);

      a.set(x, y, z, w);
      expect(a.x).toEqual(x);
      expect(a.y).toEqual(y);
      expect(a.z).toEqual(z);
      expect(a.w).toEqual(w);
    });

    it('clone', () => {
      const a = new Quaternion().clone();

      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);
      expect(a.z).toEqual(0);
      expect(a.w).toEqual(1);

      const b = a.set(x, y, z, w).clone();

      expect(b.x).toEqual(x);
      expect(b.y).toEqual(y);
      expect(b.z).toEqual(z);
      expect(b.w).toEqual(w);
    });

    it('copyFrom', () => {
      const a = new Quaternion(x, y, z, w);
      const b = new Quaternion().copyFrom(a);

      expect(b.x).toEqual(x);
      expect(b.y).toEqual(y);
      expect(b.z).toEqual(z);
      expect(b.w).toEqual(w);

      // ensure that it is a true copy
      a.x = 0;
      a.y = - 1;
      a.z = 0;
      a.w = - 1;
      expect(b.x).toEqual(x);
      expect(b.y).toEqual(y);
    });

    it('setFromEuler/setFromQuaternion', () => {
      const angles = [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)];

      // ensure euler conversion to/from Quaternion matches.
      for (let i = 0; i < orders.length; i++) {
        for (let j = 0; j < angles.length; j++) {
          const eulers2 = new Euler().setFromQuaternion(new Quaternion().setFromEuler(new Euler(angles[j].x, angles[j].y, angles[j].z, orders[i])), orders[i]);
          const newAngle = new Vector3(eulers2.x, eulers2.y, eulers2.z);

          expect(newAngle.distance(angles[j]) < 0.001).toEqual(true);
        }
      }
    });

    it('setFromAxisAngle', () => {
      const zero = new Quaternion();
      let a = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), 0);

      expect(a.equals(zero)).toEqual(true);
      a = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 0);
      expect(a.equals(zero)).toEqual(true);
      a = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), 0);
      expect(a.equals(zero)).toEqual(true);

      const b1 = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI);

      expect(!a.equals(b1)).toEqual(true);
      const b2 = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), - Math.PI);

      expect(!a.equals(b2)).toEqual(true);

      b1.multiply(b2);
      expect(a.equals(b1)).toEqual(true);
    });

    it('setFromEuler/setFromRotationMatrix', () => {
      // ensure euler conversion for Quaternion matches that of Matrix4
      for (let i = 0; i < orders.length; i++) {
        const q = new Quaternion().setFromEuler(changeEulerOrder(eulerAngles, orders[i]));
        const m = new Matrix4().setFromEuler(changeEulerOrder(eulerAngles, orders[i]));
        const q2 = new Quaternion().setFromRotationMatrix(m);

        expect(qSub(q, q2).length() < 0.001).toEqual(true);
      }
    });

    it('setFromRotationMatrix', () => {
      // contrived examples purely to please the god of code coverage...
      // match conditions in various 'else [if]' blocks

      const a = new Quaternion();
      let q = new Quaternion(- 9, - 2, 3, - 4).normalize();
      const m = new Matrix4().setFromQuaternion(q);
      let expected = new Vector4(-0.8581163303210332, -0.19069251784911848, 0.2860387767736777, -0.38138503569823695);

      a.setFromRotationMatrix(m);
      expect(Math.abs(a.x - expected.x) <= eps).toEqual(true);
      expect(Math.abs(a.y - expected.y) <= eps).toEqual(true);
      expect(Math.abs(a.z - expected.z) <= eps).toEqual(true);
      expect(Math.abs(a.w - expected.w) <= eps).toEqual(true);

      q = new Quaternion(- 1, - 2, 1, - 1).normalize();
      m.setFromQuaternion(q);
      expected = new Vector4(-0.37796447300922714, -0.7559289460184544, 0.37796447300922714, -0.37796447300922714);

      a.setFromRotationMatrix(m);
      expect(Math.abs(a.x - expected.x) <= eps).toEqual(true);
      expect(Math.abs(a.y - expected.y) <= eps).toEqual(true);
      expect(Math.abs(a.z - expected.z) <= eps).toEqual(true);
      expect(Math.abs(a.w - expected.w) <= eps).toEqual(true);
    });

    it('setFromUnitVectors', () => {
      const a = new Quaternion();
      const b = new Vector3(1, 0, 0);
      const c = new Vector3(0, 1, 0);
      const expected = new Quaternion(0, 0, Math.sqrt(2) / 2, Math.sqrt(2) / 2);

      a.setFromUnitVectors(b, c);
      expect(Math.abs(a.x - expected.x) <= eps).toEqual(true);
      expect(Math.abs(a.y - expected.y) <= eps).toEqual(true);
      expect(Math.abs(a.z - expected.z) <= eps).toEqual(true);
      expect(Math.abs(a.w - expected.w) <= eps).toEqual(true);
    });

    it('angleTo', () => {
      const a = new Quaternion();
      const b = new Quaternion().setFromEuler(new Euler(0, 180, 0));
      const c = new Quaternion().setFromEuler(new Euler(0, 360, 0));

      expect(a.angleTo(a)).toEqual(0);
      expect(a.angleTo(b)).toEqual(Math.PI);
      expect(a.angleTo(c)).toEqual(0);
    });

    it('rotateTowards', () => {
      const a = new Quaternion();
      const b = new Quaternion().setFromEuler(new Euler(0, Math.PI, 0));
      const c = new Quaternion();
      const halfPI = Math.PI * 0.5;

      a.rotateTowards(b, 0);
      expect(a.equals(a)).toEqual(true);

      a.rotateTowards(b, Math.PI * 2); // test overshoot
      expect(a.equals(b)).toEqual(true);

      a.set(0, 0, 0, 1);
      a.rotateTowards(b, halfPI);
      expect(a.angleTo(c) - halfPI <= eps).toEqual(true);
    });

    it('identity', () => {
      const a = new Quaternion();

      a.set(x, y, z, w);
      a.identity();

      expect(a.x).toEqual(0);
      expect(a.y).toEqual(0);
      expect(a.z).toEqual(0);
      expect(a.w).toEqual(1);
    });

    it('invert/conjugate', () => {
      const a = new Quaternion(x, y, z, w);
      // TODO: add better validation here.
      const b = a.clone().conjugate();

      expect(a.x).toEqual(- b.x);
      expect(a.y).toEqual(- b.y);
      expect(a.z).toEqual(- b.z);
      expect(a.w).toEqual(b.w);
    });

    it('dot', () => {
      let a = new Quaternion();
      let b = new Quaternion();

      expect(a.dot(b)).toEqual(1);
      a = new Quaternion(1, 2, 3, 1);
      b = new Quaternion(3, 2, 1, 1);

      expect(a.dot(b)).toEqual(11);
    });

    it('normalize/length/lengthSquared', () => {
      const a = new Quaternion(x, y, z, w);

      expect(a.length() != 1).toEqual(true);
      expect(a.lengthSquared() != 1).toEqual(true);
      a.normalize();
      expect(a.length()).toEqual(1);
      expect(a.lengthSquared()).toEqual(1);

      a.set(0, 0, 0, 0);
      expect(a.lengthSquared()).toEqual(0);
      expect(a.length()).toEqual(0);
      a.normalize();
      expect(a.lengthSquared()).toEqual(1);
      expect(a.length()).toEqual(1);
    });

    it('multiplyQuaternions/multiply', () => {
      const angles = [new Euler(1, 0, 0), new Euler(0, 1, 0), new Euler(0, 0, 1)];

      const q1 = new Quaternion().setFromEuler(changeEulerOrder(angles[0], EulerOrder.XYZ));
      const q2 = new Quaternion().setFromEuler(changeEulerOrder(angles[1], EulerOrder.XYZ));
      const q3 = new Quaternion().setFromEuler(changeEulerOrder(angles[2], EulerOrder.XYZ));

      const q = new Quaternion().multiplyQuaternions(q1, q2).multiply(q3);

      const m1 = new Matrix4().setFromEuler(changeEulerOrder(angles[0], EulerOrder.XYZ));
      const m2 = new Matrix4().setFromEuler(changeEulerOrder(angles[1], EulerOrder.XYZ));
      const m3 = new Matrix4().setFromEuler(changeEulerOrder(angles[2], EulerOrder.XYZ));

      const m = new Matrix4().multiplyMatrices(m1, m2).multiply(m3);

      const qFromM = new Quaternion().setFromRotationMatrix(m);

      expect(qSub(q, qFromM).length() < 0.001).toEqual(true);
    });

    it('premultiply', () => {
      const a = new Quaternion(x, y, z, w);
      const b = new Quaternion(2 * x, - y, - 2 * z, w);
      const expected = new Quaternion(42, - 32, - 2, 58);

      a.premultiply(b);
      expect(Math.abs(a.x - expected.x) <= eps).toEqual(true);
      expect(Math.abs(a.y - expected.y) <= eps).toEqual(true);
      expect(Math.abs(a.z - expected.z) <= eps).toEqual(true);
      expect(Math.abs(a.w - expected.w) <= eps).toEqual(true);
    });

    it('slerp', () => {
      const a = new Quaternion(x, y, z, w);
      const b = new Quaternion(- x, - y, - z, - w);

      const c = a.clone().slerp(b, 0);
      const d = a.clone().slerp(b, 1);

      expect(a.equals(c)).toEqual(true);
      expect(b.equals(d)).toEqual(true);

      const D = Math.SQRT1_2;

      const e = new Quaternion(1, 0, 0, 0);
      const f = new Quaternion(0, 0, 1, 0);
      let expected = new Quaternion(D, 0, D, 0);
      let result = e.clone().slerp(f, 0.5);

      expect(Math.abs(result.x - expected.x) <= eps).toEqual(true);
      expect(Math.abs(result.y - expected.y) <= eps).toEqual(true);
      expect(Math.abs(result.z - expected.z) <= eps).toEqual(true);
      expect(Math.abs(result.w - expected.w) <= eps).toEqual(true);

      const g = new Quaternion(0, D, 0, D);
      const h = new Quaternion(0, - D, 0, D);

      expected = new Quaternion(0, 0, 0, 1);
      result = g.clone().slerp(h, 0.5);

      expect(Math.abs(result.x - expected.x) <= eps).toEqual(true);
      expect(Math.abs(result.y - expected.y) <= eps).toEqual(true);
      expect(Math.abs(result.z - expected.z) <= eps).toEqual(true);
      expect(Math.abs(result.w - expected.w) <= eps).toEqual(true);
    });

    it('slerpQuaternions', () => {
      const e = new Quaternion(1, 0, 0, 0);
      const f = new Quaternion(0, 0, 1, 0);
      const expected = new Quaternion(Math.SQRT1_2, 0, Math.SQRT1_2, 0);

      const a = new Quaternion();

      a.slerpQuaternions(e, f, 0.5);

      expect(Math.abs(a.x - expected.x) <= eps).toEqual(true);
      expect(Math.abs(a.y - expected.y) <= eps).toEqual(true);
      expect(Math.abs(a.z - expected.z) <= eps).toEqual(true);
      expect(Math.abs(a.w - expected.w) <= eps).toEqual(true);
    });

    it('equals', () => {
      const a = new Quaternion(x, y, z, w);
      const b = new Quaternion(- x, - y, - z, - w);

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
      const a = new Quaternion();

      a.setFromArray([x, y, z, w]);
      expect(a.x).toEqual(x);
      expect(a.y).toEqual(y);
      expect(a.z).toEqual(z);
      expect(a.w).toEqual(w);

      // @ts-expect-error
      a.setFromArray([undefined, x, y, z, w, undefined], 1);
      expect(a.x).toEqual(x);
      expect(a.y).toEqual(y);
      expect(a.z).toEqual(z);
      expect(a.w).toEqual(w);
    });

    it('toArray', () => {
      const a = new Quaternion(x, y, z, w);
      const array = a.toArray();

      expect(array[0]).toEqual(x);
      expect(array[1]).toEqual(y);
      expect(array[2]).toEqual(z);
      expect(array[3]).toEqual(w);
    });

    // OTHERS
    it('multiplyVector3', () => {
      const angles = [new Euler(RAD2DEG, 0, 0), new Euler(0, RAD2DEG, 0), new Euler(0, 0, RAD2DEG)];

      // ensure euler conversion for Quaternion matches that of Matrix4
      for (let i = 0; i < orders.length; i++) {
        for (let j = 0; j < angles.length; j++) {
          const q = new Quaternion().setFromEuler(changeEulerOrder(angles[j], orders[i]));
          const m = new Matrix4().setFromEuler(changeEulerOrder(angles[j], orders[i]));

          const v0 = new Vector3(1, 0, 0);
          const qv = v0.clone().applyQuaternion(q);
          const mv = v0.clone().applyMatrix(m);

          expect(qv.distance(mv) < 0.001).toEqual(true);
        }
      }
    });
  });
});
