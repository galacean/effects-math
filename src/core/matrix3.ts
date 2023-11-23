import type { Matrix4 } from './matrix4';
import type { Quaternion } from './quaternion';
import type { Matrix3DataType, mat3 } from './type';
import { isEqual } from './utils';
import type { Vector3 } from './vector3';

/**
 * 三维矩阵（列优先矩阵）
 */
export class Matrix3 {
  /**
   * 矩阵值数组
   */
  elements: number[];

  /**
   * 构造函数，初始值为零矩阵
   * @param [m11=1] - 第 1 行，第 1 列
   * @param [m21=0] - 第 2 行，第 1 列
   * @param [m31=0] - 第 3 行，第 1 列
   * @param [m12=0] - 第 1 行，第 2 列
   * @param [m22=1] - 第 2 行，第 2 列
   * @param [m32=0] - 第 3 行，第 2 列
   * @param [m13=0] - 第 1 行，第 3 列
   * @param [m23=0] - 第 2 行，第 3 列
   * @param [m33=1] - 第 3 行，第 3 列
   */
  constructor (
    m11 = 1, m21 = 0, m31 = 0,
    m12 = 0, m22 = 1, m32 = 0,
    m13 = 0, m23 = 0, m33 = 1,
  ) {
    this.elements = [
      m11, m21, m31,
      m12, m22, m32,
      m13, m23, m33,
    ];
  }

  /**
   * 设置矩阵
   * @param m11 - 第 1 行，第 1 列
   * @param m21 - 第 2 行，第 1 列
   * @param m31 - 第 3 行，第 1 列
   * @param m12 - 第 1 行，第 2 列
   * @param m22 - 第 2 行，第 2 列
   * @param m32 - 第 3 行，第 2 列
   * @param m13 - 第 1 行，第 3 列
   * @param m23 - 第 2 行，第 3 列
   * @param m33 - 第 3 行，第 3 列
   * @returns
   */
  set (
    m11: number, m21: number, m31: number,
    m12: number, m22: number, m32: number,
    m13: number, m23: number, m33: number,
  ): this {
    const e = this.elements;

    e[0] = m11; e[3] = m12; e[6] = m13;
    e[1] = m21; e[4] = m22; e[7] = m23;
    e[2] = m31; e[5] = m32; e[8] = m33;

    return this;
  }

  /**
   * 设置矩阵通过行优先数据
   * @param m11 - 第 1 行，第 1 列
   * @param m12 - 第 1 行，第 2 列
   * @param m13 - 第 1 行，第 3 列
   * @param m21 - 第 2 行，第 1 列
   * @param m22 - 第 2 行，第 2 列
   * @param m23 - 第 2 行，第 3 列
   * @param m31 - 第 3 行，第 1 列
   * @param m32 - 第 3 行，第 2 列
   * @param m33 - 第 3 行，第 3 列
   * @returns 矩阵
   */
  setFromRowMajorData (
    m11: number, m12: number, m13: number,
    m21: number, m22: number, m23: number,
    m31: number, m32: number, m33: number,
  ): this {
    const e = this.elements;

    e[0] = m11; e[3] = m12; e[6] = m13;
    e[1] = m21; e[4] = m22; e[7] = m23;
    e[2] = m31; e[5] = m32; e[8] = m33;

    return this;
  }

  /**
   * 通过列向量设置矩阵
   * @param c1 - 第一列
   * @param c2 - 第二列
   * @param c3 - 第三列
   * @returns 矩阵
   */
  setFromColumnVectors (c1: Vector3, c2: Vector3, c3: Vector3): this {
    return this.set(
      c1.x, c1.y, c1.z,
      c2.x, c2.y, c2.z,
      c3.x, c3.y, c3.z,
    );
  }

