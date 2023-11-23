import type { Euler } from './euler';
import type { Matrix3 } from './matrix3';
import type { Quaternion } from './quaternion';
import type { Matrix4 } from './matrix4';
import type { Vector3DataType, Vector3Like, vec3 } from './type';
import { NumberEpsilon } from './utils';
import { Vector2 } from './vector2';

/**
 * 三维向量
 */
export class Vector3 {
  /**
   * 三维向量的常量
   */
  static readonly X = new Vector3(1.0, 0.0, 0.0);
  static readonly Y = new Vector3(0.0, 1.0, 0.0);
  static readonly Z = new Vector3(0.0, 0.0, 1.0);
  static readonly ONE = new Vector3(1.0, 1.0, 1.0);
  static readonly ZERO = new Vector3(0.0, 0.0, 0.0);

  /**
   * 构造函数，默认值为零向量
   * @param [x=0]
   * @param [y=0]
   * @param [z=0]
   */
  constructor (
    public x = 0,
    public y = 0,
    public z = 0,
  ) {}

  /**
   * 设置向量
   * @param x - x 轴分量
   * @param y - y 轴分量
   * @param z - z 轴分量
   * @returns 向量
   */
  set (x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;

    return this;
  }

  /**
   * 设置零向量
   * @returns 向量
   */
  setZero (): this {
    this.x = 0;
    this.y = 0;
    this.z = 0;

    return this;
  }

  /**
   * 通过标量数值设置向量
   * @param num - 数值
   * @returns 向量
   */
  setFromNumber (num: number): this {
    this.x = num;
    this.y = num;
    this.z = num;

    return this;
  }

  /**
   * 通过数组设置向量
   * @param array - 数组
   * @param [offset=0] - 起始偏移值
   * @returns 向量
   */
  setFromArray (array: Vector3DataType, offset = 0): this {
    this.x = array[offset] ?? 0;
    this.y = array[offset + 1] ?? 0;
    this.z = array[offset + 2] ?? 0;

    return this;
  }

  /**
   * 拷贝向量
   * @param v - 要拷贝的对象
   * @returns 向量
   */
  copyFrom (v: Vector3Like): this {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;

    return this;
  }

  /**
   * 克隆向量
   * @returns 向量
   */
  clone (): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  /**
   * 根据下标设置向量分量
   * @param index - 下标值
   * @param value - 数字
   * @returns 向量
   */
  setElement (index: number, value: number): this {
    switch (index) {
      case 0: this.x = value;

        break;
      case 1: this.y = value;

        break;
      case 2: this.z = value;

        break;
      default: console.error('index is out of range: ' + index);
    }

    return this;
  }

  /**
   * 根据下标获取向量分量
   * @param index - 下标
   * @returns
   */
  getElement (index: number): number {
    switch (index) {
      case 0: return this.x;
      case 1: return this.y;
      case 2: return this.z;
      default: console.error('index is out of range: ' + index);
    }

    return 0;
  }

  /**
   * 向量相加
   * @param right - 向量 | 数字
   * @returns 相加结果
   */
  add (right: number | vec3 | Vector3): this {
    if (typeof right === 'number') {
      this.x += right;
      this.y += right;
      this.z += right;
    } else if (right instanceof Array) {
      this.x += right[0];
      this.y += right[1];
      this.z += right[2];
    } else {
      this.x += right.x;
      this.y += right.y;
      this.z += right.z;
    }

    return this;
  }

  /**
   * 向量相加
   * @param left - 向量
   * @param right - 向量
   * @returns 相加结果
   */
  addVectors (left: Vector3, right: Vector3): this {
    this.x = left.x + right.x;
    this.y = left.y + right.y;
    this.z = left.z + right.z;

    return this;
  }

  /**
   * 向量乘比例后相加
   * @param right - 向量
   * @param s - 比例
   * @returns 相加结果
   */
  addScaledVector (right: Vector3, s: number): this {
    this.x += right.x * s;
    this.y += right.y * s;
    this.z += right.z * s;

    return this;
  }

  /**
   * 向量相减
   * @param right - 向量 | 数字
   * @returns 相减
   */
  subtract (right: number | vec3 | Vector3): this {
    if (typeof right === 'number') {
      this.x -= right;
      this.y -= right;
      this.z -= right;
    } else if (right instanceof Array) {
      this.x -= right[0];
      this.y -= right[1];
      this.z -= right[2];
    } else {
      this.x -= right.x;
      this.y -= right.y;
      this.z -= right.z;
    }

    return this;
  }

  /**
   * 向量相减
   * @param left - 向量
   * @param right - 向量
   * @returns 相减结果
   */
  subtractVectors (left: Vector3, right: Vector3): this {
    this.x = left.x - right.x;
    this.y = left.y - right.y;
    this.z = left.z - right.z;

    return this;
  }

