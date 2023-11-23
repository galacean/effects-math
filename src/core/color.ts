import type { ColorDataType, ColorLike, Vector4Like, vec4 } from './type';
import { Vector4 } from './vector4';

export class Color {
  /**
   * 颜色的常量
   */
  static readonly BLACK = new Color(0, 0, 0, 1);          // 纯黑色
  static readonly BLUE = new Color(0, 0, 1, 1);           // 纯蓝色
  static readonly CLEAR = new Color(0, 0, 0, 0);          // 完全透明
  static readonly CYAN = new Color(0, 1, 1, 1);           // 青色
  static readonly GRAY = new Color(0.5, 0.5, 0.5, 1);     // 灰色
  static readonly GREEN = new Color(0, 1, 0, 1);          // 纯绿色
  static readonly MAGENTA = new Color(1, 0, 1, 1);        // 洋红色
  static readonly RED = new Color(1, 0, 0, 1);            // 纯红色
  static readonly WHITE = new Color(1, 1, 1, 1);          // 纯白色
  static readonly YELLOW = new Color(1, 0.92, 0.016, 1);  // 黄色

  /**
   * 构造函数，默认值为黑色
   * @param [r=0]
   * @param [g=0]
   * @param [b=0]
   * @param [a=0]
   */
  constructor (
    public r = 0,
    public g = 0,
    public b = 0,
    public a = 0,
  ) { }

  /**
   * 设置颜色
   * @param r - r 分量
   * @param g - g 分量
   * @param b - b 分量
   * @param a - a 分量
   * @returns
   */
  set (r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;

    return this;
  }

  /**
   * 设置零颜色
   * @returns
   */
  setZero (): this {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;

    return this;
  }

  /**
   * 通过标量数值设置颜色
   * @param num - 数值
   * @returns
   */
  setFromNumber (num: number): this {
    this.r = num;
    this.g = num;
    this.b = num;
    this.a = num;

    return this;
  }

  /**
   * 通过Vector4创建颜色
   * @param v - Vector4
   * @returns
   */
  setFromVector4 (v: Vector4Like): this {
    this.r = v.x;
    this.g = v.y;
    this.b = v.z;
    this.a = v.w;

    return this;
  }

  /**
   * 通过数组创建颜色
   * @param array - 数组
   * @param [offset=0] - 起始偏移值
   * @returns
   */
  setFromArray (array: ColorDataType, offset = 0): this {
    this.r = array[offset] ?? 0;
    this.g = array[offset + 1] ?? 0;
    this.b = array[offset + 2] ?? 0;
    this.a = array[offset + 3] ?? 0;

    return this;
  }

  setFromHSV (hue: number, saturation: number, value: number, alpha = 1): this {
    const chroma = value * saturation;
    const h = hue / 60;
    const x = chroma * (1 - Math.abs((h % 2) - 1));
    let r = 0;
    let g = 0;
    let b = 0;

    if (h >= 0 && h <= 1) {
      r = chroma;
      g = x;
    } else if (h >= 1 && h <= 2) {
      r = x;
      g = chroma;
    } else if (h >= 2 && h <= 3) {
      g = chroma;
      b = x;
    } else if (h >= 3 && h <= 4) {
      g = x;
      b = chroma;
    } else if (h >= 4 && h <= 5) {
      r = x;
      b = chroma;
    } else if (h >= 5 && h <= 6) {
      r = chroma;
      b = x;
    }

    const m = value - chroma;

    return this.set(r + m, g + m, b + m, alpha);
  }

  setFromHexString (hex: string): this {
    if (hex.substring(0, 1) !== '#' || (hex.length !== 9 && hex.length !== 7)) {
      return this;
    }

    const r = parseInt(hex.substring(1, 3), 16) / 255.0;
    const g = parseInt(hex.substring(3, 5), 16) / 255.0;
    const b = parseInt(hex.substring(5, 7), 16) / 255.0;
    const a = hex.length === 9 ? parseInt(hex.substring(7, 9), 16) / 255.0 : 1.0;

    return this.set(r, g, b, a);
  }

  /**
   * 拷贝颜色
   * @param v - 复制对象
   * @returns 拷贝结果
   */
  copyFrom (v: ColorLike): this {
    this.r = v.r;
    this.g = v.g;
    this.b = v.b;
    this.a = v.a;

    return this;
  }