  /**
   * 通过四阶矩阵设置三阶矩阵
   * @param m - 四阶矩阵
   * @returns 矩阵
   */
  setFromMatrix4 (m: Matrix4): this {
    const me = m.elements;

    return this.set(
      me[0], me[1], me[2],
      me[4], me[5], me[6],
      me[8], me[9], me[10]
    );
  }

  /**
   * 通过数组设置矩阵
   * @param array - 数组
   * @param [offset=0] - 起始偏移值
   * @returns 矩阵
   */
  setFromArray (array: Matrix3DataType, offset = 0): this {
    for (let i = 0; i < 9; i++) {
      this.elements[i] = array[offset + i];
    }

    return this;
  }

  /**
   * 通过四元数设置矩阵
   * @param quat - 四元数
   * @returns 矩阵
   */
  setFromQuaternion (quat: Quaternion): this {
    const { x, y, z, w } = quat;
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;

    const te = this.elements;

    te[0] = 1 - (yy + zz);
    te[1] = xy + wz;
    te[2] = xz - wy;
    te[3] = xy - wz;
    te[4] = 1 - (xx + zz);
    te[5] = yz + wx;
    te[6] = xz + wy;
    te[7] = yz - wx;
    te[8] = 1 - (xx + yy);

    return this;
  }

  /**
   * 矩阵清零
   * @returns 零矩阵
   */
  setZero (): this {
    for (let i = 0; i < 9; i++) {
      this.elements[i] = 0;
    }

    return this;
  }

  /**
   * 矩阵单位化
   * @returns 单位矩阵
   */
  identity (): this {
    return this.set(
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    );
  }

  /**
   * 矩阵克隆
   * @returns 克隆结果
   */
  clone (): Matrix3 {
    const e = this.elements;

    return new Matrix3(
      e[0], e[1], e[2],
      e[3], e[4], e[5],
      e[6], e[7], e[8]
    );
  }

  /**
   * 矩阵复制
   * @param m - 复制对象
   * @returns 复制结果
   */
  copyFrom (m: Matrix3): this {
    this.elements = [...m.elements];

    return this;
  }

  /**
   * 得到列向量
   * @param i - 列向量索引，从 0 开始
   * @returns 列向量
   */
  getColumnVector (i: number, v: Vector3): Vector3 {
    return v.set(
      this.elements[i * 3],
      this.elements[i * 3 + 1],
      this.elements[i * 3 + 2]
    );
  }

  /**
   * 矩阵缩放
   * @param sx - x 轴缩放分量
   * @param sy - y 轴缩放分量
   * @returns 缩放结果
   */
  scale (sx: number, sy: number): this {
    const e = this.elements;

    e[0] *= sx; e[3] *= sx; e[6] *= sx;
    e[1] *= sy; e[4] *= sy; e[7] *= sy;

    return this;
  }

  /**
   * 矩阵旋转
   * @param theta - 旋转角度（弧度）
   * @returns 旋转结果
   */
  rotate (theta: number): this {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const e = this.elements;

    const m11 = e[0], m12 = e[3], m13 = e[6];
    const m21 = e[1], m22 = e[4], m23 = e[7];

    e[0] = c * m11 + s * m21;
    e[3] = c * m12 + s * m22;
    e[6] = c * m13 + s * m23;

    e[1] = -s * m11 + c * m21;
    e[4] = -s * m12 + c * m22;
    e[7] = -s * m13 + c * m23;

    return this;
  }

  /**
   * 矩阵平移
   * @param x - x 轴平移分量
   * @param y - y 轴平移分量
   * @returns 平移结果
   */
  translate (x: number, y: number): this {
    const e = this.elements;

    e[0] += x * e[2];
    e[3] += x * e[5];
    e[6] += x * e[8];
    e[1] += y * e[2];
    e[4] += y * e[5];
    e[7] += y * e[8];

    return this;
  }

  /**
   * 矩阵右乘
   * @param right - 相乘矩阵
   * @returns 右乘结果
   */
  multiply (right: Matrix3 | number): this {
    if (typeof right === 'number') {
      for (let i = 0; i < 9; i++) {
        this.elements[i] *= right;
      }

      return this;
    } else {
      return this.multiplyMatrices(this, right);
    }
  }

