import type { Matrix4 } from './matrix4';
import type { Vector4DataType, Vector4Like, vec4 } from './type';
import { NumberEpsilon } from './utils';
import { Vector3 } from './vector3';

/**
 * 四维向量
 */
export class Vector4 {
  /**
   * 四维向量的常量
   */
  static readonly ONE = new Vector4(1.0, 1.0, 1.0, 1.0);
  static readonly ZERO = new Vector4(0.0, 0.0, 0.0, 0.0);

  /**
   * 构造函数
   * @param [x=0] - x 轴分量
   * @param [y=0] - y 轴分量
   * @param [z=0] - z 轴分量
   * @param [w=1] - w 轴分量
   */
  constructor (
    public x = 0,
    public y = 0,
    public z = 0,
    public w = 0,
  ) { }

  /**
   * 设置向量
   * @param x - x 轴分量
   * @param y - y 轴分量
   * @param z - z 轴分量
   * @param w - w 轴分量
   * @returns
   */
  set (x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;

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
    this.w = 0;

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
    this.w = num;

    return this;
  }

  /**
   * 通过数组创建向量
   * @param array - 数组
   * @param [offset=0] - 起始偏移值
   * @returns 向量
   */
  setFromArray (array: Vector4DataType, offset = 0): this {
    this.x = array[offset] ?? 0;
    this.y = array[offset + 1] ?? 0;
    this.z = array[offset + 2] ?? 0;
    this.w = array[offset + 3] ?? 0;

    return this;
  }

  /**
   * 拷贝向量
   * @param v - 复制对象
   * @returns 拷贝结果
   */
  copyFrom (v: Vector4Like): this {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = v.w;

    return this;
  }

  /**
   * 克隆向量
   * @returns 克隆结果
   */
  clone (): Vector4 {
    return new Vector4(this.x, this.y, this.z, this.w);
  }

  /**
   * 根据下标设置向量分量
   * @param index - 下标值
   * @param value - 分量值
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
      case 3: this.w = value;

        break;
      default: console.error('index is out of range: ' + index);
    }

    return this;
  }

  /**
   * 根据下标获取向量分量
   * @param index - 下标
   * @returns 分量值
   */
  getElement (index: number): number {
    switch (index) {
      case 0: return this.x;
      case 1: return this.y;
      case 2: return this.z;
      case 3: return this.w;
      default: console.error('index is out of range: ' + index);
    }

    return 0;
  }

  /**
   * 向量相加
   * @param right - 相加对象，向量 | 数字
   * @returns 相加结果
   */
  add (right: number | vec4 | Vector4): this {
    if (typeof right === 'number') {
      this.x += right;
      this.y += right;
      this.z += right;
      this.w += right;
    } else if (right instanceof Array) {
      this.x += right[0];
      this.y += right[1];
      this.z += right[2];
      this.w += right[3];
    } else {
      this.x += right.x;
      this.y += right.y;
      this.z += right.z;
      this.w += right.w;
    }

    return this;
  }

  /**
   * 向量相加
   * @param left - 向量
   * @param right - 向量
   * @returns 求和结果
   */
  addVectors (left: Vector4, right: Vector4): this {
    this.x = left.x + right.x;
    this.y = left.y + right.y;
    this.z = left.z + right.z;
    this.w = left.w + right.w;

    return this;
  }

  /**
   * 向量比例缩放后相加
   * @param right - 向量
   * @param s - 比例
   * @returns 求和结果
   */
  addScaledVector (right: Vector4, s: number): this {
    this.x += right.x * s;
    this.y += right.y * s;
    this.z += right.z * s;
    this.w += right.w * s;

    return this;
  }

  /**
   * 向量相减
   * @param right - 相减对象，向量 | 数字
   * @returns 相减结果
   */
  subtract (right: number | vec4 | Vector4): this {
    if (typeof right === 'number') {
      this.x -= right;
      this.y -= right;
      this.z -= right;
      this.w -= right;
    } else if (right instanceof Array) {
      this.x -= right[0];
      this.y -= right[1];
      this.z -= right[2];
      this.w -= right[3];
    } else {
      this.x -= right.x;
      this.y -= right.y;
      this.z -= right.z;
      this.w -= right.w;
    }

    return this;
  }

  /**
   * 向量相减
   * @param left - 向量
   * @param right - 向量
   * @returns 向量
   */
  subtractVectors (left: Vector4, right: Vector4): this {
    this.x = left.x - right.x;
    this.y = left.y - right.y;
    this.z = left.z - right.z;
    this.w = left.w - right.w;

    return this;
  }

  /**
   * 向量相乘
   * @param right - 相乘对象，对象 | 数字
   * @returns 向量
   */
  multiply (right: number | vec4 | Vector4): this {
    if (typeof right === 'number') {
      this.x *= right;
      this.y *= right;
      this.z *= right;
      this.w *= right;
    } else if (right instanceof Array) {
      this.x *= right[0];
      this.y *= right[1];
      this.z *= right[2];
      this.w *= right[3];
    } else {
      this.x *= right.x;
      this.y *= right.y;
      this.z *= right.z;
      this.w *= right.w;
    }

    return this;
  }

  /**
   * 向量相乘
   * @param left - 向量
   * @param right - 向量
   * @returns 向量
   */
  multiplyVectors (left: Vector4, right: Vector4): this {
    this.x = left.x * right.x;
    this.y = left.y * right.y;
    this.z = left.z * right.z;
    this.w = left.w * right.w;

    return this;
  }