  /**
   * 向量相乘
   * @param right - 向量 | 数字
   * @returns 相乘结果
   */
  multiply (right: number | vec3 | Vector3): this {
    if (typeof right === 'number') {
      this.x *= right;
      this.y *= right;
      this.z *= right;
    } else if (right instanceof Array) {
      this.x *= right[0];
      this.y *= right[1];
      this.z *= right[2];
    } else {
      this.x *= right.x;
      this.y *= right.y;
      this.z *= right.z;
    }

    return this;
  }

  /**
   * 向量相乘
   * @param left - 向量
   * @param right - 向量
   * @returns 相乘结果
   */
  multiplyVectors (left: Vector3, right: Vector3): this {
    this.x = left.x * right.x;
    this.y = left.y * right.y;
    this.z = left.z * right.z;

    return this;
  }

  /**
   * 向量相除
   * @param right - 向量 | 数字
   * @returns 相除结果
   */
  divide (right: number | vec3 | Vector3): this {
    if (typeof right === 'number') {
      this.x /= right;
      this.y /= right;
      this.z /= right;
    } else if (right instanceof Array) {
      this.x /= right[0];
      this.y /= right[1];
      this.z /= right[2];
    } else {
      this.x /= right.x;
      this.y /= right.y;
      this.z /= right.z;
    }

    return this;
  }

  /**
   * 向量缩放
   * @param v - 数字
   * @returns 缩放结果
   */
  scale (v: number): this {
    this.x *= v;
    this.y *= v;
    this.z *= v;

    return this;
  }

  /**
   * 分量求和
   * @returns 求和结果
   */
  sum (): number {
    return this.x + this.y + this.z;
  }

  /**
   * 向量求最小值
   * @param v - 向量或数值
   * @returns 求值结果
   */
  min (v: Vector3 | number): this {
    if (typeof v === 'number') {
      this.x = Math.min(this.x, v);
      this.y = Math.min(this.y, v);
      this.z = Math.min(this.z, v);
    } else {
      this.x = Math.min(this.x, v.x);
      this.y = Math.min(this.y, v.y);
      this.z = Math.min(this.z, v.z);
    }

    return this;
  }

  /**
   * 向量求最大值
   * @param v - 向量或数值
   * @returns 求值结果
   */
  max (v: Vector3 | number): this {
    if (typeof v === 'number') {
      this.x = Math.max(this.x, v);
      this.y = Math.max(this.y, v);
      this.z = Math.max(this.z, v);
    } else {
      this.x = Math.max(this.x, v.x);
      this.y = Math.max(this.y, v.y);
      this.z = Math.max(this.z, v.z);
    }

    return this;
  }

  /**
   * 向量阈值约束
   * @param min - 向量
   * @param max - 向量
   * @returns 求值结果
   */
  clamp (min: Vector3 | number, max: Vector3 | number): this {
    return this.max(min).min(max);
  }

  /**
   * 向量向下取整
   * @returns 取整结果
   */
  floor (): this {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);

