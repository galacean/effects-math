import type { Euler } from './euler';
import type { Matrix4 } from './matrix4';
import { clamp } from './utils';
import { Vector3 } from './vector3';
import type { Vector4 } from './vector4';

/**
 * 四元数
 */
export class Quaternion {
  private static readonly tempVec0: Vector3 = new Vector3();

  /**
   * 构造函数
   * @param [x=0] - x 分量
   * @param [y=0] - y 分量
   * @param [z=0] - z 分量
   * @param [w=1] - w 分量
   */
  constructor (
    public x = 0,
    public y = 0,
    public z = 0,
    public w = 1,
  ) {
  }

  /**
   * 四元数设置
   * @param x - x 分量
   * @param y - y 分量
   * @param z - z 分量
   * @param w - w 分量
   * @returns 四元数
   */
  set (x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;

    return this;
  }

  /**
   * 通过欧拉角设置四元数
   * @param euler - 欧拉角
   * @returns
   */
  setFromEuler (euler: Euler): this {
    euler.toQuaternion(this);

    return this;
  }

  /**
   * 通过旋转轴和旋转角度设置四元数
   * @param axis - 旋转轴
   * @param angle - 旋转角度（弧度）
   * @returns
   */
  setFromAxisAngle (axis: Vector3, angle: number): this {
    const halfAngle = angle / 2;
    const s = Math.sin(halfAngle);
    const v = Quaternion.tempVec0;

    v.copyFrom(axis).normalize();
    this.x = v.x * s;
    this.y = v.y * s;
    this.z = v.z * s;
    this.w = Math.cos(halfAngle);

    return this;
  }

  /**
   * 通过数组设置四元数
   * @param array - 数组
   * @param [offset=0] - 起始偏移值
   * @returns
   */
  setFromArray (array: number[], offset = 0): this {
    this.x = array[offset];
    this.y = array[offset + 1];
    this.z = array[offset + 2];
    this.w = array[offset + 3];

    return this;
  }

  /**
   * 通过矩阵设置四元数
   * @param m - 矩阵
   * @returns
   */
  setFromRotationMatrix (m: Matrix4): this {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
    const te = m.elements;

    const m11 = te[0];
    const m12 = te[4];
    const m13 = te[8];
    const m21 = te[1];
    const m22 = te[5];
    const m23 = te[9];
    const m31 = te[2];
    const m32 = te[6];
    const m33 = te[10];
    const trace = m11 + m22 + m33;

    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1.0);

      this.w = 0.25 / s;
      this.x = (m32 - m23) * s;
      this.y = (m13 - m31) * s;
      this.z = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