  /**
   * 向量相除
   * @param right - 相除对象，对象 | 数字
   * @returns 向量
   */
  divide (right: number | vec4 | Vector4): this {
    if (typeof right === 'number') {
      this.x /= right;
      this.y /= right;
      this.z /= right;
      this.w /= right;
    } else if (right instanceof Array) {
      this.x /= right[0];
      this.y /= right[1];
      this.z /= right[2];
      this.w /= right[3];
    } else {
      this.x /= right.x;
      this.y /= right.y;
      this.z /= right.z;
      this.w /= right.w;
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
    this.w *= v;

    return this;
  }

  /**
   * 分量求和
   * @returns 求和结果
   */
  sum (): number {
    return this.x + this.y + this.z + this.w;
  }

  /**
   * 向量求最小值
   * @param v - 向量或数值
   * @returns 最小值
   */
  min (v: Vector4 | number): this {
    if (typeof v === 'number') {
      this.x = Math.min(this.x, v);
      this.y = Math.min(this.y, v);
      this.z = Math.min(this.z, v);
      this.w = Math.min(this.w, v);
    } else {
      this.x = Math.min(this.x, v.x);
      this.y = Math.min(this.y, v.y);
      this.z = Math.min(this.z, v.z);
      this.w = Math.min(this.w, v.w);
    }

    return this;
  }

  /**
   * 向量求最大值
   * @param v - 向量或数值
   * @returns 最大值
   */
  max (v: Vector4 | number): this {
    if (typeof v === 'number') {
      this.x = Math.max(this.x, v);
      this.y = Math.max(this.y, v);
      this.z = Math.max(this.z, v);
      this.w = Math.max(this.w, v);
    } else {
      this.x = Math.max(this.x, v.x);
      this.y = Math.max(this.y, v.y);
      this.z = Math.max(this.z, v.z);
      this.w = Math.max(this.w, v.w);
    }

    return this;
  }

  /**
   * 向量阈值约束
   * @param min - 最小值
   * @param max - 最大值
   * @returns 向量
   */
  clamp (min: Vector4 | number, max: Vector4 | number): this {
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
    this.w = Math.floor(this.w);

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
    this.w = Math.ceil(this.w);

    return this;
  }

  /**
   * 向量四舍五入
   * @returns 求值结果
   */
  round (): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    this.w = Math.round(this.w);

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
    this.w = Math.abs(this.w);

    return this;
  }

  /**
   * 向量取反
   * @returns 取反结果
   */
  negate (): this {
    this.x = - this.x;
    this.y = - this.y;
    this.z = - this.z;
    this.w = - this.w;

    return this;
  }

  /**
   * 向量长度平方
   * @returns 长度平方
   */
  lengthSquared (): number {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  /**
   * 向量长度
   * @returns 长度
   */
  length (): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  /**
   * 向量归一化
   * @returns 归一化结果
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
   * 向量求线性插值
   * @param v - 向量
   * @param alpha - 插值比例
   * @returns 插值结果
   */
  lerp (v: Vector4, alpha: number): this {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;
    this.w += (v.w - this.w) * alpha;

    return this;
  }

  /**
   * 两向量求线性插值
   * @param v1 - 第一个向量
   * @param v2 - 第二个向量
   * @param alpha - 插值比例
   * @returns 插值结果
   */
  lerpVectors (v1: Vector4, v2: Vector4, alpha: number): this {
    this.x = v1.x + (v2.x - v1.x) * alpha;
    this.y = v1.y + (v2.y - v1.y) * alpha;
    this.z = v1.z + (v2.z - v1.z) * alpha;
    this.w = v1.w + (v2.w - v1.w) * alpha;

    return this;
  }

  /**
   * 向量求点积
   * @param v - 向量
   * @returns 点积结果
   */
  dot (v: Vector4): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  /**
   * 向量判等
   * @param v - 向量
   * @returns 判等结果
   */
  equals (v: Vector4): boolean {
    return v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w;
  }

  /**
   * 是否零向量
   * @returns 是否零向量
   */
  isZero (): boolean {
    const eps = NumberEpsilon;
    const { x, y, z, w } = this;

    return Math.abs(x) <= eps && Math.abs(y) <= eps && Math.abs(z) <= eps && Math.abs(w) <= eps;
  }

  /**
   * 向量转数组
   * @returns 数组
   */
  toArray (): [x: number, y: number, z: number, z: number] {
    return [this.x, this.y, this.z, this.w];
  }

  toVector3 (): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  fill (array: number[] | Float32Array, offset = 0) {
    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;
    array[offset + 3] = this.w;
  }

  /**
   * 生成随机向量
   * @returns 向量
   */
  random (): this {
    this.x = Math.random();
    this.y = Math.random();
    this.z = Math.random();
    this.w = Math.random();

    return this;
  }

  /**
   * 变换矩阵作用于向量
   * @param m - 变换矩阵
   * @param [out] - 输出结果，如果没有设置就直接覆盖当前值
   * @returns 向量
   */
  applyMatrix (m: Matrix4, out?: Vector4): Vector4 {
    return m.transformVector4(this, out);
  }

  /**
   * 通过标量数值创建向量
   * @param num - 数值
   * @returns 向量
   */
  static fromNumber (num: number): Vector4 {
    return new Vector4().setFromNumber(num);
  }

  /**
   * 通过数组创建向量
   * @param array - 数组
   * @param [offset=0] - 起始偏移值
   * @returns 向量
   */
  static fromArray (array: Vector4DataType, offset = 0): Vector4 {
    return new Vector4().setFromArray(array, offset);
  }
}
