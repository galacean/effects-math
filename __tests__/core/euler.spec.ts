import { Euler, EulerOrder, Matrix4, Quaternion } from '@galacean/effects-math';

const x = 2;
const y = 3;
const z = 4;
const eulerZero = new Euler(0, 0, 0, EulerOrder.ZYX);
const eulerAxyz = new Euler(1, 0, 0, EulerOrder.XYZ);
const eulerAzyx = new Euler(0, 1, 0, EulerOrder.ZYX);

describe('Maths', () => {
  describe('Euler', () => {
    // INSTANCING
    it('Instancing', () => {
      const a = new Euler();

      expect(a.equals(eulerZero)).toEqual(true);
      expect(!a.equals(eulerAxyz)).toEqual(true);
      expect(!a.equals(eulerAzyx)).toEqual(true);
    });

    // STATIC STUFF
    it('DEFAULT_ORDER', () => {
      expect(Euler.DEFAULT_ORDER).toEqual(EulerOrder.ZYX);
    });

    // PROPERTIES STUFF
    it('x', () => {
      let a = new Euler();

      expect(a.x).toEqual(0);

      a = new Euler(1, 2, 3);
      expect(a.x).toEqual(1);

      a = new Euler(4, 5, 6, EulerOrder.XYZ);
      expect(a.x).toEqual(4);

      a = new Euler(7, 8, 9, EulerOrder.XYZ);
      a.x = 10;
      expect(a.x).toEqual(10);

      a = new Euler(11, 12, 13, EulerOrder.XYZ);
      a.x = 14;
      expect(a.x).toEqual(14);
    });

    it('y', () => {
      let a = new Euler();

      expect(a.y).toEqual(0);

      a = new Euler(1, 2, 3);
      expect(a.y).toEqual(2);

      a = new Euler(4, 5, 6, EulerOrder.XYZ);
      expect(a.y).toEqual(5);

      a = new Euler(7, 8, 9, EulerOrder.XYZ);
      a.y = 10;
      expect(a.y).toEqual(10);

      a = new Euler(11, 12, 13, EulerOrder.XYZ);
      a.y = 14;
      expect(a.y).toEqual(14);
    });

    it('z', () => {
      let a = new Euler();

      expect(a.z).toEqual(0);

      a = new Euler(1, 2, 3);
      expect(a.z).toEqual(3);

      a = new Euler(4, 5, 6, EulerOrder.XYZ);
      expect(a.z).toEqual(6);

      a = new Euler(7, 8, 9, EulerOrder.XYZ);
      a.z = 10;
      expect(a.z).toEqual(10);

      a = new Euler(11, 12, 13, EulerOrder.XYZ);
      a.z = 14;
      expect(a.z).toEqual(14);
    });

    it('order', () => {
      let a = new Euler();

      expect(a.order).toEqual(Euler.DEFAULT_ORDER);

      a = new Euler(1, 2, 3);
      expect(a.order).toEqual(Euler.DEFAULT_ORDER);

      a = new Euler(4, 5, 6, EulerOrder.YZX);
      expect(a.order).toEqual(EulerOrder.YZX);

      a = new Euler(7, 8, 9, EulerOrder.YZX);
      a.order = EulerOrder.ZXY;
      expect(a.order).toEqual(EulerOrder.ZXY);

      a = new Euler(11, 12, 13, EulerOrder.YZX);
      a.order = EulerOrder.ZXY;
      expect(a.order).toEqual(EulerOrder.ZXY);
    });

    it('clone/copy/equals', () => {
      const a = eulerAxyz.clone();

      expect(a.equals(eulerAxyz)).toEqual(true);
      expect(!a.equals(eulerZero)).toEqual(true);
      expect(!a.equals(eulerAzyx)).toEqual(true);

      a.copyFrom(eulerAzyx);
      expect(a.equals(eulerAzyx)).toEqual(true);
      expect(!a.equals(eulerAxyz)).toEqual(true);
      expect(!a.equals(eulerZero)).toEqual(true);
    });

    it('Quaternion.setFromEuler/Euler.setFromQuaternion', () => {
      const testValues = [eulerZero, eulerAxyz, eulerAzyx];

      for (let i = 0; i < testValues.length; i++) {
        const v = testValues[i];
        const q = new Quaternion().setFromEuler(v);

        const v2 = new Euler().setFromQuaternion(q, v.order);
        const q2 = new Quaternion().setFromEuler(v2);

        expect(quatEquals(q, q2)).toEqual(true);
      }
    });

    it('Matrix4.setFromEuler/Euler.setFromRotationMatrix', () => {
      const testValues = [eulerZero, eulerAxyz, eulerAzyx];

      for (let i = 0; i < testValues.length; i++) {
        const v = testValues[i];
        const m = new Matrix4().setFromEuler(v);

        const v2 = new Euler().setFromRotationMatrix4(m, v.order);
        const m2 = new Matrix4().setFromEuler(v2);

        expect(matrixEquals4(m, m2, 0.0001)).toEqual(true);
      }
    });

    it('reorder', () => {
      const testValues = [eulerZero, eulerAxyz, eulerAzyx];

      for (let i = 0; i < testValues.length; i++) {
        const v = testValues[i];
        const q = new Quaternion().setFromEuler(v);

        v.reorder(EulerOrder.YZX);
        const q2 = new Quaternion().setFromEuler(v);

        expect(quatEquals(q, q2)).toEqual(true);

        v.reorder(EulerOrder.ZXY);
        const q3 = new Quaternion().setFromEuler(v);

        expect(quatEquals(q, q3)).toEqual(true);
      }
    });

    it('set/get properties, check callbacks', () => {
      const a = new Euler();

      a.x = 1;
      a.y = 2;
      a.z = 3;
      a.order = EulerOrder.ZYX;

      expect(a.x).toEqual(1);
      expect(a.y).toEqual(2);
      expect(a.z).toEqual(3);
      expect(a.order).toEqual(EulerOrder.ZYX);
    });

    it('clone/copy, check callbacks', () => {
      let a = new Euler(1, 2, 3, EulerOrder.ZXY);
      const b = new Euler(4, 5, 6, EulerOrder.XZY);

      a = b.clone();
      expect(a.equals(b)).toEqual(true);

      // copy triggers onChange once
      a = new Euler(1, 2, 3, EulerOrder.ZXY);
      a.copyFrom(b);
      expect(a.equals(b)).toEqual(true);
    });

    it('toArray', () => {
      const order = EulerOrder.YXZ;
      const a = new Euler(x, y, z, order);

      const array = a.toArray();

      expect(array[0]).toEqual(x);
      expect(array[1]).toEqual(y);
      expect(array[2]).toEqual(z);
    });

    it('setFromArray', () => {
      let a = new Euler();
      let array = [x, y, z];

      a.setFromArray(array);
      expect(a.x).toEqual(x);
      expect(a.y).toEqual(y);
      expect(a.z).toEqual(z);
      expect(a.order).toEqual(EulerOrder.ZYX);

      a = new Euler();
      array = [x, y, z, EulerOrder.XYZ];
      a.setFromArray(array);
      expect(a.x).toEqual(x);
      expect(a.y).toEqual(y);
      expect(a.z).toEqual(z);
      expect(a.order).toEqual(EulerOrder.XYZ);
    });
  });
});

function matrixEquals4 (a: Matrix4, b: Matrix4, tolerance?: number) {
  tolerance = tolerance || 0.0001;
  if (a.elements.length != b.elements.length) {
    return false;
  }

  for (let i = 0, il = a.elements.length; i < il; i++) {
    const delta = a.elements[i] - b.elements[i];

    if (delta > tolerance) {
      return false;
    }
  }

  return true;
}

function quatEquals (a: Quaternion, b: Quaternion, tolerance?: number) {
  tolerance = tolerance || 0.0001;
  const diff = Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z) + Math.abs(a.w - b.w);

  return (diff < tolerance);
}
