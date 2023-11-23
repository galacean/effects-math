import { Quaternion } from './quaternion';
import type { Vector3 } from './vector3';
import { Matrix4 } from './matrix4';
import { RAD2DEG, clamp } from './utils';
import { DEG2RAD } from './utils';

/**
 * 欧拉角顺序
 */
export enum EulerOrder {
  XYZ = 0,
  XZY = 1,
  YXZ = 2,
  YZX = 3,
  ZXY = 4,
  ZYX = 5,
}

/**
 * 欧拉角
 */
export class Euler {
  static readonly DEFAULT_ORDER = EulerOrder.ZYX;

  private static readonly tempQuat0 = new Quaternion();
  private static readonly tempMat0 = new Matrix4();

  /**
   * 构造函数，传入值为 x, y, z 方向分量以及欧拉角顺序
   * @param [x=0] - x 方向分量
   * @param [y=0] - y 方向分量
   * @param [z=0] - z 方向分量
   * @param [order=Euler.DEFAULT_ORDER] - 欧拉角顺序
   */
  constructor (
    public x = 0,
    public y = 0,
    public z = 0,
    public order = Euler.DEFAULT_ORDER
  ) { }

  /**
   * 设置欧拉角
   * @param x - x 方向分量
   * @param y - y 方向分量
   * @param z - z 方向分量
   * @param [order] - 欧拉角顺序
   * @returns
   */
  set (x: number, y: number, z: number, order = this.order): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;

