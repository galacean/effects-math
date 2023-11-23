import { Matrix3, Matrix4, Vector3, Euler, Quaternion, DEG2RAD, EulerOrder } from '@galacean/effects-math';

const eps = 0.0001;

describe('Maths', () => {
  describe('Matrix4', () => {
    // INSTANCING
    it('Instancing', () => {
      const a = new Matrix4();

      expect(a.determinant()).toEqual(1);

      const b = new Matrix4().setFromRowMajorData(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);

      expect(b.elements[0]).toEqual(0);
      expect(b.elements[1]).toEqual(4);
      expect(b.elements[2]).toEqual(8);
      expect(b.elements[3]).toEqual(12);
      expect(b.elements[4]).toEqual(1);
      expect(b.elements[5]).toEqual(5);
      expect(b.elements[6]).toEqual(9);
      expect(b.elements[7]).toEqual(13);
      expect(b.elements[8]).toEqual(2);
      expect(b.elements[9]).toEqual(6);
      expect(b.elements[10]).toEqual(10);
      expect(b.elements[11]).toEqual(14);
      expect(b.elements[12]).toEqual(3);
      expect(b.elements[13]).toEqual(7);
      expect(b.elements[14]).toEqual(11);
      expect(b.elements[15]).toEqual(15);

      expect(!matrixEquals4(a, b)).toEqual(true);
    });

    it('set', () => {
      const b = new Matrix4();

      expect(b.determinant()).toEqual(1);

      b.set(0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15);
      expect(b.elements[0]).toEqual(0);
      expect(b.elements[1]).toEqual(4);
      expect(b.elements[2]).toEqual(8);
      expect(b.elements[3]).toEqual(12);
      expect(b.elements[4]).toEqual(1);
      expect(b.elements[5]).toEqual(5);
      expect(b.elements[6]).toEqual(9);
      expect(b.elements[7]).toEqual(13);
      expect(b.elements[8]).toEqual(2);
      expect(b.elements[9]).toEqual(6);
      expect(b.elements[10]).toEqual(10);
      expect(b.elements[11]).toEqual(14);
      expect(b.elements[12]).toEqual(3);
      expect(b.elements[13]).toEqual(7);
      expect(b.elements[14]).toEqual(11);
      expect(b.elements[15]).toEqual(15);
    });

    it('identity', () => {
      const b = new Matrix4().set(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15).transpose();

      expect(b.elements[0]).toEqual(0);
      expect(b.elements[1]).toEqual(4);
      expect(b.elements[2]).toEqual(8);
      expect(b.elements[3]).toEqual(12);
      expect(b.elements[4]).toEqual(1);
      expect(b.elements[5]).toEqual(5);
      expect(b.elements[6]).toEqual(9);
      expect(b.elements[7]).toEqual(13);
      expect(b.elements[8]).toEqual(2);
      expect(b.elements[9]).toEqual(6);
      expect(b.elements[10]).toEqual(10);
      expect(b.elements[11]).toEqual(14);
      expect(b.elements[12]).toEqual(3);
      expect(b.elements[13]).toEqual(7);
      expect(b.elements[14]).toEqual(11);
      expect(b.elements[15]).toEqual(15);

      const a = new Matrix4();

      expect(!matrixEquals4(a, b)).toEqual(true);

      b.identity();
      expect(matrixEquals4(a, b)).toEqual(true);
    });

    it('clone', () => {
      const a = new Matrix4().set(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15).transpose();
      const b = a.clone();

      expect(matrixEquals4(a, b)).toEqual(true);

      // ensure that it is a true copy
      a.elements[0] = 2;
      expect(!matrixEquals4(a, b)).toEqual(true);
    });

    it('copyFrom', () => {
      const a = new Matrix4().set(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15).transpose();
      const b = new Matrix4().copyFrom(a);

      expect(matrixEquals4(a, b)).toEqual(true);

      // ensure that it is a true copy
      a.elements[0] = 2;
      expect(!matrixEquals4(a, b)).toEqual(true);
    });

    it('setFromMatrix3', () => {
      const a = new Matrix3().set(
        0, 1, 2,
        3, 4, 5,
        6, 7, 8
      ).transpose();
      const b = new Matrix4();
      const c = new Matrix4().set(
        0, 1, 2, 0,
        3, 4, 5, 0,
        6, 7, 8, 0,
        0, 0, 0, 1
      ).transpose();

      b.setFromMatrix3(a);
      expect(b.equals(c)).toEqual(true);
    });

    it('makeBasis/extractBasis', () => {
      const identityBasis = [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)];
      const a = Matrix4.fromBasis(identityBasis[0], identityBasis[1], identityBasis[2]);
      const identity = new Matrix4();

      expect(matrixEquals4(a, identity)).toEqual(true);

      const testBases = [[new Vector3(0, 1, 0), new Vector3(- 1, 0, 0), new Vector3(0, 0, 1)]];

      for (let i = 0; i < testBases.length; i++) {
        const testBasis = testBases[i];
        const b = Matrix4.fromBasis(testBasis[0], testBasis[1], testBasis[2]);
        const outBasis = [new Vector3(), new Vector3(), new Vector3()];

        b.extractBasis(outBasis[0], outBasis[1], outBasis[2]);
        // check what goes in, is what comes out.
        for (let j = 0; j < outBasis.length; j++) {
          expect(outBasis[j].equals(testBasis[j])).toEqual(true);
        }

        // get the basis out the hard war
        for (let j = 0; j < identityBasis.length; j++) {
          outBasis[j].copyFrom(identityBasis[j]);
          outBasis[j].applyMatrix(b);
        }

        // did the multiply method of basis extraction work?
        for (let j = 0; j < outBasis.length; j++) {
          expect(outBasis[j].equals(testBasis[j])).toEqual(true);
        }
      }
    });

    it('setFromEuler/extractRotation', () => {
      const testValues = [
        new Euler(0, 0, 0, EulerOrder.XYZ),
        new Euler(1, 0, 0, EulerOrder.XYZ),
        new Euler(0, 1, 0, EulerOrder.ZYX),
        new Euler(0, 0, 0.5, EulerOrder.YZX),
        new Euler(0, 0, - 0.5, EulerOrder.YZX),
      ];

      for (let i = 0; i < testValues.length; i++) {
        const v = testValues[i];
        const m = new Matrix4().setFromEuler(v);
        const v2 = new Euler().setFromRotationMatrix4(m, v.order);
        const m2 = new Matrix4().setFromEuler(v2);

        expect(matrixEquals4(m, m2, eps)).toEqual(true);
        expect(eulerEquals(v, v2, eps)).toEqual(true);

        const v3 = new Euler().setFromRotationMatrix4(m2, v.order);

        expect(eulerEquals(v, v3, eps)).toEqual(true);
      }
    });

    it('lookAt', () => {
      const a = new Matrix4();
      const expected = new Matrix4().identity();
      const eye = new Vector3(0, 0, 0);
      const target = new Vector3(0, 1, - 1);
      const up = new Vector3(0, 1, 0);

      a.lookAt(eye, target, up);
      const rotation = new Euler().setFromRotationMatrix4(a);

      expect(rotation.x).toEqual(135);

      // eye and target are in the same position
      eye.copyFrom(target);
      a.lookAt(eye, target, up);
      expect(matrixEquals4(a, expected)).toEqual(true);
    });

    it('multiply', () => {
      const lhs = new Matrix4().set(
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53
      ).transpose();
      const rhs = new Matrix4().set(
        59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131
      ).transpose();

      lhs.multiply(rhs);

      expect(lhs.elements[0]).toEqual(1585);
      expect(lhs.elements[1]).toEqual(5318);
      expect(lhs.elements[2]).toEqual(10514);
      expect(lhs.elements[3]).toEqual(15894);
      expect(lhs.elements[4]).toEqual(1655);
      expect(lhs.elements[5]).toEqual(5562);
      expect(lhs.elements[6]).toEqual(11006);
      expect(lhs.elements[7]).toEqual(16634);
      expect(lhs.elements[8]).toEqual(1787);
      expect(lhs.elements[9]).toEqual(5980);
      expect(lhs.elements[10]).toEqual(11840);
      expect(lhs.elements[11]).toEqual(17888);
      expect(lhs.elements[12]).toEqual(1861);
      expect(lhs.elements[13]).toEqual(6246);
      expect(lhs.elements[14]).toEqual(12378);
      expect(lhs.elements[15]).toEqual(18710);
    });

    it('premultiply', () => {
      const lhs = new Matrix4().setFromRowMajorData(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53);
      const rhs = new Matrix4().setFromRowMajorData(59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131);

      rhs.premultiply(lhs);

      expect(rhs.elements[0]).toEqual(1585);
      expect(rhs.elements[1]).toEqual(5318);
      expect(rhs.elements[2]).toEqual(10514);
      expect(rhs.elements[3]).toEqual(15894);
      expect(rhs.elements[4]).toEqual(1655);
      expect(rhs.elements[5]).toEqual(5562);
      expect(rhs.elements[6]).toEqual(11006);
      expect(rhs.elements[7]).toEqual(16634);
      expect(rhs.elements[8]).toEqual(1787);
      expect(rhs.elements[9]).toEqual(5980);
      expect(rhs.elements[10]).toEqual(11840);
      expect(rhs.elements[11]).toEqual(17888);
      expect(rhs.elements[12]).toEqual(1861);
      expect(rhs.elements[13]).toEqual(6246);
      expect(rhs.elements[14]).toEqual(12378);
      expect(rhs.elements[15]).toEqual(18710);
    });

    it('multiplyMatrices', () => {
      // Reference:
      //
      // #!/usr/bin/env python
      // from __future__ import print_function
      // import numpy as np
      // print(
      //     np.dot(
      //         np.reshape([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53], (4, 4)),
      //         np.reshape([59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131], (4, 4))
      //     )
      // )
      //
      // [[ 1585  1655  1787  1861]
      //  [ 5318  5562  5980  6246]
      //  [10514 11006 11840 12378]
      //  [15894 16634 17888 18710]]
      const lhs = new Matrix4().set(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53).transpose();
      const rhs = new Matrix4().set(59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131).transpose();
      const ans = new Matrix4();

      ans.multiplyMatrices(lhs, rhs);

      expect(ans.elements[0]).toEqual(1585);
      expect(ans.elements[1]).toEqual(5318);
      expect(ans.elements[2]).toEqual(10514);
      expect(ans.elements[3]).toEqual(15894);
      expect(ans.elements[4]).toEqual(1655);
      expect(ans.elements[5]).toEqual(5562);
      expect(ans.elements[6]).toEqual(11006);
      expect(ans.elements[7]).toEqual(16634);
      expect(ans.elements[8]).toEqual(1787);
      expect(ans.elements[9]).toEqual(5980);
      expect(ans.elements[10]).toEqual(11840);
      expect(ans.elements[11]).toEqual(17888);
      expect(ans.elements[12]).toEqual(1861);
      expect(ans.elements[13]).toEqual(6246);
      expect(ans.elements[14]).toEqual(12378);
      expect(ans.elements[15]).toEqual(18710);
    });

    it('multiply', () => {
      const b = new Matrix4().set(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15).transpose();

      expect(b.elements[0]).toEqual(0);
      expect(b.elements[1]).toEqual(4);
      expect(b.elements[2]).toEqual(8);
      expect(b.elements[3]).toEqual(12);
      expect(b.elements[4]).toEqual(1);
      expect(b.elements[5]).toEqual(5);
      expect(b.elements[6]).toEqual(9);
      expect(b.elements[7]).toEqual(13);
      expect(b.elements[8]).toEqual(2);
      expect(b.elements[9]).toEqual(6);
      expect(b.elements[10]).toEqual(10);
      expect(b.elements[11]).toEqual(14);
      expect(b.elements[12]).toEqual(3);
      expect(b.elements[13]).toEqual(7);
      expect(b.elements[14]).toEqual(11);
      expect(b.elements[15]).toEqual(15);

      b.multiply(2);
      expect(b.elements[0]).toEqual(0 * 2);
      expect(b.elements[1]).toEqual(4 * 2);
      expect(b.elements[2]).toEqual(8 * 2);
      expect(b.elements[3]).toEqual(12 * 2);
      expect(b.elements[4]).toEqual(1 * 2);
      expect(b.elements[5]).toEqual(5 * 2);
      expect(b.elements[6]).toEqual(9 * 2);
      expect(b.elements[7]).toEqual(13 * 2);
      expect(b.elements[8]).toEqual(2 * 2);
      expect(b.elements[9]).toEqual(6 * 2);
      expect(b.elements[10]).toEqual(10 * 2);
      expect(b.elements[11]).toEqual(14 * 2);
      expect(b.elements[12]).toEqual(3 * 2);
      expect(b.elements[13]).toEqual(7 * 2);
      expect(b.elements[14]).toEqual(11 * 2);
      expect(b.elements[15]).toEqual(15 * 2);
    });

    it('determinant', () => {
      const a = new Matrix4();

      expect(a.determinant()).toEqual(1);

      a.elements[0] = 2;
      expect(a.determinant()).toEqual(2);

      a.elements[0] = 0;
      expect(a.determinant()).toEqual(0);

      // calculated via http://www.euclideanspace.com/maths/algebra/matrix/functions/determinant/fourD/index.htm
      a.set(2, 3, 4, 5, - 1, - 21, - 3, - 4, 6, 7, 8, 10, - 8, - 9, - 10, - 12);
      expect(a.determinant()).toEqual(76);
    });

    it('transpose', () => {
      const a = new Matrix4();
      let b = a.clone().transpose();

      expect(matrixEquals4(a, b)).toEqual(true);

      b = new Matrix4().set(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15).transpose();
      const c = b.clone().transpose();

      expect(!matrixEquals4(b, c)).toEqual(true);
      c.transpose();
      expect(matrixEquals4(b, c)).toEqual(true);
    });

    it('invert', () => {
      const zero = new Matrix4().set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      const identity = new Matrix4();
      const a = new Matrix4();
      const b = new Matrix4().set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

      a.copyFrom(b).invert();
      expect(matrixEquals4(a, zero)).toEqual(true);

      const testMatrices = [
        new Matrix4().setFromRotationX(0.3),
        new Matrix4().setFromRotationX(- 0.3),
        new Matrix4().setFromRotationY(0.3),
        new Matrix4().setFromRotationY(- 0.3),
        new Matrix4().setFromRotationZ(0.3),
        new Matrix4().setFromRotationZ(- 0.3),
        new Matrix4().setFromScale(1, 2, 3),
        new Matrix4().setFromScale(1 / 8, 1 / 2, 1 / 3),
        new Matrix4().setFromTranslation(1, 2, 3),
      ];

      for (let i = 0, il = testMatrices.length; i < il; i++) {
        const m = testMatrices[i];
        const mInverse = new Matrix4().copyFrom(m).invert();
        const mSelfInverse = m.clone();

        mSelfInverse.copyFrom(mSelfInverse).invert();

        // self-inverse should the same as inverse
        expect(matrixEquals4(mSelfInverse, mInverse)).toEqual(true);

        // the determinant of the inverse should be the reciprocal
        expect(Math.abs(m.determinant() * mInverse.determinant() - 1) < 0.0001).toEqual(true);

        const mProduct = new Matrix4().multiplyMatrices(m, mInverse);

        // the determinant of the identity matrix is 1
        expect(Math.abs(mProduct.determinant() - 1) < 0.0001).toEqual(true);
        expect(matrixEquals4(mProduct, identity)).toEqual(true);
      }
    });

    it('setFromTranslation', () => {
      const a = new Matrix4();
      const b = new Vector3(2, 3, 4);
      const c = new Matrix4().setFromRowMajorData(1, 0, 0, 2, 0, 1, 0, 3, 0, 0, 1, 4, 0, 0, 0, 1);

      a.setFromTranslation(b.x, b.y, b.z);
      expect(matrixEquals4(a, c)).toEqual(true);
    });

    it('setFromRotationX', () => {
      const a = new Matrix4();
      const b = Math.sqrt(3) / 2;
      const c = new Matrix4().setFromRowMajorData(1, 0, 0, 0, 0, b, - 0.5, 0, 0, 0.5, b, 0, 0, 0, 0, 1);

      a.setFromRotationX(Math.PI / 6);
      expect(matrixEquals4(a, c)).toEqual(true);
    });

    it('setFromRotationY', () => {
      const a = new Matrix4();
      const b = Math.sqrt(3) / 2;
      const c = new Matrix4().set(b, 0, 0.5, 0, 0, 1, 0, 0, - 0.5, 0, b, 0, 0, 0, 0, 1).transpose();

      a.setFromRotationY(Math.PI / 6);
      expect(matrixEquals4(a, c)).toEqual(true);
    });

    it('setFromRotationZ', () => {
      const a = new Matrix4();
      const b = Math.sqrt(3) / 2;
      const c = new Matrix4().set(b, - 0.5, 0, 0, 0.5, b, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1).transpose();

      a.setFromRotationZ(Math.PI / 6);
      expect(matrixEquals4(a, c)).toEqual(true);
    });

    it('makeRotationAxis', () => {
      const axis = new Vector3(1.5, 0.0, 1.0).normalize();
      const radians = 45 * DEG2RAD;
      const a = new Matrix4().setFromRotationAxis(axis, radians);

      const expected = new Matrix4().set(
        0.9098790095958609, - 0.39223227027636803, 0.13518148560620882, 0,
        0.39223227027636803, 0.7071067811865476, - 0.588348405414552, 0,
        0.13518148560620882, 0.588348405414552, 0.7972277715906868, 0,
        0, 0, 0, 1
      ).transpose();

      expect(matrixEquals4(a, expected)).toEqual(true);
    });

    it('setFromScale', () => {
      const a = new Matrix4();
      const c = new Matrix4().set(2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1).transpose();

      a.setFromScale(2, 3, 4);
      expect(matrixEquals4(a, c)).toEqual(true);
    });

    it('compose/decompose', () => {
      const tValues = [
        new Vector3(),
        new Vector3(3, 0, 0),
        new Vector3(0, 4, 0),
        new Vector3(0, 0, 5),
        new Vector3(- 6, 0, 0),
        new Vector3(0, - 7, 0),
        new Vector3(0, 0, - 8),
        new Vector3(- 2, 5, - 9),
        new Vector3(- 2, - 5, - 9),
      ];
      const sValues = [
        new Vector3(1, 1, 1),
        new Vector3(2, 2, 2),
        new Vector3(1, - 1, 1),
        new Vector3(- 1, 1, 1),
        new Vector3(1, 1, - 1),
        new Vector3(2, - 2, 1),
        new Vector3(- 1, 2, - 2),
        new Vector3(- 1, - 1, - 1),
        new Vector3(- 2, - 2, - 2),
      ];
      const rValues = [
        new Quaternion(),
        new Quaternion().setFromEuler(new Euler(1, 1, 0)),
        new Quaternion().setFromEuler(new Euler(1, - 1, 1)),
        new Quaternion(0, 0.9238795292366128, 0, 0.38268342717215614),
      ];

      for (let ti = 0; ti < tValues.length; ti++) {
        for (let si = 0; si < sValues.length; si++) {
          for (let ri = 0; ri < rValues.length; ri++) {
            const t = tValues[ti];
            const s = sValues[si];
            const r = rValues[ri];

            const m = new Matrix4().compose(t, r, s);
            const t2 = new Vector3();
            const r2 = new Quaternion();
            const s2 = new Vector3();

            m.decompose(t2, r2, s2);

            const m2 = new Matrix4().compose(t2, r2, s2);

            /*
            // debug code
            const matrixIsSame = matrixEquals4( m, m2 );
            if ( ! matrixIsSame ) {
              console.log( t, s, r );
              console.log( t2, s2, r2 );
              console.log( m, m2 );
            }
            */

            expect(matrixEquals4(m, m2)).toEqual(true);
          }
        }
      }
    });

    it('makeOrthographic', () => {
      const a = new Matrix4().orthographic(- 1, 1, - 1, 1, 1, 100);
      const expected = new Matrix4().set(
        1, 0, 0, 0,
        0, - 1, 0, 0,
        0, 0, - 2 / 99, - 101 / 99,
        0, 0, 0, 1
      ).transpose();

      expect(matrixEquals4(a, expected)).toEqual(true);
    });

    it('equals', () => {
      const a = new Matrix4().set(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15).transpose();
      const b = new Matrix4().set(0, - 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15).transpose();

      expect(a.equals(b)).toEqual(false);
      expect(b.equals(a)).toEqual(false);

      a.copyFrom(b);
      expect(a.equals(b)).toEqual(true);
      expect(b.equals(a)).toEqual(true);
    });

    it('setFromArray', () => {
      const a = new Matrix4();
      const b = new Matrix4().set(1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16).transpose();

      a.setFromArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
      expect(a.equals(b)).toEqual(true);
    });

    it('toArray', () => {
      const a = new Matrix4().set(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16).transpose();
      const noOffset = [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16];
      const withOffset = [undefined, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16];

      const array = a.toArray();

      expect(array).toEqual(noOffset);

      const array1: any[] = [];

      a.fill(array1);
      expect(array1).toEqual(noOffset);

      const array2: any[] = [];

      a.fill(array2, 1);
      expect(array2).toEqual(withOffset);
    });

    it('测试矩阵分解平移/旋转/缩放(与Unity分解结果对齐)', () => {
      const matrix = Matrix4.fromArray([
        -0.66851407289505, 3.232001543045044, -1.8427306413650513, 0,
        -2.5140888690948486, -0.3082773983478546, 0.3713786005973816, 0,
        0.33451002836227417, 2.5825717449188232, 4.408267974853516, 0,
        13.5, 2.34, 5.678, 1,
      ]);
      const translation = new Vector3(0, 0, 0);
      const rotation = new Quaternion(0, 0, 0, 1);
      const scale = new Vector3(1, 1, 1);

      matrix.decompose(translation, rotation, scale);

      expect(translation.x).toBeCloseTo(13.5, 5);
      expect(translation.y).toBeCloseTo(2.34, 5);
      expect(translation.z).toBeCloseTo(5.678, 5);

      expect(rotation.x).toBeCloseTo(-0.14367972314357758, 5);
      expect(rotation.y).toBeCloseTo(0.22104571759700775, 5);
      expect(rotation.z).toBeCloseTo(0.7345519661903381, 5);
      expect(rotation.w).toBeCloseTo(0.6252426505088806, 5);

      expect(scale.x).toBeCloseTo(3.7800002098083496, 5);
      expect(scale.y).toBeCloseTo(2.559999942779541, 5);
      expect(scale.z).toBeCloseTo(5.119999885559082, 5);
    });

    it('测试平移/旋转/缩放合成矩阵', () => {
      const translation = Vector3.fromArray([13.5, 2.34, 5.678]);
      const rotation = Quaternion.fromArray([-0.14367972314357758, 0.22104571759700775, 0.7345519661903381, 0.6252426505088806]);
      const scale = Vector3.fromArray([3.7800002098083496, 2.559999942779541, 5.119999885559082]);
      const matrix = new Matrix4();
      const expectMatrix = [
        -0.66851407289505, 3.232001543045044, -1.8427306413650513, 0,
        -2.5140888690948486, -0.3082773983478546, 0.3713786005973816, 0,
        0.33451002836227417, 2.5825717449188232, 4.408267974853516, 0,
        13.5, 2.34, 5.678, 1,
      ];

      matrix.compose(translation, rotation, scale);
      const matrixArray = matrix.toArray();

      expectMatrix.forEach((m, i) => {
        expect(m).toBeCloseTo(matrixArray[i], 5);
      });
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

function eulerEquals (a: Euler, b: Euler, tolerance?: number) {
  tolerance = tolerance || 0.0001;
  const diff = Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);

  return (diff < tolerance);
}
