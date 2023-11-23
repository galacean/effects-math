import type { Vector2DataType, Vector2Like, vec2 } from './type';
import { NumberEpsilon } from './utils';

/**
 * 二维向量
 */
export class Vector2 {
  /**
   * 二维向量的常量
   */
  static readonly ONE = new Vector2(1.0, 1.0);
  static readonly ZERO = new Vector2(0.0, 0.0);

  /**
   * 构造函数，默认为零向量
   * @param [x=0] - x 分量
   * @param [y=0] - y 分量
   */
  constructor (
    public x = 0,
    public y = 0,
  ) { }

  /**
   * 设置向量
   * @param x - x 轴分量
   * @param y - y 轴分量
   * @returns
   */
  set (x: number, y: number): this {
    this.x = x;
    this.y = y;

    return this;
  }

  /**
   * 设置零向量
   * @returns 向量
   */
  setZero (): this {
    this.x = 0;
    this.y = 0;

    return this;
  }

  /**
   * 通过标量数值创建向量
   * @param num - 数值
   * @returns 向量
   */
  setFromNumber (num: number): this {
    this.x = num;
    this.y = num;

    return this;
  }

  /**
   * 通过数组创建向量
   * @param array - 数组
   * @param [offset=0] - 起始偏移值
   * @returns 向量
   */
  setFromArray (array: Vector2DataType, offset = 0): this {
    this.x = array[offset] ?? 0;
    this.y = array[offset + 1] ?? 0;

    return this;
  }

  /**
   * 拷贝向量
   * @param src - 要拷贝的对象
   * @returns 向量
   */
  copyFrom (src: Vector2Like): this {
    this.x = src.x;
    this.y = src.y;

    return this;
  }