  /**
   * 克隆颜色
   * @returns 克隆结果
   */
  clone (): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }

  /**
   * 根据下标设置颜色分量
   * @param index - 下标值
   * @param value - 分量值
   * @returns
   */
  setElement (index: number, value: number): this {
    switch (index) {
      case 0: this.r = value;

        break;
      case 1: this.g = value;

        break;
      case 2: this.b = value;

        break;
      case 3: this.a = value;

        break;
      default: console.error('index is out of range: ' + index);
    }

    return this;
  }

  /**
   * 根据下标获取颜色分量
   * @param index - 下标
   * @returns 分量值
   */
  getElement (index: number): number {
    switch (index) {
      case 0: return this.r;
      case 1: return this.g;
      case 2: return this.b;
      case 3: return this.a;
      default: console.error('index is out of range: ' + index);
    }

    return 0;
  }

  /**
   * 颜色相加
   * @param right - 相加对象，颜色 | 数字
   * @returns 相加结果
   */
  add (right: number | vec4 | Color): this {
    if (typeof right === 'number') {
      this.r += right;
      this.g += right;
      this.b += right;
      this.a += right;
    } else if (right instanceof Array) {
      this.r += right[0];
      this.g += right[1];
      this.b += right[2];
      this.a += right[3];
    } else {
      this.r += right.r;
      this.g += right.g;
      this.b += right.b;
      this.a += right.a;
    }

    return this;
  }

  /**
   * 颜色相减
   * @param right - 相减对象，颜色 | 数字
   * @returns 相减结果
   */
  subtract (right: number | vec4 | Color): this {
    if (typeof right === 'number') {
      this.r -= right;
      this.g -= right;
      this.b -= right;
      this.a -= right;
    } else if (right instanceof Array) {
      this.r -= right[0];
      this.g -= right[1];
      this.b -= right[2];
      this.a -= right[3];
    } else {
      this.r -= right.r;
      this.g -= right.g;
      this.b -= right.b;
      this.a -= right.a;
    }

    return this;
  }

  /**
   * 颜色相乘
   * @param right - 相乘对象，对象 | 数字
   * @returns 颜色
   */
  multiply (right: number | vec4 | Color): this {
    if (typeof right === 'number') {
      this.r *= right;
      this.g *= right;
      this.b *= right;
      this.a *= right;
    } else if (right instanceof Array) {
      this.r *= right[0];
      this.g *= right[1];
      this.b *= right[2];
      this.a *= right[3];
    } else {
      this.r *= right.r;
      this.g *= right.g;
      this.b *= right.b;
      this.a *= right.a;
    }

    return this;
  }

  /**
   * 颜色相除
   * @param right - 相除对象，对象 | 数字
   * @returns 颜色
   */
  divide (right: number | vec4 | Color): this {
    if (typeof right === 'number') {
      this.r /= right;
      this.g /= right;
      this.b /= right;
      this.a /= right;
    } else if (right instanceof Array) {
      this.r /= right[0];
      this.g /= right[1];
      this.b /= right[2];
      this.a /= right[3];
    } else {
      this.r /= right.r;
      this.g /= right.g;
      this.b /= right.b;
      this.a /= right.a;
    }

    return this;
  }

  /**
   * 颜色缩放
   * @param v - 数字
   * @returns 缩放结果
   */
  scale (v: number): this {
    this.r *= v;
    this.g *= v;
    this.b *= v;
    this.a *= v;

    return this;
  }

  /**
   * 颜色求最小值
   * @param v - 颜色或数值
   * @returns 最小值
   */
  min (v: Color | number): this {
    if (typeof v === 'number') {
      this.r = Math.min(this.r, v);
      this.g = Math.min(this.g, v);
      this.b = Math.min(this.b, v);
      this.a = Math.min(this.a, v);
    } else {
      this.r = Math.min(this.r, v.r);
      this.g = Math.min(this.g, v.g);
      this.b = Math.min(this.b, v.b);
      this.a = Math.min(this.a, v.a);
    }

    return this;
  }

  /**
   * 颜色求最大值
   * @param v - 颜色或数值
   * @returns 最大值
   */
  max (v: Color | number): this {
    if (typeof v === 'number') {
      this.r = Math.max(this.r, v);
      this.g = Math.max(this.g, v);
      this.b = Math.max(this.b, v);
      this.a = Math.max(this.a, v);
    } else {
      this.r = Math.max(this.r, v.r);
      this.g = Math.max(this.g, v.g);
      this.b = Math.max(this.b, v.b);
      this.a = Math.max(this.a, v.a);
    }

    return this;
  }

  /**
   * 颜色阈值约束
   * @param min - 最小值
   * @param max - 最大值
   * @returns 颜色
   */
  clamp (min: Color | number, max: Color | number): this {
    return this.max(min).min(max);
  }

  /**
   * 颜色求线性插值
   * @param v - 颜色
   * @param alpha - 插值比例
   * @returns 插值结果
   */
  lerp (v: Color, alpha: number): this {
    this.r += (v.r - this.r) * alpha;
    this.g += (v.g - this.g) * alpha;
    this.b += (v.b - this.b) * alpha;
    this.a += (v.a - this.a) * alpha;

    return this;
  }

  /**
   * 计算颜色亮度值
   * @returns 亮度值
   */
  luminance (): number {
    return this.r * 0.3 + this.g * 0.59 + this.b * 0.11;
  }

  /**
   * 颜色判等
   * @param v - 颜色
   * @returns 判等结果
   */
  equals (v: Color): boolean {
    return v.r === this.r && v.g === this.g && v.b === this.b && v.a === this.a;
  }

  toLinear (): this {
    this.r = Color.gammaToLinear(this.r);
    this.g = Color.gammaToLinear(this.g);
    this.b = Color.gammaToLinear(this.b);

    return this;
  }

  toGamma (): this {
    this.r = Color.linearToGamma(this.r);
    this.g = Color.linearToGamma(this.g);
    this.b = Color.linearToGamma(this.b);

    return this;
  }

  /**
   * 颜色转数组
   * @returns 数组
   */
  toArray (): [r: number, g: number, b: number, b: number] {
    return [this.r, this.g, this.b, this.a];
  }

  toVector4 (): Vector4 {
    return new Vector4(this.r, this.g, this.b, this.a);
  }

  /**
   * RGB 颜色空间转 HSV
   * @param result HSV 值
   */
  toHSV (): Color {
    const { r, g, b, a } = this;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const v = max;
    const dm = max - min;
    let h = 0;
    let s = 0;

    if (max !== 0) {
      s = dm / max;
    }

    if (max != min) {
      if (max == r) {
        h = (g - b) / dm;
        if (g < b) {
          h += 6;
        }
      } else if (max == g) {
        h = (b - r) / dm + 2;
      } else if (max == b) {
        h = (r - g) / dm + 4;
      }
      h *= 60;
    }

    return new Color(h, s, v, a);
  }

  toHexString (includeAlpha = true) {
    const R = Color.ToHex(Math.round(this.r * 255));
    const G = Color.ToHex(Math.round(this.g * 255));
    const B = Color.ToHex(Math.round(this.b * 255));
    const A = Color.ToHex(Math.round(this.a * 255));

    if (includeAlpha) {
      return '#' + R + G + B + A;
    } else {
      return '#' + R + G + B;
    }
  }

  fill (array: number[] | Float32Array, offset = 0) {
    array[offset] = this.r;
    array[offset + 1] = this.g;
    array[offset + 2] = this.b;
    array[offset + 3] = this.a;
  }

  /**
   * 通过标量数值创建颜色
   * @param num - 数值
   * @returns
   */
  static fromNumber (num: number): Color {
    return new Color().setFromNumber(num);
  }

  /**
   * 通过数组创建颜色
   * @param array - 数组
   * @param [offset=0] - 起始偏移值
   * @returns
   */
  static fromArray (array: ColorDataType, offset = 0): Color {
    return new Color().setFromArray(array, offset);
  }

  /**
   * 通过 hex 字符串创建颜色
   * @param hex - hex 字符串
   * @returns
   */
  static fromHexString (hex: string): Color {
    return new Color().setFromHexString(hex);
  }

  static fromHSV (hue: number, saturation: number, value: number, alpha = 1): Color {
    return new Color().setFromHSV(hue, saturation, value, alpha);
  }

  /**
   * 颜色值从 Gamma 空间转到线性空间
   * @param v - Gamma 空间颜色值
   * @returns 线性空间颜色值
   */
  static gammaToLinear (v: number): number {
    if (v <= 0.0) {
      return 0.0;
    } else if (v <= 0.04045) {
      return v / 12.92;
    } else if (v < 1.0) {
      return Math.pow((v + 0.055) / 1.055, 2.4);
    } else {
      return Math.pow(v, 2.4);
    }
  }

  /**
   * 颜色值从线性空间转到 Gamma 空间
   * @param value - 线性空间颜色值
   * @returns Gamma 空间颜色值
   */
  static linearToGamma (value: number): number {
    if (value <= 0.0) {
      return 0.0;
    } else if (value < 0.0031308) {
      return 12.92 * value;
    } else if (value < 1.0) {
      return 1.055 * Math.pow(value, 0.41666) - 0.055;
    } else {
      return Math.pow(value, 0.41666);
    }
  }

  static ToHex (i: number): string {
    const str = i.toString(16);

    if (i <= 15) {
      return ('0' + str).toUpperCase();
    }

    return str.toUpperCase();
  }
}
