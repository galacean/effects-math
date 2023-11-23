import { Matrix3, Matrix4 } from '@galacean/effects-math';

describe('Maths', () => {
  describe('Matrix3', () => {
    // INSTANCING
    it('Instancing', () => {
      const a = new Matrix3();

      expect(a.determinant()).toEqual(1);

      const b = new Matrix3().set(0, 1, 2, 3, 4, 5, 6, 7, 8);

      expect(b.elements[0]).toEqual(0);
      expect(b.elements[1]).toEqual(1);
      expect(b.elements[2]).toEqual(2);
      expect(b.elements[3]).toEqual(3);
      expect(b.elements[4]).toEqual(4);
      expect(b.elements[5]).toEqual(5);
      expect(b.elements[6]).toEqual(6);
      expect(b.elements[7]).toEqual(7);
      expect(b.elements[8]).toEqual(8);

      expect(matrixEquals3(a, b)).toEqual(false);
    });

    it('set', () => {
      const b = new Matrix3();

      expect(b.determinant()).toEqual(1);

      b.set(0, 3, 6, 1, 4, 7, 2, 5, 8);
      expect(b.elements[0]).toEqual(0);
      expect(b.elements[1]).toEqual(3);
      expect(b.elements[2]).toEqual(6);
      expect(b.elements[3]).toEqual(1);
      expect(b.elements[4]).toEqual(4);
      expect(b.elements[5]).toEqual(7);
      expect(b.elements[6]).toEqual(2);
      expect(b.elements[7]).toEqual(5);
      expect(b.elements[8]).toEqual(8);
    });

    it('identity', () => {
      const b = new Matrix3().set(0, 1, 2, 3, 4, 5, 6, 7, 8);

      expect(b.elements[0]).toEqual(0);
      expect(b.elements[1]).toEqual(1);
      expect(b.elements[2]).toEqual(2);
      expect(b.elements[3]).toEqual(3);
      expect(b.elements[4]).toEqual(4);
      expect(b.elements[5]).toEqual(5);
      expect(b.elements[6]).toEqual(6);
      expect(b.elements[7]).toEqual(7);
      expect(b.elements[8]).toEqual(8);

      const a = new Matrix3();

      expect(!matrixEquals3(a, b)).toEqual(true);

      b.identity();
      expect(matrixEquals3(a, b)).toEqual(true);
    });

    it('clone', () => {
      const a = new Matrix3().set(0, 1, 2, 3, 4, 5, 6, 7, 8);
      const b = a.clone();

      expect(matrixEquals3(a, b)).toEqual(true);

      // ensure that it is a true copy
      a.elements[0] = 2;
      expect(!matrixEquals3(a, b)).toEqual(true);
    });

    it('copyFrom', () => {
      const a = new Matrix3().set(0, 1, 2, 3, 4, 5, 6, 7, 8);
      const b = new Matrix3().copyFrom(a);

      expect(matrixEquals3(a, b)).toEqual(true);

      // ensure that it is a true copy
      a.elements[0] = 2;
      expect(!matrixEquals3(a, b)).toEqual(true);
    });

    it('setFromMatrix4', () => {
      const a = new Matrix4().set(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
      const b = new Matrix3();
      const c = new Matrix3().set(0, 1, 2, 4, 5, 6, 8, 9, 10);

      b.setFromMatrix4(a);
      expect(b.equals(c)).toEqual(true);
    });

    it('multiply/premultiply', () => {
      // both simply just wrap multiplyMatrices
      const a = new Matrix3().setFromRowMajorData(2, 3, 5, 7, 11, 13, 17, 19, 23);
      const b = new Matrix3().setFromRowMajorData(29, 31, 37, 41, 43, 47, 53, 59, 61);
      const expectedMultiply = [446, 1343, 2491, 486, 1457, 2701, 520, 1569, 2925];
      const expectedPremultiply = [904, 1182, 1556, 1131, 1489, 1967, 1399, 1845, 2435];

      a.multiply(b);
      expect(a.elements).toEqual(expectedMultiply);

      a.set(2, 3, 5, 7, 11, 13, 17, 19, 23).transpose();
      a.premultiply(b);
      expect(a.elements).toEqual(expectedPremultiply);
    });

    it('multiplyMatrices', () => {
      // Reference:
      //
      // #!/usr/bin/env python
      // from __future__ import print_function
      // import numpy as np
      // print(
      //     np.dot(
      //         np.reshape([2, 3, 5, 7, 11, 13, 17, 19, 23], (3, 3)),
      //         np.reshape([29, 31, 37, 41, 43, 47, 53, 59, 61], (3, 3))
      //     )
      // )
      //
      // [[ 446  486  520]
      //  [1343 1457 1569]
      //  [2491 2701 2925]]
      const lhs = new Matrix3().setFromRowMajorData(2, 3, 5, 7, 11, 13, 17, 19, 23);
      const rhs = new Matrix3().setFromRowMajorData(29, 31, 37, 41, 43, 47, 53, 59, 61);
      const ans = new Matrix3();

      ans.multiplyMatrices(lhs, rhs);

      expect(ans.elements[0]).toEqual(446);
      expect(ans.elements[1]).toEqual(1343);
      expect(ans.elements[2]).toEqual(2491);
      expect(ans.elements[3]).toEqual(486);
      expect(ans.elements[4]).toEqual(1457);
      expect(ans.elements[5]).toEqual(2701);
      expect(ans.elements[6]).toEqual(520);
      expect(ans.elements[7]).toEqual(1569);
      expect(ans.elements[8]).toEqual(2925);
    });

    it('multiply', () => {
      const b = new Matrix3().set(0, 1, 2, 3, 4, 5, 6, 7, 8).transpose();

      expect(b.elements[0]).toEqual(0);
      expect(b.elements[1]).toEqual(3);
      expect(b.elements[2]).toEqual(6);
      expect(b.elements[3]).toEqual(1);
      expect(b.elements[4]).toEqual(4);
      expect(b.elements[5]).toEqual(7);
      expect(b.elements[6]).toEqual(2);
      expect(b.elements[7]).toEqual(5);
      expect(b.elements[8]).toEqual(8);

      b.multiply(2);
      expect(b.elements[0]).toEqual(0 * 2);
      expect(b.elements[1]).toEqual(3 * 2);
      expect(b.elements[2]).toEqual(6 * 2);
      expect(b.elements[3]).toEqual(1 * 2);
      expect(b.elements[4]).toEqual(4 * 2);
      expect(b.elements[5]).toEqual(7 * 2);
      expect(b.elements[6]).toEqual(2 * 2);
      expect(b.elements[7]).toEqual(5 * 2);
      expect(b.elements[8]).toEqual(8 * 2);
    });

    it('determinant', () => {
      const a = new Matrix3();

      expect(a.determinant()).toEqual(1);

      a.elements[0] = 2;
      expect(a.determinant()).toEqual(2);

      a.elements[0] = 0;
      expect(a.determinant()).toEqual(0);

      // calculated via http://www.euclideanspace.com/maths/algebra/matrix/functions/determinant/threeD/index.htm
      a.set(2, 3, 4, 5, 13, 7, 8, 9, 11);
      expect(a.determinant()).toEqual(- 73);
    });

    it('invert', () => {
      const zero = new Matrix3().set(0, 0, 0, 0, 0, 0, 0, 0, 0);
      const identity4 = new Matrix4();
      const a = new Matrix3().set(0, 0, 0, 0, 0, 0, 0, 0, 0);
      const b = new Matrix3();

      b.copyFrom(a).invert();
      expect(matrixEquals3(b, zero)).toEqual(true);

      const testMatrices = [
        new Matrix4().setFromRotationX(0.3),
        new Matrix4().setFromRotationX(- 0.3),
        new Matrix4().setFromRotationY(0.3),
        new Matrix4().setFromRotationY(- 0.3),
        new Matrix4().setFromRotationZ(0.3),
        new Matrix4().setFromRotationZ(- 0.3),
        new Matrix4().setFromScale(1, 2, 3),
        new Matrix4().setFromScale(1 / 8, 1 / 2, 1 / 3),
      ];

      for (let i = 0, il = testMatrices.length; i < il; i++) {
        const m = testMatrices[i];

        a.setFromMatrix4(m);
        const mInverse3 = b.copyFrom(a).invert();
        const mInverse = toMatrix4(mInverse3);

        // the determinant of the inverse should be the reciprocal
        expect(Math.abs(a.determinant() * mInverse3.determinant() - 1) < 0.0001).toEqual(true);
        expect(Math.abs(m.determinant() * mInverse.determinant() - 1) < 0.0001).toEqual(true);

        const mProduct = new Matrix4().multiplyMatrices(m, mInverse);

        expect(Math.abs(mProduct.determinant() - 1) < 0.0001).toEqual(true);
        expect(matrixEquals4(mProduct, identity4)).toEqual(true);
      }
    });

    it('transpose', () => {
      const a = new Matrix3();
      let b = a.clone().transpose();

      expect(matrixEquals3(a, b)).toEqual(true);

      b = new Matrix3().set(0, 1, 2, 3, 4, 5, 6, 7, 8).transpose();
      const c = b.clone().transpose();

      expect(!matrixEquals3(b, c)).toEqual(true);
      c.transpose();
      expect(matrixEquals3(b, c)).toEqual(true);
    });

    it('getNormalMatrix', () => {
      const a = new Matrix3();
      const b = new Matrix4().set(
        2, 3, 5, 7,
        11, 13, 17, 19,
        23, 29, 31, 37,
        41, 43, 47, 57
      ).transpose();
      const expected = new Matrix3().set(
        - 1.2857142857142856, 0.7142857142857143, 0.2857142857142857,
        0.7428571428571429, - 0.7571428571428571, 0.15714285714285714,
        - 0.19999999999999998, 0.3, - 0.09999999999999999
      ).transpose();

      a.setFromMatrix4(b).invert().transpose();
      expect(matrixEquals3(a, expected)).toEqual(true);
    });

    it('transposeIntoArray', () => {
      const a = new Matrix3().set(0, 1, 2, 3, 4, 5, 6, 7, 8).transpose();
      const b = a.transpose().toArray();

      expect(b[0]).toEqual(0);
      expect(b[1]).toEqual(1);
      expect(b[2]).toEqual(2);
      expect(b[3]).toEqual(3);
      expect(b[4]).toEqual(4);
      expect(b[5]).toEqual(5);
      expect(b[5]).toEqual(5);
      expect(b[6]).toEqual(6);
      expect(b[7]).toEqual(7);
      expect(b[8]).toEqual(8);
    });

    it('scale', () => {
      const a = new Matrix3().setFromRowMajorData(1, 2, 3, 4, 5, 6, 7, 8, 9);
      const expected = new Matrix3().setFromRowMajorData(
        0.25, 0.5, 0.75,
        1, 1.25, 1.5,
        7, 8, 9
      );

      a.scale(0.25, 0.25);
      expect(matrixEquals3(a, expected)).toEqual(true);
    });

    it('rotate', () => {
      const a = new Matrix3().setFromRowMajorData(1, 2, 3, 4, 5, 6, 7, 8, 9);
      const expected = new Matrix3().set(
        3.5355339059327373, 4.949747468305833, 6.363961030678928,
        2.121320343559643, 2.121320343559643, 2.1213203435596433,
        7, 8, 9
      ).transpose();

      a.rotate(Math.PI / 4);
      expect(matrixEquals3(a, expected)).toEqual(true);
    });

    it('translate', () => {
      const a = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9).transpose();
      const expected = new Matrix3().set(22, 26, 30, 53, 61, 69, 7, 8, 9).transpose();

      a.translate(3, 7);
      expect(matrixEquals3(a, expected)).toEqual(true);
    });

    it('equals', () => {
      const a = new Matrix3().set(0, 1, 2, 3, 4, 5, 6, 7, 8).transpose();
      const b = new Matrix3().set(0, - 1, 2, 3, 4, 5, 6, 7, 8).transpose();

      expect(a.equals(b)).not.toEqual(true);
      expect(b.equals(a)).not.toEqual(true);

      a.copyFrom(b);
      expect(a.equals(b)).toEqual(true);
      expect(b.equals(a)).toEqual(true);
    });

    it('setFromArray', () => {
      let b = new Matrix3();

      b.setFromArray([0, 1, 2, 3, 4, 5, 6, 7, 8]);

      expect(b.elements[0]).toEqual(0);
      expect(b.elements[1]).toEqual(1);
      expect(b.elements[2]).toEqual(2);
      expect(b.elements[3]).toEqual(3);
      expect(b.elements[4]).toEqual(4);
      expect(b.elements[5]).toEqual(5);
      expect(b.elements[6]).toEqual(6);
      expect(b.elements[7]).toEqual(7);
      expect(b.elements[8]).toEqual(8);

      b = new Matrix3();
      b.setFromArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], 10);

      expect(b.elements[0]).toEqual(10);
      expect(b.elements[1]).toEqual(11);
      expect(b.elements[2]).toEqual(12);
      expect(b.elements[3]).toEqual(13);
      expect(b.elements[4]).toEqual(14);
      expect(b.elements[5]).toEqual(15);
      expect(b.elements[6]).toEqual(16);
      expect(b.elements[7]).toEqual(17);
      expect(b.elements[8]).toEqual(18);
    });

    it('toArray', () => {
      const a = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9).transpose();
      const noOffset = [1, 4, 7, 2, 5, 8, 3, 6, 9];
      const withOffset = [undefined, 1, 4, 7, 2, 5, 8, 3, 6, 9];
      const array = a.toArray();

      expect(array).toEqual(noOffset);

      const array1: any[] = [];

      a.fill(array1);
      expect(array1).toEqual(noOffset);

      const array2: any[] = [];

      a.fill(array2, 1);
      expect(array2).toEqual(withOffset);
    });
  });
});

function matrixEquals3 (a: Matrix3, b: Matrix3, tolerance?: number) {
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

function toMatrix4 (m3: Matrix3) {
  const result = new Matrix4();
  const re = result.elements;
  const me = m3.elements;

  re[0] = me[0];
  re[1] = me[1];
  re[2] = me[2];
  re[4] = me[3];
  re[5] = me[4];
  re[6] = me[5];
  re[8] = me[6];
  re[9] = me[7];
  re[10] = me[8];

  return result;
}