    return this;
  }

  /**
   * 向量向上取整
   * @returns 取整结果
   */
  ceil (): this {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);

    return this;
  }

  /**
   * 向量四舍五入
   * @returns 计算结果
   */
  round (): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);

    return this;
  }

  /**
   * 向量取绝对值
   * @returns 向量
   */
  abs (): this {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    this.z = Math.abs(this.z);

    return this;
  }

  /**
   * 向量取反
   * @returns 向量
   */
  negate (): this {
    this.x = - this.x;
    this.y = - this.y;
    this.z = - this.z;

    return this;
  }

  /**
   * 向量长度
   * @returns 长度
   */
  length (): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /**
   * 向量长度平方
   * @returns 长度平方
   */
  lengthSquared (): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  /**
   * 向量归一化
   * @returns 向量
   */
  normalize (): this {
    return this.divide(this.length() || 1);
  }

  /**
   * 设置向量长度
   * @param length - 长度
   * @returns 向量
   */
  setLength (length: number): this {
    return this.normalize().multiply(length);
  }

  /**
   * 向量间求线性插值
   * @param other - 向量
   * @param alpha - 插值比例
   * @returns 插值结果
   */
  lerp (other: Vector3, alpha: number): this {
    this.x += (other.x - this.x) * alpha;
    this.y += (other.y - this.y) * alpha;
    this.z += (other.z - this.z) * alpha;

    return this;
  }

  /**
   * 向量间求线性插值
   * @param v1 - 第一个向量
   * @param v2 - 第二个向量
   * @param alpha - 插值比例
   * @returns 求值结果
   */
  lerpVectors (v1: Vector3, v2: Vector3, alpha: number): this {
    this.x = v1.x + (v2.x - v1.x) * alpha;
    this.y = v1.y + (v2.y - v1.y) * alpha;
    this.z = v1.z + (v2.z - v1.z) * alpha;

    return this;
  }

  /**
   * 向量求点积，点积为零表示两向量垂直
   * @param v - 向量
   * @returns 点积结果
   */
  dot (v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
   * 向量求叉积
   * @param right - 向量
   * @returns 叉积结果
   */
  cross (right: Vector3): this {
    return this.crossVectors(this, right);
  }

  /**
   * 向量（a 与 b）求叉积
   * @param left - 向量
   * @param right - 向量
   * @returns 叉积结果
   */
  crossVectors (left: Vector3, right: Vector3): this {
    const { x: ax, y: ay, z: az } = left;
    const { x: bx, y: by, z: bz } = right;

    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;

    return this;
  }

  /**
   * 向量反射
   * @param normal - 法线
   * @returns 反射结果
   */
  reflect (normal: Vector3): this {
    // reflect incident vector off plane orthogonal to normal
    // normal is assumed to have unit length

    return this.subtract(normal.clone().multiply(2 * this.dot(normal)));
  }

  /**
   * 计算向量距离
   * @param v - 向量
   * @returns 距离
   */
  distance (v: Vector3): number {
    return Math.sqrt(this.distanceSquared(v));
  }

  /**
   * 计算向量距离平方
   * @param v - 向量
   * @returns 距离平方
   */
  distanceSquared (v: Vector3): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;

    return dx * dx + dy * dy + dz * dz;
  }

  /**
   * 向量判等
   * @param v - 向量
   * @returns 判等结果
   */
  equals (v: Vector3): boolean {
    return v.x === this.x && v.y === this.y && v.z === this.z;
  }

  /**
   * 是否零向量
   * @returns 是否零向量
   */
  isZero (): boolean {
    const eps = NumberEpsilon;
    const { x, y, z } = this;

    return Math.abs(x) <= eps && Math.abs(y) <= eps && Math.abs(z) <= eps;
  }

  /**
   * 向量转数组
   * @param array - 目标保存对象
   * @returns 数组
   */
  toArray (): [x: number, y: number, z: number] {
    return [this.x, this.y, this.z];
  }

  toVector2 (): Vector2 {
    return new Vector2(this.x, this.y);
  }

  fill (array: number[] | Float32Array, offset = 0) {
    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;
  }

  /**
   * 获取随机向量
   * @returns
   */
  random (): this {
    this.x = Math.random();
    this.y = Math.random();
    this.z = Math.random();

    return this;
  }

  /**
   * 用欧拉角旋转向量
   * @param euler - 欧拉角
   * @param [out] - 输出结果，如果没有就覆盖当前向量值
   * @returns 旋转结果
   */
  applyEuler (euler: Euler, out?: Vector3): Vector3 {
    return euler.rotateVector3(this, out);
  }

  /**
   * 用四元数旋转向量
   * @param q - 四元数
   * @param [out] - 输出结果，如果没有就覆盖当前向量值
   * @returns 旋转结果
   */
  applyQuaternion (q: Quaternion, out?: Vector3): Vector3 {
    return q.rotateVector3(this, out);
  }

  /**
   * 用矩阵变换点
   * @param m - 变换矩阵
   * @param [out] - 输出结果，如果没有就覆盖当前向量值
   * @returns 结果点
   */
  applyMatrix (m: Matrix3 | Matrix4, out?: Vector3): Vector3 {
    return m.transformPoint(this, out);
  }

  /**
   * 用法向量矩阵变换法向量
   * @param m - 法向量矩阵
   * @param [out] - 输出结果，如果没有就覆盖当前向量值
   * @returns 向量
   */
  applyNormalMatrix (m: Matrix3 | Matrix4, out?: Vector3): Vector3 {
    return m.transformNormal(this, out);
  }

  /**
   * 用投影矩阵变换点
   * @param m - 投影矩阵
   * @param [out] - 输出结果，如果没有就覆盖当前向量值
   * @returns 结果点
   */
  applyProjectionMatrix (m: Matrix4, out?: Vector3): Vector3 {
    return m.projectPoint(this, out);
  }

  /**
   * 通过标量数值创建向量
   * @param num - 数值
   * @returns 向量
   */
  static fromNumber (num: number): Vector3 {
    return new Vector3().setFromNumber(num);
  }

  /**
   * 通过数组创建向量
   * @param array - 数组
   * @param [offset=0] - 起始偏移值
   * @returns 向量
   */
  static fromArray (array: Vector3DataType, offset = 0): Vector3 {
    return new Vector3().setFromArray(array, offset);
  }
}