  /**
   * 矩阵左乘
   * @param left - 相乘矩阵
   * @returns 左乘结果
   */
  premultiply (left: Matrix3): this {
    return this.multiplyMatrices(left, this);
  }

  /**
   * 矩阵乘法
   * @param left - 矩阵
   * @param right - 矩阵
   * @returns 相乘结果
   */
  multiplyMatrices (left: Matrix3, right: Matrix3): this {
    const ae = left.elements;
    const be = right.elements;
    const te = this.elements;

    const a11 = ae[0], a12 = ae[3], a13 = ae[6];
    const a21 = ae[1], a22 = ae[4], a23 = ae[7];
    const a31 = ae[2], a32 = ae[5], a33 = ae[8];

    const b11 = be[0], b12 = be[3], b13 = be[6];
    const b21 = be[1], b22 = be[4], b23 = be[7];
    const b31 = be[2], b32 = be[5], b33 = be[8];

    te[0] = a11 * b11 + a12 * b21 + a13 * b31;
    te[3] = a11 * b12 + a12 * b22 + a13 * b32;
    te[6] = a11 * b13 + a12 * b23 + a13 * b33;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31;
    te[4] = a21 * b12 + a22 * b22 + a23 * b32;
    te[7] = a21 * b13 + a22 * b23 + a23 * b33;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31;
    te[5] = a31 * b12 + a32 * b22 + a33 * b32;
    te[8] = a31 * b13 + a32 * b23 + a33 * b33;

    return this;
  }

  /**
   * 矩阵求行列式值
   * @returns 行列式结果
   */
  determinant (): number {
    const e = this.elements;
    const m11 = e[0], m21 = e[3], m31 = e[6];
    const m12 = e[1], m22 = e[4], m32 = e[7];
    const m13 = e[2], m23 = e[5], m33 = e[8];

    return (
      m11 * (m22 * m33 - m23 * m32) +
      m12 * (m23 * m31 - m21 * m33) +
      m13 * (m21 * m32 - m22 * m31)
    );
  }

  /**
   * 矩阵求逆
   * @returns 逆矩阵
   */
  invert (): this {
    const e = this.elements;
    const m11 = e[0], m12 = e[3], m13 = e[6];
    const m21 = e[1], m22 = e[4], m23 = e[7];
    const m31 = e[2], m32 = e[5], m33 = e[8];
    const t11 = m33 * m22 - m32 * m23;
    const t12 = m32 * m13 - m33 * m12;
    const t13 = m23 * m12 - m22 * m13;
    const det = m11 * t11 + m21 * t12 + m31 * t13;

    if (det === 0) {
      return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }

    const detInv = 1 / det;

    e[0] = t11 * detInv;
    e[1] = (m31 * m23 - m33 * m21) * detInv;
    e[2] = (m32 * m21 - m31 * m22) * detInv;

    e[3] = t12 * detInv;
    e[4] = (m33 * m11 - m31 * m13) * detInv;
    e[5] = (m31 * m12 - m32 * m11) * detInv;

    e[6] = t13 * detInv;
    e[7] = (m21 * m13 - m23 * m11) * detInv;
    e[8] = (m22 * m11 - m21 * m12) * detInv;

    return this;
  }

  /**
   * 矩阵转置
   * @returns 转置结果
   */
  transpose (): this {
    let t: number;
    const m = this.elements;

    t = m[1]; m[1] = m[3]; m[3] = t;
    t = m[2]; m[2] = m[6]; m[6] = t;
    t = m[5]; m[5] = m[7]; m[7] = t;

    return this;
  }