    return this;
  }

  setZero (order = this.order): this {
    return this.set(0, 0, 0, order);
  }

  /**
   * 通过矩阵设置欧拉角
   * @param m - 矩阵
   * @param [order] - 欧拉角顺序
   * @returns
   */
  setFromRotationMatrix4 (m: Matrix4, order = this.order): this {
    const te = m.elements;
    const m11 = te[0]; const m12 = te[4]; const m13 = te[8];
    const m21 = te[1]; const m22 = te[5]; const m23 = te[9];
    const m31 = te[2]; const m32 = te[6]; const m33 = te[10];

    switch (order) {
      case EulerOrder.XYZ:
        this.y = Math.asin(clamp(m13, -1, 1));
        if (Math.abs(m13) < 0.9999999) {
          this.x = Math.atan2(-m23, m33);
          this.z = Math.atan2(-m12, m11);
        } else {
          this.x = Math.atan2(m32, m22);
          this.z = 0;
        }

        break;
      case EulerOrder.YXZ:
        this.x = Math.asin(-clamp(m23, -1, 1));
        if (Math.abs(m23) < 0.9999999) {
          this.y = Math.atan2(m13, m33);
          this.z = Math.atan2(m21, m22);
        } else {
          this.y = Math.atan2(-m31, m11);
          this.z = 0;
        }

        break;
      case EulerOrder.ZXY:
        this.x = Math.asin(clamp(m32, -1, 1));
        if (Math.abs(m32) < 0.9999999) {
          this.y = Math.atan2(-m31, m33);
          this.z = Math.atan2(-m12, m22);
        } else {
          this.y = 0;
          this.z = Math.atan2(m21, m11);
        }

        break;
      case EulerOrder.ZYX:
        this.y = Math.asin(-clamp(m31, -1, 1));
        if (Math.abs(m31) < 0.9999999) {
          this.x = Math.atan2(m32, m33);
          this.z = Math.atan2(m21, m11);
        } else {
          this.x = 0;
          this.z = Math.atan2(-m12, m22);
        }

        break;
      case EulerOrder.YZX:
        this.z = Math.asin(clamp(m21, -1, 1));
        if (Math.abs(m21) < 0.9999999) {
          this.x = Math.atan2(-m23, m22);
          this.y = Math.atan2(-m31, m11);
        } else {
          this.x = 0;
          this.y = Math.atan2(m13, m33);
        }

        break;
      case EulerOrder.XZY:
        this.z = Math.asin(-clamp(m12, -1, 1));
        if (Math.abs(m12) < 0.9999999) {
          this.x = Math.atan2(m32, m22);
          this.y = Math.atan2(m13, m11);
        } else {
          this.x = Math.atan2(-m23, m33);
          this.y = 0;
        }

        break;
      default:
        console.error('setFromRotationMatrix: unknown order: ' + order);
    }

    this.x *= RAD2DEG;
    this.y *= RAD2DEG;
    this.z *= RAD2DEG;
    this.order = order;

    return this;
  }

  /**
   * 通过四元数设置欧拉角
   * @param quat - 四元数
   * @param [order] - 欧拉角顺序
   * @returns
   */
  setFromQuaternion (quat: Quaternion, order = this.order): this {
    const matrix = Euler.tempMat0;

    matrix.setFromQuaternion(quat);

    return this.setFromRotationMatrix4(matrix, order);
  }

  /**
   * 通过三维向量设置欧拉角
   * @param v - 三维向量
   * @param [order] - 欧拉角顺序
   * @returns
   */
  setFromVector3 (v: Vector3, order = this.order): this {
    return this.set(v.x, v.y, v.z, order);
  }

  /**
   * 通过数组设置欧拉角
   * @param array - 数组
   * @param [offset=0] - 偏移
   * @param [order] - 欧拉角顺序
   * @returns
   */
  setFromArray (array: number[], offset = 0, order = this.order): this {
    this.x = array[offset] ?? 0;
    this.y = array[offset + 1] ?? 0;
    this.z = array[offset + 2] ?? 0;
    this.order = array[offset + 3] ?? order;

    return this;
  }

  /**
   * 克隆欧拉角
   * @returns 克隆结果
   */
  clone (): Euler {
    return new Euler(this.x, this.y, this.z, this.order);
  }

  /**
   * 复制欧拉角
   * @param euler - 复制对象
   * @returns 复制结果
   */
  copyFrom (euler: Euler): this {
    this.x = euler.x;
    this.y = euler.y;
    this.z = euler.z;
    this.order = euler.order;

    return this;
  }

  add (euler: Euler): this {
    if (this.order != euler.order) {
      console.error('add euler with different order');

      return this;
    }

    this.x += euler.x;
    this.y += euler.y;
    this.z += euler.z;

    return this;
  }

  addEulers (left: Euler, right: Euler): this {
    if (left.order != right.order) {
      console.error('add euler with different order');

      return this;
    }

    this.x = left.x + right.x;
    this.y = left.y + right.y;
    this.z = left.z + right.z;
    this.order = left.order;

    return this;
  }

  negate (): this {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;

    return this;
  }

  /**
   * 修改欧拉角顺序
   * @param newOrder - 欧拉角顺序
   * @returns 修改结果
   */
  reorder (newOrder: EulerOrder): this {
    const quaternion = new Quaternion();

    quaternion.setFromEuler(this);

    return this.setFromQuaternion(quaternion, newOrder);
  }

  /**
   * 通过四元数旋转向量
   * @param v - 待旋转向量
   * @param out - 旋转结果，如果没有传入直接覆盖输入值
   * @returns
   */
  rotateVector3 (v: Vector3, out?: Vector3): Vector3 {
    const q = Euler.tempQuat0;

    return q.setFromEuler(this).rotateVector3(v, out);
  }

  /**
   * 欧拉角相等判断
   * @param euler - 欧拉角
   * @returns 判断结果
   */
  equals (euler: Euler): boolean {
    return euler.x === this.x
      && euler.y === this.y
      && euler.z === this.z
      && euler.order === this.order;
  }

  /**
   * 欧拉角保存于三维向量
   * @param vec - 目标保存对象
   * @returns 保存结果
   */
  toVector3 (vec: Vector3): Vector3 {
    return vec.set(this.x, this.y, this.z);
  }

  /**
   * 欧拉角转数组
   * @returns 保存结果
   */
  toArray (): [x: number, y: number, z: number] {
    return [this.x, this.y, this.z];
  }

  /**
   * 欧拉角转四元数
   * @param quat - 目标四元数
   * @returns 目标四元数
   */
  toQuaternion (quat: Quaternion): Quaternion {
    const { x, y, z, order } = this;
    const c1 = Math.cos(x * DEG2RAD * 0.5);
    const c2 = Math.cos(y * DEG2RAD * 0.5);
    const c3 = Math.cos(z * DEG2RAD * 0.5);

    const s1 = Math.sin(x * DEG2RAD * 0.5);
    const s2 = Math.sin(y * DEG2RAD * 0.5);
    const s3 = Math.sin(z * DEG2RAD * 0.5);

    switch (order) {
      case EulerOrder.XYZ:
        quat.set(
          s1 * c2 * c3 + c1 * s2 * s3,
          c1 * s2 * c3 - s1 * c2 * s3,
          c1 * c2 * s3 + s1 * s2 * c3,
          c1 * c2 * c3 - s1 * s2 * s3
        );

        break;
      case EulerOrder.YXZ:
        quat.set(
          s1 * c2 * c3 + c1 * s2 * s3,
          c1 * s2 * c3 - s1 * c2 * s3,
          c1 * c2 * s3 - s1 * s2 * c3,
          c1 * c2 * c3 + s1 * s2 * s3
        );

        break;
      case EulerOrder.ZXY:
        quat.set(
          s1 * c2 * c3 - c1 * s2 * s3,
          c1 * s2 * c3 + s1 * c2 * s3,
          c1 * c2 * s3 + s1 * s2 * c3,
          c1 * c2 * c3 - s1 * s2 * s3
        );

        break;
      case EulerOrder.ZYX:
        quat.set(
          s1 * c2 * c3 - c1 * s2 * s3,
          c1 * s2 * c3 + s1 * c2 * s3,
          c1 * c2 * s3 - s1 * s2 * c3,
          c1 * c2 * c3 + s1 * s2 * s3
        );

        break;
      case EulerOrder.YZX:
        quat.set(
          s1 * c2 * c3 + c1 * s2 * s3,
          c1 * s2 * c3 + s1 * c2 * s3,
          c1 * c2 * s3 - s1 * s2 * c3,
          c1 * c2 * c3 - s1 * s2 * s3
        );

        break;
      case EulerOrder.XZY:
        quat.set(
          s1 * c2 * c3 - c1 * s2 * s3,
          c1 * s2 * c3 - s1 * c2 * s3,
          c1 * c2 * s3 + s1 * s2 * c3,
          c1 * c2 * c3 + s1 * s2 * s3
        );

        break;
      default:
        console.error('unknown euler order: ' + order);
    }

    return quat;
  }

  /**
   * 欧拉角转矩阵
   * @param mat - 目标矩阵
   * @returns 返回目标矩阵
   */
  toMatrix4 (mat: Matrix4): Matrix4 {
    const me = mat.elements;
    const { x, y, z, order } = this;
    const cosX = Math.cos(x * DEG2RAD), sinX = Math.sin(x * DEG2RAD);
    const cosY = Math.cos(y * DEG2RAD), sinY = Math.sin(y * DEG2RAD);
    const cosZ = Math.cos(z * DEG2RAD), sinZ = Math.sin(z * DEG2RAD);

    if (order === EulerOrder.XYZ) {
      const cosXcosZ = cosX * cosZ;
      const cosXsinZ = cosX * sinZ;
      const sinXcosZ = sinX * cosZ;
      const sinXsinZ = sinX * sinZ;

      me[0] = cosY * cosZ;
      me[4] = - cosY * sinZ;
      me[8] = sinY;

      me[1] = cosXsinZ + sinXcosZ * sinY;
      me[5] = cosXcosZ - sinXsinZ * sinY;
      me[9] = - sinX * cosY;

      me[2] = sinXsinZ - cosXcosZ * sinY;
      me[6] = sinXcosZ + cosXsinZ * sinY;
      me[10] = cosX * cosY;
    } else if (order === EulerOrder.YXZ) {
      const cosYcosZ = cosY * cosZ;
      const cosYsinZ = cosY * sinZ;
      const sinYcosZ = sinY * cosZ;
      const sinYsinZ = sinY * sinZ;

      me[0] = cosYcosZ + sinYsinZ * sinX;
      me[4] = sinYcosZ * sinX - cosYsinZ;
      me[8] = cosX * sinY;

      me[1] = cosX * sinZ;
      me[5] = cosX * cosZ;
      me[9] = - sinX;

      me[2] = cosYsinZ * sinX - sinYcosZ;
      me[6] = sinYsinZ + cosYcosZ * sinX;
      me[10] = cosX * cosY;
    } else if (order === EulerOrder.ZXY) {
      const cosYcosZ = cosY * cosZ;
      const cosYsinZ = cosY * sinZ;
      const sinYcosZ = sinY * cosZ;
      const sinYsinZ = sinY * sinZ;

      me[0] = cosYcosZ - sinYsinZ * sinX;
      me[4] = - cosX * sinZ;
      me[8] = sinYcosZ + cosYsinZ * sinX;

      me[1] = cosYsinZ + sinYcosZ * sinX;
      me[5] = cosX * cosZ;
      me[9] = sinYsinZ - cosYcosZ * sinX;

      me[2] = - cosX * sinY;
      me[6] = sinX;
      me[10] = cosX * cosY;
    } else if (order === EulerOrder.ZYX) {
      const cosXcosZ = cosX * cosZ;
      const cosXsinZ = cosX * sinZ;
      const sinXcosZ = sinX * cosZ;
      const sinXsinZ = sinX * sinZ;

      me[0] = cosY * cosZ;
      me[4] = sinXcosZ * sinY - cosXsinZ;
      me[8] = cosXcosZ * sinY + sinXsinZ;

      me[1] = cosY * sinZ;
      me[5] = sinXsinZ * sinY + cosXcosZ;
      me[9] = cosXsinZ * sinY - sinXcosZ;

      me[2] = - sinY;
      me[6] = sinX * cosY;
      me[10] = cosX * cosY;
    } else if (order === EulerOrder.YZX) {
      const cosXcosY = cosX * cosY;
      const cosXsinY = cosX * sinY;
      const sinXcosY = sinX * cosY;
      const sinXsinY = sinX * sinY;

      me[0] = cosY * cosZ;
      me[4] = sinXsinY - cosXcosY * sinZ;
      me[8] = sinXcosY * sinZ + cosXsinY;

      me[1] = sinZ;
      me[5] = cosX * cosZ;
      me[9] = - sinX * cosZ;

      me[2] = - sinY * cosZ;
      me[6] = cosXsinY * sinZ + sinXcosY;
      me[10] = cosXcosY - sinXsinY * sinZ;
    } else if (order === EulerOrder.XZY) {
      const cosXcosY = cosX * cosY;
      const cosXsinY = cosX * sinY;
      const sinXcosY = sinX * cosY;
      const sinXsinY = sinX * sinY;

      me[0] = cosY * cosZ;
      me[4] = - sinZ;
      me[8] = sinY * cosZ;

      me[1] = cosXcosY * sinZ + sinXsinY;
      me[5] = cosX * cosZ;
      me[9] = cosXsinY * sinZ - sinXcosY;

      me[2] = sinXcosY * sinZ - cosXsinY;
      me[6] = sinX * cosZ;
      me[10] = sinXsinY * sinZ + cosXcosY;
    } else {
      console.error('toMatrix4: Invalid order ' + order);
    }

    // bottom row
    me[3] = 0;
    me[7] = 0;
    me[11] = 0;

    // last column
    me[12] = 0;
    me[13] = 0;
    me[14] = 0;
    me[15] = 1;

    return mat;
  }

  /**
   * 通过矩阵创建欧拉角
   * @param m - 矩阵
   * @param [order=Euler.DEFAULT_ORDER] - 欧拉角顺序
   * @returns 创建结果
   */
  static fromRotationMatrix4 (m: Matrix4, order = Euler.DEFAULT_ORDER): Euler {
    return new Euler().setFromRotationMatrix4(m, order);
  }

  /**
   * 通过四元数创建欧拉角
   * @param quat - 四元数
   * @param [order=Euler.DEFAULT_ORDER] - 欧拉角顺序
   * @returns 创建结果
   */
  static fromQuaternion (quat: Quaternion, order = Euler.DEFAULT_ORDER): Euler {
    return new Euler().setFromQuaternion(quat, order);
  }

  /**
   * 通过三维向量创建欧拉角
   * @param v - 三维向量
   * @param [order=Euler.DEFAULT_ORDER] - 欧拉角顺序
   * @returns 创建结果
   */
  static fromVector3 (v: Vector3, order = Euler.DEFAULT_ORDER): Euler {
    return new Euler().setFromVector3(v, order);
  }

  /**
   * 通过数组创建欧拉角
   * @param array - 数组
   * @param [offset=0] - 偏移
   * @param [order=Euler.DEFAULT_ORDER] - 欧拉角顺序
   * @returns 创建结果
   */
  static fromArray (array: number[], offset = 0, order = Euler.DEFAULT_ORDER): Euler {
    return new Euler().setFromArray(array, offset, order);
  }
}