      this.w = (m32 - m23) / s;
      this.x = 0.25 * s;
      this.y = (m12 + m21) / s;
      this.z = (m13 + m31) / s;
      this.negate();
    } else if (m22 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

      this.w = (m13 - m31) / s;
      this.x = (m12 + m21) / s;
      this.y = 0.25 * s;
      this.z = (m23 + m32) / s;
      this.negate();
    } else {
      const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

      this.w = (m21 - m12) / s;
      this.x = (m13 + m31) / s;
      this.y = (m23 + m32) / s;
      this.z = 0.25 * s;
      this.negate();
    }

    // 兼容原先数学库
    return this;
  }

  /**
   * 通过开始和结束向量设置四元数
   * @param from - 开始向量
   * @param to - 结束向量
   * @returns
   */
  setFromUnitVectors (from: Vector3, to: Vector3): this {
    // assumes direction vectors vFrom and vTo are normalized
    let r = from.dot(to) + 1;

    if (r < Number.EPSILON) {
      r = 0;
      if (Math.abs(from.x) > Math.abs(from.z)) {
        this.x = -from.y;
        this.y = from.x;
        this.z = 0;
        this.w = r;
      } else {
        this.x = 0;
        this.y = -from.z;
        this.z = from.y;
        this.w = r;
      }
    } else {
      this.x = from.y * to.z - from.z * to.y;
      this.y = from.z * to.x - from.x * to.z;
      this.z = from.x * to.y - from.y * to.x;
      this.w = r;
    }

    return this.normalize();
  }

  /**
   * 四元数拷贝
   * @param quat - 拷贝目标四元数
   * @returns 拷贝四元数
   */
  copyFrom (quat: Quaternion): this {
    this.x = quat.x;
    this.y = quat.y;
    this.z = quat.z;
    this.w = quat.w;

    return this;
  }

  /**
   * 四元数克隆
   * @returns 克隆结果
   */
  clone (): Quaternion {
    return new Quaternion(this.x, this.y, this.z, this.w);
  }

  /**
   * 四元数间的夹角计算
   * @param other - 其他四元数
   * @returns 夹角
   */
  angleTo (other: Quaternion): number {
    return 2 * Math.acos(Math.abs(clamp(this.dot(other), - 1, 1)));
  }

  /**
   * 四元数向目标旋转
   * @param q - 四元数
   * @param step - 旋转弧度
   * @returns 目标四元数
   */
  rotateTowards (q: Quaternion, step: number): this {
    const angle = this.angleTo(q);

    if (angle === 0) {
      return this;
    }
    const t = Math.min(1, step / angle);

    this.slerp(q, t);

    return this;
  }

  /**
   * 四元数单位化
   * @returns 单位四元数
   */
  identity (): this {
    return this.set(0, 0, 0, 1);
  }

  /**
   * 四元数求逆
   * @returns 四元数的逆
   */
  invert (): this {
    return this.conjugate();
  }

  /**
   * 四元数取负
   * @returns 负四元数
   */
  negate (): this {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    this.w = -this.w;

    return this;
  }

  /**
   * 四元数求共轭值
   * @returns 四元数的共轭值
   */
  conjugate (): this {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;

    return this;
  }

  /**
   * 四元数点乘结果
   * @param v
   * @return
   */
  dot (v: Quaternion): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  /**
   * 四元数的模平方
   * @return
   */
  lengthSquared (): number {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  /**
   * 四元数的欧式长度
   * @returns 长度
   */
  length (): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  /**
   * 四元数归一化
   * @returns 归一化值
   */
  normalize (): this {
    let l = this.length();

    if (l === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 1;
    } else {
      l = 1 / l;
      this.x = this.x * l;
      this.y = this.y * l;
      this.z = this.z * l;
      this.w = this.w * l;
    }

    return this;
  }

  /**
   * 四元数右乘
   * @param right - 右乘的四元数
   * @returns
   */
  multiply (right: Quaternion): this {
    return this.multiplyQuaternions(this, right);
  }

  /**
   * 四元数左乘
   * @param left - 左乘的四元数
   * @returns
   */
  premultiply (left: Quaternion): this {
    return this.multiplyQuaternions(left, this);
  }

  /**
   * 四元数乘法
   * @param left - 四元数
   * @param right - 四元数
   * @returns 四元数
   */
  multiplyQuaternions (left: Quaternion, right: Quaternion): this {
    // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
    const qax = left.x;
    const qay = left.y;
    const qaz = left.z;
    const qaw = left.w;
    const qbx = right.x;
    const qby = right.y;
    const qbz = right.z;
    const qbw = right.w;

    this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

    return this;
  }

  /**
   * 四元数线性插值
   * @see http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
   * @param other - 四元数
   * @param t - 插值比
   * @returns 插值结果
   */
  slerp (other: Quaternion, t: number): this {
    if (t === 0) { return this; }
    if (t === 1) { return this.copyFrom(other); }

    const { x, y, z, w } = this;
    let cosHalfTheta = w * other.w + x * other.x + y * other.y + z * other.z;

    if (cosHalfTheta < 0) {
      this.w = - other.w;
      this.x = - other.x;
      this.y = - other.y;
      this.z = - other.z;
      cosHalfTheta = - cosHalfTheta;
    } else {
      this.copyFrom(other);
    }

    if (cosHalfTheta >= 1.0) {
      this.w = w;
      this.x = x;
      this.y = y;
      this.z = z;

      return this;
    }

    const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

    if (sqrSinHalfTheta <= Number.EPSILON) {
      const s = 1 - t;

      this.w = s * w + t * this.w;
      this.x = s * x + t * this.x;
      this.y = s * y + t * this.y;
      this.z = s * z + t * this.z;
      this.normalize();

      return this;
    }

    const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
    const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    this.w = (w * ratioA + this.w * ratioB);
    this.x = (x * ratioA + this.x * ratioB);
    this.y = (y * ratioA + this.y * ratioB);
    this.z = (z * ratioA + this.z * ratioB);

    return this;
  }

  /**
   * 两个四元数的线性插值
   * @param qa - 四元数
   * @param qb - 四元数
   * @param t - 插值比
   */
  slerpQuaternions (qa: Quaternion, qb: Quaternion, t: number) {
    this.copyFrom(qa).slerp(qb, t);
  }

  /**
   * 通过四元数旋转向量
   * @param v - 待旋转向量
   * @param [out] - 旋转结果，如果没有传入直接覆盖输入值
   * @returns
   */
  rotateVector3 (v: Vector3, out?: Vector3): Vector3 {
    const { x: qx, y: qy, z: qz, w: qw } = this;
    const { x: vx, y: vy, z: vz } = v;

    const ix = qw * vx + qy * vz - qz * vy;
    const iy = qw * vy + qz * vx - qx * vz;
    const iz = qw * vz + qx * vy - qy * vx;
    const iw = - qx * vx - qy * vy - qz * vz;

    const res = out ?? v;

    res.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    res.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    res.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

    return res;
  }

  /**
   * 四元数判等
   * @param quaternion - 四元数
   * @returns 判等结果
   */
  equals (quaternion: Quaternion): boolean {
    return quaternion.x === this.x
      && quaternion.y === this.y
      && quaternion.z === this.z
      && quaternion.w === this.w;
  }

  /**
   * 四元数保存为数组
   * @returns
   */
  toArray (): [x: number, y: number, z: number, w: number] {
    return [this.x, this.y, this.z, this.w];
  }

  /**
   * 四元数转四维向量数组
   * @param vec - 目标保存对象
   * @returns 保存结果
   */
  toVector4 (vec: Vector4): Vector4 {
    return vec.set(this.x, this.y, this.z, this.w);
  }

  /**
   * 四元数转欧拉角
   * @param euler - 目标欧拉角
   * @returns 欧拉角
   */
  toEuler (euler: Euler): Euler {
    return euler.setFromQuaternion(this);
  }

  /**
   * 四元数转矩阵
   * @param mat - 目标矩阵
   * @returns
   */
  toMatrix4 (mat: Matrix4): Matrix4 {
    return mat.compose(Vector3.ZERO, this, Vector3.ONE);
  }

  /**
   * 通过欧拉角创建四元数
   * @param euler - 欧拉角
   * @returns 四元数
   */
  static fromEuler (euler: Euler): Quaternion {
    return new Quaternion().setFromEuler(euler);
  }

  /**
   * 通过旋转轴和旋转角度创建四元数
   * @param axis - 旋转轴
   * @param angle - 旋转角（弧度值）
   * @returns 四元数
   */
  static fromAxisAngle (axis: Vector3, angle: number): Quaternion {
    return new Quaternion().setFromAxisAngle(axis, angle);
  }

  /**
   * 通过数组获取四元数
   * @param array - 数组
   * @param [offset=0] - 起始偏移值
   * @returns 四元数
   */
  static fromArray (array: number[], offset = 0): Quaternion {
    return new Quaternion().setFromArray(array, offset);
  }

  /**
   * 通过旋转矩阵创建四元数
   * @param m - 旋转矩阵
   * @returns 四元数
   */
  static fromRotationMatrix (m: Matrix4): Quaternion {
    return new Quaternion().setFromRotationMatrix(m);
  }

  /**
   * 通过开始和结束向量创建四元数
   * @param from - 开始向量
   * @param to - 结束向量
   * @returns
   */
  static fromUnitVectors (from: Vector3, to: Vector3): Quaternion {
    return new Quaternion().setFromUnitVectors(from, to);
  }
}