  /**
   * 对点进行矩阵变换
   * @param v - 输入点
   * @param out - 输出点，如果没有会覆盖输入的数据
   * @returns 变换后的结果
   */
  transformPoint (v: Vector3, out?: Vector3): Vector3 {
    const { x, y, z } = v;
    const e = this.elements;

    const res = out ?? v;

    res.x = e[0] * x + e[3] * y + e[6] * z;
    res.y = e[1] * x + e[4] * y + e[7] * z;
    res.z = e[2] * x + e[5] * y + e[8] * z;

    return res;
  }

  /**
   * 对法向量进行矩阵变换
   * @param v - 输入向量
   * @param out - 输出向量，如果没有会覆盖输入的数据
   * @returns 变换后的结果
   */
  transformNormal (v: Vector3, out?: Vector3): Vector3 {
    return this.transformPoint(v, out).normalize();
  }

  /**
   * 矩阵判等
   * @param matrix - 矩阵
   * @returns 判等结果
   */
  equals (matrix: Matrix3): boolean {
    const te = this.elements;
    const me = matrix.elements;

    for (let i = 0; i < 9; i++) {
      if (!isEqual(te[i], me[i])) {
        return false;
      }
    }

    return true;
  }

  /**
   * 矩阵转为数组
   * @returns
   */
  toArray (): mat3 {
    return [...this.elements] as mat3;
  }

  fill (array: number[] | Float32Array, offset = 0) {
    const e = this.elements;

    array[offset] = e[0];
    array[offset + 1] = e[1];
    array[offset + 2] = e[2];

    array[offset + 3] = e[3];
    array[offset + 4] = e[4];
    array[offset + 5] = e[5];

    array[offset + 6] = e[6];
    array[offset + 7] = e[7];
    array[offset + 8] = e[8];
  }

  /**
   * 创建单位阵
   * @returns 单位矩阵
   */
  static fromIdentity (): Matrix3 {
    return new Matrix3(
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    );
  }

  /**
   * 通过列向量创建矩阵
   * @param c1 - 第一列
   * @param c2 - 第二列
   * @param c3 - 第三列
   * @returns 矩阵
   */
  static fromColumnVectors (c1: Vector3, c2: Vector3, c3: Vector3): Matrix3 {
    return new Matrix3().setFromColumnVectors(c1, c2, c3);
  }

  /**
   * 通过四阶矩阵创建矩阵（获取空间变换矩阵旋转缩放部分）
   * @param m - 四阶矩阵
   * @returns 矩阵
   */
  static fromMatrix4 (m: Matrix4): Matrix3 {
    return new Matrix3().setFromMatrix4(m);
  }

  /**
   * 通过数组创建矩阵
   * @param array - 数组（列优先）
   * @param [offset=0] - 起始偏移值
   * @returns 矩阵
   */
  static fromArray (array: Matrix3DataType, offset = 0): Matrix3 {
    return new Matrix3().setFromArray(array, offset);
  }

  /**
   * 通过四元数创建矩阵
   * @param quat - 四元数
   * @returns 矩阵
   */
  static fromQuaternion (quat: Quaternion): Matrix3 {
    return new Matrix3().setFromQuaternion(quat);
  }

  /**
   * 设置矩阵通过行优先数据
   * @param m11 - 第 1 行，第 1 列
   * @param m12 - 第 1 行，第 2 列
   * @param m13 - 第 1 行，第 3 列
   * @param m21 - 第 2 行，第 1 列
   * @param m22 - 第 2 行，第 2 列
   * @param m23 - 第 2 行，第 3 列
   * @param m31 - 第 3 行，第 1 列
   * @param m32 - 第 3 行，第 2 列
   * @param m33 - 第 3 行，第 3 列
   * @returns 矩阵
   */
  static fromRowMajorData (
    m11: number, m12: number, m13: number,
    m21: number, m22: number, m23: number,
    m31: number, m32: number, m33: number,
  ): Matrix3 {
    return new Matrix3(
      m11, m21, m31,
      m12, m22, m32,
      m13, m23, m33,
    );
  }
}
