import { Vector3 } from './vector3';
import type { Vector4 } from './vector4';
import type { Euler } from './euler';
import { isEqual } from './utils';
import type { Matrix3 } from './matrix3';
import { Quaternion } from './quaternion';
import type { Matrix4DataType, mat4 } from './type';

/**
 * 四阶矩阵（列优先矩阵）
 */
export class Matrix4 {
  static readonly IDENTITY = new Matrix4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  );
  static readonly ZERO = new Matrix4(
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
  );

  private static readonly tempVec0: Vector3 = new Vector3();
  private static readonly tempVec1: Vector3 = new Vector3();
  private static readonly tempVec2: Vector3 = new Vector3();
  private static readonly tempMat0: Matrix4 = new Matrix4();

  /**
   * 矩阵值数组
   */
  elements: number[];

  /**
   * 构造函数，初始值为单位矩阵
   * @param [m11=1] - 第 1 行，第 1 列
   * @param [m21=0] - 第 2 行，第 1 列
   * @param [m31=0] - 第 3 行，第 1 列
   * @param [m41=0] - 第 4 行，第 1 列
   * @param [m12=0] - 第 1 行，第 2 列
   * @param [m22=1] - 第 2 行，第 2 列
   * @param [m32=0] - 第 3 行，第 2 列
   * @param [m42=0] - 第 4 行，第 2 列
   * @param [m13=0] - 第 1 行，第 3 列
   * @param [m23=0] - 第 2 行，第 3 列
   * @param [m33=1] - 第 3 行，第 3 列
   * @param [m43=0] - 第 4 行，第 3 列
   * @param [m14=0] - 第 1 行，第 4 列
   * @param [m24=0] - 第 2 行，第 4 列
   * @param [m34=0] - 第 3 行，第 4 列
   * @param [m44=1] - 第 4 行，第 4 列
   */
  constructor (
    m11 = 1, m21 = 0, m31 = 0, m41 = 0,
    m12 = 0, m22 = 1, m32 = 0, m42 = 0,
    m13 = 0, m23 = 0, m33 = 1, m43 = 0,
    m14 = 0, m24 = 0, m34 = 0, m44 = 1,
  ) {
    this.elements = [
      m11, m21, m31, m41,
      m12, m22, m32, m42,
      m13, m23, m33, m43,
      m14, m24, m34, m44,
    ];
  }

  /**
   * 设置矩阵
   * @param m11 - 第 1 行，第 1 列
   * @param m21 - 第 2 行，第 1 列
   * @param m31 - 第 3 行，第 1 列
   * @param m41 - 第 4 行，第 1 列
   * @param m12 - 第 1 行，第 2 列
   * @param m22 - 第 2 行，第 2 列
   * @param m32 - 第 3 行，第 2 列
   * @param m42 - 第 4 行，第 2 列
   * @param m13 - 第 1 行，第 3 列
   * @param m23 - 第 2 行，第 3 列
   * @param m33 - 第 3 行，第 3 列
   * @param m43 - 第 4 行，第 3 列
   * @param m14 - 第 1 行，第 4 列
   * @param m24 - 第 2 行，第 4 列
   * @param m34 - 第 3 行，第 4 列
   * @param m44 - 第 4 行，第 4 列
   * @returns 矩阵
   */
  set (
    m11: number, m21: number, m31: number, m41: number,
    m12: number, m22: number, m32: number, m42: number,
    m13: number, m23: number, m33: number, m43: number,
    m14: number, m24: number, m34: number, m44: number,
  ): this {
    const e = this.elements;

    e[0] = m11; e[1] = m21; e[2] = m31; e[3] = m41;
    e[4] = m12; e[5] = m22; e[6] = m32; e[7] = m42;
    e[8] = m13; e[9] = m23; e[10] = m33; e[11] = m43;
    e[12] = m14; e[13] = m24; e[14] = m34; e[15] = m44;

    return this;
  }

  /**
   * 通过行优先数据设置矩阵
   * @param m11 - 第 1 行，第 1 列
   * @param m12 - 第 1 行，第 2 列
   * @param m13 - 第 1 行，第 3 列
   * @param m14 - 第 1 行，第 4 列
   * @param m21 - 第 2 行，第 1 列
   * @param m22 - 第 2 行，第 2 列
   * @param m23 - 第 2 行，第 3 列
   * @param m24 - 第 2 行，第 4 列
   * @param m31 - 第 3 行，第 1 列
   * @param m32 - 第 3 行，第 2 列
   * @param m33 - 第 3 行，第 3 列
   * @param m34 - 第 3 行，第 4 列
   * @param m41 - 第 4 行，第 1 列
   * @param m42 - 第 4 行，第 2 列
   * @param m43 - 第 4 行，第 3 列
   * @param m44 - 第 4 行，第 4 列
   * @returns 矩阵
   */
  setFromRowMajorData (
    m11: number, m12: number, m13: number, m14: number,
    m21: number, m22: number, m23: number, m24: number,
    m31: number, m32: number, m33: number, m34: number,
    m41: number, m42: number, m43: number, m44: number,
  ): this {
    const e = this.elements;

    e[0] = m11; e[4] = m12; e[8] = m13; e[12] = m14;
    e[1] = m21; e[5] = m22; e[9] = m23; e[13] = m24;
    e[2] = m31; e[6] = m32; e[10] = m33; e[14] = m34;
    e[3] = m41; e[7] = m42; e[11] = m43; e[15] = m44;

    return this;
  }

  /**
   * 通过四个列向量设置矩阵
   * @param c1 - 第一列
   * @param c2 - 第二列
   * @param c3 - 第三列
   * @param c4 - 第四列
   * @returns 矩阵
   */
  setFromColumnVectors (c1: Vector4, c2: Vector4, c3: Vector4, c4: Vector4): this {
    return this.set(
      c1.x, c1.y, c1.z, c1.w,
      c2.x, c2.y, c2.z, c2.w,
      c3.x, c3.y, c3.z, c3.w,
      c4.x, c4.y, c4.z, c4.w,
    );
  }

  /**
   * 通过三维矩阵设置矩阵
   * @param m - 三维矩阵
   * @returns 设置结果
   */
  setFromMatrix3 (m: Matrix3): this {
    const me = m.elements;

    this.set(
      me[0], me[1], me[2], 0,
      me[3], me[4], me[5], 0,
      me[6], me[7], me[8], 0,
      0, 0, 0, 1,
    );

    return this;
  }

  /**
   * 通过数组设置矩阵
   * @param array - 数组
   * @param [offset=0] - 起始偏移值
   * @returns 矩阵
   */
  setFromArray (array: Matrix4DataType, offset = 0): this {
    for (let i = 0; i < 16; i++) {
      this.elements[i] = array[offset + i];
    }

    return this;
  }

  /**
   * 通过缩放设置矩阵
   * @param x - x 方向缩放
   * @param y - y 方向缩放
   * @param z - z 方向缩放
   * @returns 缩放矩阵
   */
  setFromScale (x: number, y: number, z: number): this {
    return this.set(
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1,
    );
  }

  /**
   * 通过平移设置矩阵
   * @param x - x 方向平移
   * @param y - y 方向平移
   * @param z - z 方向平移
   * @returns 平移矩阵
   */
  setFromTranslation (x: number, y: number, z: number): this {
    return this.set(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1,
    );
  }

  /**
   * 通过 x 轴旋转角度设置矩阵
   * @param theta - x 轴旋转弧度
   * @returns 矩阵
   */
  setFromRotationX (theta: number): this {
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    return this.set(
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    );
  }

  /**
   * 通过 y 轴旋转角度设置矩阵
   * @param theta - y 轴旋转弧度
   * @returns 矩阵
   */
  setFromRotationY (theta: number): this {
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    return this.set(
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    );
  }

  /**
   * 通过 z 轴旋转角度设置矩阵
   * @param theta - z 轴旋转弧度
   * @returns 矩阵
   */
  setFromRotationZ (theta: number): this {
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    return this.set(
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    );
  }

  /**
   * 根据三维旋转轴与弧度设置矩阵
   * @param axis - 三维旋转轴
   * @param angle - 旋转弧度
   * @returns 矩阵
   */
  setFromRotationAxis (axis: Vector3, angle: number): this {
    // Based on http://www.gamedev.net/reference/articles/article1199.asp
    const v = Matrix4.tempVec0;

    v.copyFrom(axis).normalize();
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const t = 1 - c;
    const { x, y, z } = v;
    const tx = t * x;
    const ty = t * y;

    return this.set(
      tx * x + c, tx * y + s * z, tx * z - s * y, 0,
      tx * y - s * z, ty * y + c, ty * z + s * x, 0,
      tx * z + s * y, ty * z - s * x, t * z * z + c, 0,
      0, 0, 0, 1,
    );
  }

  /**
   * 通过欧拉角设置矩阵
   * @param euler - 欧拉角
   * @returns 矩阵
   */
  setFromEuler (euler: Euler): this {
    euler.toMatrix4(this);

    return this;
  }

  /**
   * 通过四元数设置矩阵
   * @param quat - 四元数
   * @returns 矩阵
   */
  setFromQuaternion (quat: Quaternion): Matrix4 {
    return this.compose(Vector3.ZERO, quat, Vector3.ONE);
  }

  /**
   * 通过倾斜参数设置矩阵
   * @param x - x 方向倾斜分量
   * @param y - y 方向倾斜分量
   * @param z - z 方向倾斜分量
   * @returns 倾斜矩阵
   */
  setFromShear (x: number, y: number, z: number): this {
    return this.set(
      1, x, x, 0,
      y, 1, y, 0,
      z, z, 1, 0,
      0, 0, 0, 1,
    );
  }

  /**
   * 通过基轴设置矩阵
   * @param xAxis - x 轴
   * @param yAxis - y 轴
   * @param zAxis - z 轴
   * @returns 倾斜矩阵
   */
  setFromBasis (xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): this {
    return this.set(
      xAxis.x, xAxis.y, xAxis.z, 0,
      yAxis.x, yAxis.y, yAxis.z, 0,
      zAxis.x, zAxis.y, zAxis.z, 0,
      0, 0, 0, 1,
    );
  }

  /**
   * 矩阵清零
   * @returns 零矩阵
   */
  setZero (): this {
    for (let i = 0; i < 16; i++) {
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
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    );
  }

  /**
   * 单位阵判断
   * @returns 判断结果
   */
  isIdentity (): boolean {
    const e = this.elements;

    return e[0] === 1 && e[4] === 0 && e[8] === 0 && e[12] === 0
      && e[1] === 0 && e[5] === 1 && e[9] === 0 && e[13] === 0
      && e[2] === 0 && e[6] === 0 && e[10] === 1 && e[14] === 0
      && e[3] === 0 && e[7] === 0 && e[11] === 0 && e[15] === 1;
  }

  /**
   * 矩阵克隆
   * @returns 克隆结果
   */
  clone (): Matrix4 {
    const e = this.elements;

    return new Matrix4(
      e[0], e[1], e[2], e[3],
      e[4], e[5], e[6], e[7],
      e[8], e[9], e[10], e[11],
      e[12], e[13], e[14], e[15],
    );
  }

  /**
   * 矩阵复制
   * @param m - 复制对象
   * @returns 复制结果
   */
  copyFrom (m: Matrix4): this {
    this.elements = [...m.elements];

    return this;
  }

  /**
   * 得到列向量
   * @param i - 列向量索引，从 0 开始
   * @param v
   * @returns 矩阵
   */
  getColumnVector (i: number, v: Vector4): Vector4 {
    return v.set(
      this.elements[i * 4],
      this.elements[i * 4 + 1],
      this.elements[i * 4 + 2],
      this.elements[i * 4 + 3]
    );
  }

  /**
   * 设置相机矩阵
   * @param eye - 相机位置
   * @param target - 目标位置
   * @param up - 相机方向
   * @returns 矩阵
   */
  lookAt (eye: Vector3, target: Vector3, up: Vector3): this {
    const vX = Matrix4.tempVec0;
    const vY = Matrix4.tempVec1;
    const vZ = Matrix4.tempVec2;

    vZ.subtractVectors(target, eye);
    vZ.normalize();
    vY.copyFrom(up);
    vY.normalize();
    vX.crossVectors(vY, vZ);
    vX.normalize();
    vY.crossVectors(vZ, vX);

    const te = this.elements;

    te[0] = vX.x;
    te[1] = vY.x;
    te[2] = vZ.x;
    te[3] = 0;
    te[4] = vX.y;
    te[5] = vY.y;
    te[6] = vZ.y;
    te[7] = 0;
    te[8] = vX.z;
    te[9] = vY.z;
    te[10] = vZ.z;
    te[11] = 0;
    te[12] = -vX.dot(eye);
    te[13] = -vY.dot(eye);
    te[14] = -vZ.dot(eye);
    te[15] = 1;

    return this;
  }

  /**
   * 矩阵乘比例后相加
   * @param right - 矩阵
   * @param s - 比例
   * @returns 相加结果
   */
  addScaledMatrix (right: Matrix4, s: number): this {
    const te = this.elements;
    const re = right.elements;

    for (let i = 0; i < 16; i++) {
      te[i] += re[i] * s;
    }

    return this;
  }

  /**
   * 矩阵右乘
   * @param right - 右侧矩阵或数值
   * @returns 右乘结果
   */
  multiply (right: Matrix4 | number): this {
    if (typeof right === 'number') {
      for (let i = 0; i < 16; i++) {
        this.elements[i] *= right;
      }

      return this;
    } else {
      return this.multiplyMatrices(this, right);
    }
  }

  /**
   * 矩阵左乘
   * @param left - 左侧矩阵
   * @returns 左乘结果
   */
  premultiply (left: Matrix4): this {
    return this.multiplyMatrices(left, this);
  }

  /**
   * 矩阵相乘
   * @param left - 矩阵
   * @param right - 矩阵
   * @returns 相乘结果
   */
  multiplyMatrices (left: Matrix4, right: Matrix4): this {
    const ae = left.elements;
    const be = right.elements;
    const te = this.elements;

    const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
    const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
    const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
    const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

    const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
    const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
    const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
    const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return this;
  }

  /**
   * 矩阵缩放
   * @param s - 缩放比例
   * @returns 缩放结果
   */
  multiplyScalar (s: number): this {
    const e = this.elements;

    e[0] *= s; e[4] *= s; e[8] *= s; e[12] *= s;
    e[1] *= s; e[5] *= s; e[9] *= s; e[13] *= s;
    e[2] *= s; e[6] *= s; e[10] *= s; e[14] *= s;
    e[3] *= s; e[7] *= s; e[11] *= s; e[15] *= s;

    return this;
  }

  /**
   * 矩阵求行列式值
   * @returns 行列式值
   */
  determinant (): number {
    const e = this.elements;

    const m11 = e[0], m12 = e[4], m13 = e[8], m14 = e[12];
    const m21 = e[1], m22 = e[5], m23 = e[9], m24 = e[13];
    const m31 = e[2], m32 = e[6], m33 = e[10], m34 = e[14];
    const m41 = e[3], m42 = e[7], m43 = e[11], m44 = e[15];

    return (
      m41 * (
        + m14 * m23 * m32
        - m13 * m24 * m32
        - m14 * m22 * m33
        + m12 * m24 * m33
        + m13 * m22 * m34
        - m12 * m23 * m34
      ) +
      m42 * (
        + m11 * m23 * m34
        - m11 * m24 * m33
        + m14 * m21 * m33
        - m13 * m21 * m34
        + m13 * m24 * m31
        - m14 * m23 * m31
      ) +
      m43 * (
        + m11 * m24 * m32
        - m11 * m22 * m34
        - m14 * m21 * m32
        + m12 * m21 * m34
        + m14 * m22 * m31
        - m12 * m24 * m31
      ) +
      m44 * (
        - m13 * m22 * m31
        - m11 * m23 * m32
        + m11 * m22 * m33
        + m13 * m21 * m32
        - m12 * m21 * m33
        + m12 * m23 * m31
      )
    );
  }

  /**
   * 矩阵转置
   * @returns 转置结果
   */
  transpose (): this {
    const e = this.elements;
    let t: number;

    t = e[1]; e[1] = e[4]; e[4] = t;
    t = e[2]; e[2] = e[8]; e[8] = t;
    t = e[3]; e[3] = e[12]; e[12] = t;
    //
    t = e[6]; e[6] = e[9]; e[9] = t;
    t = e[7]; e[7] = e[13]; e[13] = t;
    t = e[11]; e[11] = e[14]; e[14] = t;

    return this;
  }

  /**
   * 矩阵求逆
   * @returns 逆矩阵
   */
  invert (): this {
    // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    const e = this.elements;
    const m11 = e[0], m21 = e[1], m31 = e[2], m41 = e[3];
    const m12 = e[4], m22 = e[5], m32 = e[6], m42 = e[7];
    const m13 = e[8], m23 = e[9], m33 = e[10], m43 = e[11];
    const m14 = e[12], m24 = e[13], m34 = e[14], m44 = e[15];
    const t11 = m23 * m34 * m42 - m24 * m33 * m42 + m24 * m32 * m43 - m22 * m34 * m43 - m23 * m32 * m44 + m22 * m33 * m44;
    const t12 = m14 * m33 * m42 - m13 * m34 * m42 - m14 * m32 * m43 + m12 * m34 * m43 + m13 * m32 * m44 - m12 * m33 * m44;
    const t13 = m13 * m24 * m42 - m14 * m23 * m42 + m14 * m22 * m43 - m12 * m24 * m43 - m13 * m22 * m44 + m12 * m23 * m44;
    const t14 = m14 * m23 * m32 - m13 * m24 * m32 - m14 * m22 * m33 + m12 * m24 * m33 + m13 * m22 * m34 - m12 * m23 * m34;

    const det = m11 * t11 + m21 * t12 + m31 * t13 + m41 * t14;

    if (det === 0) {
      return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }

    const detInv = 1 / det;

    e[0] = t11 * detInv;
    e[1] = (m24 * m33 * m41 - m23 * m34 * m41 - m24 * m31 * m43 + m21 * m34 * m43 + m23 * m31 * m44 - m21 * m33 * m44) * detInv;
    e[2] = (m22 * m34 * m41 - m24 * m32 * m41 + m24 * m31 * m42 - m21 * m34 * m42 - m22 * m31 * m44 + m21 * m32 * m44) * detInv;
    e[3] = (m23 * m32 * m41 - m22 * m33 * m41 - m23 * m31 * m42 + m21 * m33 * m42 + m22 * m31 * m43 - m21 * m32 * m43) * detInv;

    e[4] = t12 * detInv;
    e[5] = (m13 * m34 * m41 - m14 * m33 * m41 + m14 * m31 * m43 - m11 * m34 * m43 - m13 * m31 * m44 + m11 * m33 * m44) * detInv;
    e[6] = (m14 * m32 * m41 - m12 * m34 * m41 - m14 * m31 * m42 + m11 * m34 * m42 + m12 * m31 * m44 - m11 * m32 * m44) * detInv;
    e[7] = (m12 * m33 * m41 - m13 * m32 * m41 + m13 * m31 * m42 - m11 * m33 * m42 - m12 * m31 * m43 + m11 * m32 * m43) * detInv;

    e[8] = t13 * detInv;
    e[9] = (m14 * m23 * m41 - m13 * m24 * m41 - m14 * m21 * m43 + m11 * m24 * m43 + m13 * m21 * m44 - m11 * m23 * m44) * detInv;
    e[10] = (m12 * m24 * m41 - m14 * m22 * m41 + m14 * m21 * m42 - m11 * m24 * m42 - m12 * m21 * m44 + m11 * m22 * m44) * detInv;
    e[11] = (m13 * m22 * m41 - m12 * m23 * m41 - m13 * m21 * m42 + m11 * m23 * m42 + m12 * m21 * m43 - m11 * m22 * m43) * detInv;

    e[12] = t14 * detInv;
    e[13] = (m13 * m24 * m31 - m14 * m23 * m31 + m14 * m21 * m33 - m11 * m24 * m33 - m13 * m21 * m34 + m11 * m23 * m34) * detInv;
    e[14] = (m14 * m22 * m31 - m12 * m24 * m31 - m14 * m21 * m32 + m11 * m24 * m32 + m12 * m21 * m34 - m11 * m22 * m34) * detInv;
    e[15] = (m12 * m23 * m31 - m13 * m22 * m31 + m13 * m21 * m32 - m11 * m23 * m32 - m12 * m21 * m33 + m11 * m22 * m33) * detInv;

    return this;
  }

  /**
   * 提取基轴
   * @param xAxis - 提取的 x 轴
   * @param yAxis - 提取的 y 轴
   * @param zAxis - 提取的 z 轴
   * @returns
   */
  extractBasis (xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): this {
    const te = this.elements;

    xAxis.set(te[0], te[1], te[2]);
    yAxis.set(te[4], te[5], te[6]);
    zAxis.set(te[8], te[9], te[10]);

    return this;
  }

  /**
   * 根据基础信息组装矩阵
   * @param translation - 位置信息
   * @param rotation - 旋转信息
   * @param scale - 缩放信息
   * @param [anchor] - 锚点信息
   * @returns 矩阵
   */
  compose (translation: Vector3, rotation: Quaternion, scale: Vector3, anchor = Vector3.ZERO): Matrix4 {
    const te = this.elements;

    const { x, y, z, w } = rotation;
    const l = -anchor.x;
    const m = -anchor.y;
    const n = -anchor.z;
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

    const { x: sx, y: sy, z: sz } = scale;

    te[0] = (1 - (yy + zz)) * sx;
    te[1] = (xy + wz) * sx;
    te[2] = (xz - wy) * sx;
    te[3] = 0;

    te[4] = (xy - wz) * sy;
    te[5] = (1 - (xx + zz)) * sy;
    te[6] = (yz + wx) * sy;
    te[7] = 0;

    te[8] = (xz + wy) * sz;
    te[9] = (yz - wx) * sz;
    te[10] = (1 - (xx + yy)) * sz;
    te[11] = 0;

    te[12] = l * te[0] + m * te[4] + n * te[8] - l + translation.x;
    te[13] = l * te[1] + m * te[5] + n * te[9] - m + translation.y;
    te[14] = l * te[2] + m * te[6] + n * te[10] - n + translation.z;

    return this;
  }

  /**
   * 矩阵拆分为基础信息
   * @param translation - 位置信息
   * @param rotation - 旋转信息
   * @param scale - 缩放信息
   * @returns 矩阵
   */
  decompose (translation: Vector3, rotation: Quaternion, scale: Vector3): this {
    const v = Matrix4.tempVec0;
    const te = this.elements;

    let sx = v.set(te[0], te[1], te[2]).length();
    const sy = v.set(te[4], te[5], te[6]).length();
    const sz = v.set(te[8], te[9], te[10]).length();

    // if determine is negative, we need to invert one scale
    const det = this.determinant();

    if (det < 0) { sx = - sx; }

    translation.x = te[12];
    translation.y = te[13];
    translation.z = te[14];

    // scale the rotation part
    const m = Matrix4.tempMat0;

    m.copyFrom(this);

    const invSX = 1 / sx;
    const invSY = 1 / sy;
    const invSZ = 1 / sz;

    m.elements[0] *= invSX;
    m.elements[1] *= invSX;
    m.elements[2] *= invSX;

    m.elements[4] *= invSY;
    m.elements[5] *= invSY;
    m.elements[6] *= invSY;

    m.elements[8] *= invSZ;
    m.elements[9] *= invSZ;
    m.elements[10] *= invSZ;

    rotation.setFromRotationMatrix(m);

    scale.x = sx;
    scale.y = sy;
    scale.z = sz;

    return this;
  }

  getTranslation (translation: Vector3): Vector3 {
    const te = this.elements;

    return translation.set(te[12], te[13], te[14]);
  }

  getScale (scale: Vector3): Vector3 {
    const te = this.elements;

    return scale.set(
      Math.hypot(te[0], te[1], te[2]),
      Math.hypot(te[4], te[5], te[6]),
      Math.hypot(te[8], te[9], te[10])
    );
  }

  /**
   * 获得矩阵分解的结果
   * @returns 分解的结果
   */
  getTransform (): { translation: Vector3, rotation: Quaternion, scale: Vector3 } {
    const translation = new Vector3();
    const rotation = new Quaternion();
    const scale = new Vector3();

    this.decompose(translation, rotation, scale);

    return { translation, rotation, scale };
  }

  /**
   * 根据视窗信息设置正交相机投影矩阵
   * @param left - 视窗左平面位置
   * @param right - 视窗右平面位置
   * @param top - 视窗上平面位置
   * @param bottom - 视窗下平面位置
   * @param near - 视窗近平面位置
   * @param far - 视窗远平面位置
   * @returns 矩阵
   */
  orthographic (left: number, right: number, top: number, bottom: number, near: number, far: number): this {
    let a = 1.0 / (right - left);
    let b = 1.0 / (top - bottom);
    let c = 1.0 / (far - near);

    const tx = -(right + left) * a;
    const ty = -(top + bottom) * b;
    const tz = -(far + near) * c;

    a *= 2.0;
    b *= 2.0;
    c *= -2.0;

    const te = this.elements;

    te[0] = a;
    te[1] = 0.0;
    te[2] = 0.0;
    te[3] = 0.0;
    //
    te[4] = 0.0;
    te[5] = b;
    te[6] = 0.0;
    te[7] = 0.0;
    //
    te[8] = 0.0;
    te[9] = 0.0;
    te[10] = c;
    te[11] = 0.0;
    //
    te[12] = tx;
    te[13] = ty;
    te[14] = tz;
    te[15] = 1.0;

    return this;
  }

  /**
   * 通过透视相机基础参数设置投影矩阵
   * @param fov - 视角(弧度)
   * @param aspect - 视窗比例
   * @param near - 近平面
   * @param far - 远平面
   * @param [reverse] - 视锥体长宽反转(3D这里反了？)
   * @returns 投影矩阵
   */
  perspective (fov: number, aspect: number, near: number, far: number, reverse?: boolean): Matrix4 {
    const f = 1.0 / Math.tan(fov * 0.5);
    const nf = 1 / (near - far);

    const te = this.elements;

    te[0] = reverse ? f : f / aspect;
    te[1] = 0;
    te[2] = 0;
    te[3] = 0;
    //
    te[4] = 0;
    te[5] = reverse ? f * aspect : f;
    te[6] = 0;
    te[7] = 0;
    //
    te[8] = 0;
    te[9] = 0;
    te[10] = (far + near) * nf;
    te[11] = -1;
    //
    te[12] = 0;
    te[13] = 0;
    te[14] = 2 * far * near * nf;
    te[15] = 0;

    if (far === null || far === Infinity) {
      te[10] = -1;
      te[14] = -2 * near;
    }

    return this;
  }

  /**
   * 对点进行投影变换
   * @param v - 输入点
   * @param [out] - 输出点，如果没有就覆盖输入的数据
   * @returns 投影后的点
   */
  projectPoint (v: Vector3, out?: Vector3): Vector3 {
    const { x, y, z } = v;
    const e = this.elements;

    const res = out ?? v;

    res.x = e[0] * x + e[4] * y + e[8] * z + e[12];
    res.y = e[1] * x + e[5] * y + e[9] * z + e[13];
    res.z = e[2] * x + e[6] * y + e[10] * z + e[14];
    const w = e[3] * x + e[7] * y + e[11] * z + e[15];

    return res.multiply(1 / w);
  }

  /**
   * 对点进行矩阵变换
   * @param v - 输入点
   * @param [out] - 输出点，如果没有就覆盖输入的数据
   * @returns 变换后的点
   */
  transformPoint (v: Vector3, out?: Vector3): Vector3 {
    const { x, y, z } = v;
    const e = this.elements;

    const res = out ?? v;

    res.x = e[0] * x + e[4] * y + e[8] * z + e[12];
    res.y = e[1] * x + e[5] * y + e[9] * z + e[13];
    res.z = e[2] * x + e[6] * y + e[10] * z + e[14];

    return res;
  }

  /**
   * 对法向量进行矩阵变换
   * @param v - 输入法向量
   * @param [out] - 输出法向量，如果没有就覆盖输入的数据
   * @returns 变换后的法向量
   */
  transformNormal (v: Vector3, out?: Vector3): Vector3 {
    const { x, y, z } = v;
    const e = this.elements;

    const res = out ?? v;

    res.x = e[0] * x + e[4] * y + e[8] * z;
    res.y = e[1] * x + e[5] * y + e[9] * z;
    res.z = e[2] * x + e[6] * y + e[10] * z;

    return res.normalize();
  }

  /**
   * 对四维向量进行矩阵变换
   * @param v - 输入向量
   * @param [out] - 输出向量，如果没有就覆盖输入的数据
   * @returns 变换后向量
   */
  transformVector4 (v: Vector4, out?: Vector4): Vector4 {
    const { x, y, z, w } = v;
    const e = this.elements;

    const res = out ?? v;

    res.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
    res.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
    res.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
    res.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;

    return res;
  }

  /**
   * 矩阵判等
   * @param matrix - 矩阵
   * @returns 判等结果
   */
  equals (matrix: Matrix4): boolean {
    const te = this.elements;
    const me = matrix.elements;

    for (let i = 0; i < 16; i++) {
      if (!isEqual(te[i], me[i])) {
        return false;
      }
    }

    return true;
  }

  /**
   * 矩阵转数组
   * @returns
   */
  toArray (): mat4 {
    return [...this.elements] as mat4;
  }

  fill (array: number[] | Float32Array, offset = 0) {
    const te = this.elements;

    array[offset] = te[0];
    array[offset + 1] = te[1];
    array[offset + 2] = te[2];
    array[offset + 3] = te[3];

    array[offset + 4] = te[4];
    array[offset + 5] = te[5];
    array[offset + 6] = te[6];
    array[offset + 7] = te[7];

    array[offset + 8] = te[8];
    array[offset + 9] = te[9];
    array[offset + 10] = te[10];
    array[offset + 11] = te[11];

    array[offset + 12] = te[12];
    array[offset + 13] = te[13];
    array[offset + 14] = te[14];
    array[offset + 15] = te[15];
  }

  /**
   * 创建单位阵
   * @returns 单位矩阵
   */
  static fromIdentity (): Matrix4 {
    return new Matrix4(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    );
  }

  /**
   * 创建相机矩阵
   * @param eye - 相机位置
   * @param target - 目标位置
   * @param up - 相机方向
   * @returns 矩阵
   */
  static fromLookAt (eye: Vector3, target: Vector3, up: Vector3): Matrix4 {
    return new Matrix4().lookAt(eye, target, up);
  }

  /**
   * 创建投影矩阵
   * @param fov - 视角
   * @param aspect - 视窗比例
   * @param near - 近平面
   * @param far - 远平面
   * @param [reverse] - 视锥体长宽反转
   * @returns 投影矩阵
   */
  static fromPerspective (fov: number, aspect: number, near: number, far: number, reverse?: boolean): Matrix4 {
    return new Matrix4().perspective(fov, aspect, near, far, reverse);
  }

  /**
   * 通过四个列向量创建矩阵
   * @param c1 - 第一列
   * @param c2 - 第二列
   * @param c3 - 第三列
   * @param c4 - 第四列
   * @returns
   */
  static fromColumnVectors (c1: Vector4, c2: Vector4, c3: Vector4, c4: Vector4): Matrix4 {
    return new Matrix4().setFromColumnVectors(c1, c2, c3, c4);
  }

  /**
   * 通过三阶矩阵创建矩阵
   * @param m - 三阶矩阵
   * @returns 创建的矩阵
   */
  static fromMatrix3 (m: Matrix3): Matrix4 {
    return new Matrix4().setFromMatrix3(m);
  }

  /**
   * 通过数组创建矩阵
   * @param array - 数组
   * @param [offset=0] - 起始偏移值
   * @returns 矩阵
   */
  static fromArray (array: Matrix4DataType, offset = 0): Matrix4 {
    return new Matrix4().setFromArray(array, offset);
  }

  /**
   * 通过缩放创建矩阵
   * @param x - x 缩放
   * @param y - y 缩放
   * @param z - z 缩放
   * @returns 缩放结果
   */
  static fromScale (x: number, y: number, z: number): Matrix4 {
    return new Matrix4().setFromScale(x, y, z);
  }

  /**
   * 通过平移创建矩阵
   * @param x - x 平移
   * @param y - y 平移
   * @param z - z 平移
   * @returns 平移结果
   */
  static fromTranslation (x: number, y: number, z: number): Matrix4 {
    return new Matrix4().setFromTranslation(x, y, z);
  }

  /**
   * 通过 x 轴旋转创建矩阵
   * @param theta - x 轴旋转弧度
   * @returns 矩阵
   */
  static fromRotationX (theta: number): Matrix4 {
    return new Matrix4().setFromRotationX(theta);
  }

  /**
   * 通过 y 轴旋转创建矩阵
   * @param theta - y 轴旋转弧度
   * @returns 矩阵
   */
  static fromRotationY (theta: number): Matrix4 {
    return new Matrix4().setFromRotationY(theta);
  }

  /**
   * 通过 z 轴旋转创建矩阵
   * @param theta - z 轴旋转弧度
   * @returns
   */
  static fromRotationZ (theta: number): Matrix4 {
    return new Matrix4().setFromRotationZ(theta);
  }

  /**
   * 通过旋转轴与旋转弧度创建矩阵
   * @param axis - 旋转轴
   * @param angle - 旋转弧度
   * @returns
   */
  static fromRotationAxis (axis: Vector3, angle: number): Matrix4 {
    return new Matrix4().setFromRotationAxis(axis, angle);
  }

  /**
   * 通过欧拉角创建矩阵
   * @param euler - 欧拉角
   * @returns
   */
  static fromEuler (euler: Euler): Matrix4 {
    return new Matrix4().setFromEuler(euler);
  }

  /**
   * 通过四元数创建矩阵
   * @param quat - 四元数
   * @returns
   */
  static fromQuaternion (quat: Quaternion): Matrix4 {
    return new Matrix4().setFromQuaternion(quat);
  }

  /**
   * 通过倾斜创建矩阵
   * @param x - x 方向倾斜分量
   * @param y - y 方向倾斜分量
   * @param z - z 方向倾斜分量
   * @returns 倾斜矩阵
   */
  static fromShear (x: number, y: number, z: number): Matrix4 {
    return new Matrix4().setFromShear(x, y, z);
  }

  /**
   * 通过基轴创建矩阵
   * @param xAxis - x 轴
   * @param yAxis - y 轴
   * @param zAxis - z 轴
   * @returns
   */
  static fromBasis (xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): Matrix4 {
    return new Matrix4().setFromBasis(xAxis, yAxis, zAxis);
  }

  /**
   * 通过行优先数据设置矩阵
   * @param m11 - 第 1 行，第 1 列
   * @param m12 - 第 1 行，第 2 列
   * @param m13 - 第 1 行，第 3 列
   * @param m14 - 第 1 行，第 4 列
   * @param m21 - 第 2 行，第 1 列
   * @param m22 - 第 2 行，第 2 列
   * @param m23 - 第 2 行，第 3 列
   * @param m24 - 第 2 行，第 4 列
   * @param m31 - 第 3 行，第 1 列
   * @param m32 - 第 3 行，第 2 列
   * @param m33 - 第 3 行，第 3 列
   * @param m34 - 第 3 行，第 4 列
   * @param m41 - 第 4 行，第 1 列
   * @param m42 - 第 4 行，第 2 列
   * @param m43 - 第 4 行，第 3 列
   * @param m44 - 第 4 行，第 4 列
   * @returns
   */
  static fromRowMajorData (
    m11: number, m12: number, m13: number, m14: number,
    m21: number, m22: number, m23: number, m24: number,
    m31: number, m32: number, m33: number, m34: number,
    m41: number, m42: number, m43: number, m44: number,
  ): Matrix4 {
    return new Matrix4(
      m11, m21, m31, m41,
      m12, m22, m32, m42,
      m13, m23, m33, m43,
      m14, m24, m34, m44,
    );
  }
}