  /**
   * 克隆向量
   * @returns 克隆结果
   */
  clone (): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * 根据下标设置元素值
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
      default: console.error('index is out of range: ' + index);
    }

    return this;
  }

  /**
   * 根据下标获取值
   * @param index - 下标
   * @returns 值
   */
  getElement (index: number): number {
    switch (index) {
      case 0: return this.x;
      case 1: return this.y;
      default: console.error('index is out of range: ' + index);
    }

    return 0;
  }

  /**
   * 向量相加
   * @param right - 向量 | 数字
   * @returns 向量
   */
  add (right: number | vec2 | Vector2): this {
    if (typeof right === 'number') {
      this.x += right;
      this.y += right;
    } else if (right instanceof Array) {
      this.x += right[0];
      this.y += right[1];
    } else {
      this.x += right.x;
      this.y += right.y;
    }

    return this;
  }

  /**
   * 向量相加
   * @param left - 向量
   * @param right - 向量
   * @returns 相加结果
   */
  addVectors (left: Vector2, right: Vector2): this {
    this.x = left.x + right.x;
    this.y = left.y + right.y;

    return this;
  }

  /**
   * 向量相减
   * @param right - 向量 |  数字
   * @returns 相减结果
   */
  subtract (right: number | vec2 | Vector2): this {
    if (typeof right === 'number') {
      this.x -= right;
      this.y -= right;
    } else if (right instanceof Array) {
      this.x -= right[0];
      this.y -= right[1];
    } else {
      this.x -= right.x;
      this.y -= right.y;
    }

    return this;
  }

  /**
   * 向量相减
   * @param left - 向量
   * @param right - 向量
   * @returns 相减结果
   */
  subtractVectors (left: Vector2, right: Vector2): this {
    this.x = left.x - right.x;
    this.y = left.y - right.y;

    return this;
  }

  /**
   * 向量相乘
   * @param right - 向量 | 数字
   * @returns 相乘结果
   */
  multiply (right: number | vec2 | Vector2): this {
    if (typeof right === 'number') {
      this.x *= right;
      this.y *= right;
    } else if (right instanceof Array) {
      this.x *= right[0];
      this.y *= right[1];
    } else {
      this.x *= right.x;
      this.y *= right.y;
    }

    return this;
  }

  /**
   * 向量相乘
   * @param left - 向量
   * @param right - 向量
   * @returns 相乘结果
   */
  multiplyVectors (left: Vector2, right: Vector2): this {
    this.x = left.x * right.x;
    this.y = left.y * right.y;

    return this;
  }

  /**
   * 向量相除
   * @param right - 向量 | 数字
   * @returns 相除结果
   */
  divide (right: number | vec2 | Vector2): this {
    if (typeof right === 'number') {
      this.x /= right;
      this.y /= right;
    } else if (right instanceof Array) {
      this.x /= right[0];
      this.y /= right[1];
    } else {
      this.x /= right.x;
      this.y /= right.y;
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

    return this;
  }

  /**
   * 分量求和
   * @returns 求和结果
   */
  sum (): number {
    return this.x + this.y;
  }

  /**
   * 向量求最小值
   * @param v - 向量
   * @returns 最小值
   */
  min (v: Vector2 | number): this {
    if (typeof v === 'number') {
      this.x = Math.min(this.x, v);
      this.y = Math.min(this.y, v);
    } else {
      this.x = Math.min(this.x, v.x);
      this.y = Math.min(this.y, v.y);
    }

    return this;
  }

  /**
   * 向量求最大值
   * @param v - 向量
   * @returns 最大值
   */
  max (v: Vector2 | number): this {
    if (typeof v === 'number') {
      this.x = Math.max(this.x, v);
      this.y = Math.max(this.y, v);
    } else {
      this.x = Math.max(this.x, v.x);
      this.y = Math.max(this.y, v.y);
    }

    return this;
  }

  /**
   * 向量阈值约束
   * @param min - 极小值
   * @param max - 极大值
   * @returns 向量
   */
  clamp (min: Vector2 | number, max: Vector2 | number): this {
    return this.max(min).min(max);
  }

  /**
   * 向量向下取整
   * @returns 取整结果
   */
  floor (): this {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);

    return this;
  }

  /**
   * 向量向上取整
   * @returns 取整结果
   */
  ceil (): this {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);

    return this;
  }

  /**
   * 向量取四舍五入
   * @returns 四舍五入结果
   */
  round (): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);

    return this;
  }

  /**
   * 向量取绝对值
   * @returns 向量
   */
  abs (): this {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);

    return this;
  }

  /**
   * 向量取反
   * @returns 取反结果
   */
  negate (): this {
    this.x = -this.x;
    this.y = -this.y;

    return this;
  }

  /**
   * 向量长度
   * @returns 求值结果
   */
  length (): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * 向量长度平方
   * @returns 求值结果
   */
  lengthSquared (): number {
    return this.x * this.x + this.y * this.y;
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
   * 向量线性插值
   * @param other - 向量
   * @param alpha - 插值比
   * @returns 计算结果
   */
  lerp (other: Vector2, alpha: number): this {
    this.x += (other.x - this.x) * alpha;
    this.y += (other.y - this.y) * alpha;

    return this;
  }

  /**
   * 向量线性插值
   * @param v1 - 向量
   * @param v2 - 向量
   * @param alpha - 插值比
   * @returns 计算结果
   */
  lerpVectors (v1: Vector2, v2: Vector2, alpha: number): this {
    this.x = v1.x + (v2.x - v1.x) * alpha;
    this.y = v1.y + (v2.y - v1.y) * alpha;

    return this;
  }

  /**
   * 向量点乘
   * @param v - 向量
   * @returns 点乘结果
   */
  dot (v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * 向量叉乘
   * @param v - 向量
   * @returns 叉乘结果
   */
  cross (v: Vector2): number {
    return this.x * v.y - this.y * v.x;
  }

  /**
   * 点距离
   * @param v - 点
   * @returns 距离
   */
  distance (v: Vector2): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 点距离平方
   * @param v - 点
   * @returns 距离平方
   */
  distanceSquared (v: Vector2): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;

    return dx * dx + dy * dy;
  }

  /**
   * 向量判等
   * @param v - 向量
   * @returns 判等结果
   */
  equals (v: Vector2): boolean {
    return this.x === v.x && this.y === v.y;
  }

  /**
   * 是否零向量
   * @returns 是否零向量
   */
  isZero (): boolean {
    const eps = NumberEpsilon;
    const { x, y } = this;

    return Math.abs(x) <= eps && Math.abs(y) <= eps;
  }

  /**
   * 向量转数组
   * @returns 数组
   */
  toArray (): [x: number, y: number] {
    return [this.x, this.y];
  }

  fill (array: number[] | Float32Array, offset = 0) {
    array[offset] = this.x;
    array[offset + 1] = this.y;
  }

  /**
   * 随机生成向量
   * @returns 向量
   */
  random (): this {
    this.x = Math.random();
    this.y = Math.random();

    return this;
  }

  /**
   * 通过标量创建向量
   * @param num - 数值
   * @returns 向量
   */
  static fromNumber (num: number): Vector2 {
    return new Vector2().setFromNumber(num);
  }

  /**
   * 通过数组创建向量
   * @param array - 数组
   * @param [offset=0] - 起始偏移值
   * @returns 向量
   */
  static fromArray (array: Vector2DataType, offset = 0): Vector2 {
    return new Vector2().setFromArray(array, offset);
  }
}
