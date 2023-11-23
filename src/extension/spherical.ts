import { clamp } from '../core/utils';
import { Vector3 } from '../core/vector3';

/**
 * 球坐标
 */
class Spherical {
  /**
   * 球坐标构造函数
   * @param [radius=1] - 球半径
   * @param [phi=0] - 极角，y 轴弧度
   * @param [theta=0] - 方位角，z轴 弧度
   */
  constructor (
    public radius = 1,
    public phi = 0,
    public theta = 0,
  ) { }

  /**
   * 设置球坐标
   * @param radius - 球半径
   * @param phi - 极角
   * @param theta - 方位角
   * @returns 球坐标
   */
  set (radius: number, phi: number, theta: number): this {
    this.radius = radius;
    this.phi = phi;
    this.theta = theta;

    return this;
  }

  /**
   * 复制球坐标
   * @param other - 球坐标
   * @returns 复制结果
   */
  copyFrom (other: Spherical): this {
    this.radius = other.radius;
    this.phi = other.phi;
    this.theta = other.theta;

    return this;
  }

  // restrict phi to be between EPS and PI-EPS
  /**
   * 球坐标有效判断
   * @returns 有效判断结果
   */
  makeSafe (): this {
    const EPS = 0.000001;

    this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));

    return this;
  }

  /**
   * 初始化球坐标
   * @returns 初始球坐标
   */
  makeEmpty (): this {
    this.radius = 1;
    this.phi = 0;
    this.theta = 0;

    return this;
  }

  /**
   * 通过空间坐标设置球坐标
   * @param v - 空间坐标
   * @returns 球坐标
   */
  setFromVec3 (v: Vector3): Spherical {
    return this.setFromCartesianCoords(v.x, v.y, v.z);
  }

  /**
   * 通过笛卡尔坐标设置球坐标表
   * @param x - 笛卡尔坐标系x轴坐标
   * @param y - 笛卡尔坐标系y轴坐标
   * @param z - 笛卡尔坐标系z轴坐标
   * @returns 球坐标
   */
  setFromCartesianCoords (x: number, y: number, z: number): this {
    this.radius = Math.sqrt(x * x + y * y + z * z);

    if (this.radius === 0) {
      this.theta = 0;
      this.phi = 0;
    } else {
      this.theta = Math.atan2(x, z);
      this.phi = Math.acos(clamp(y / this.radius, - 1, 1));
    }

    return this;
  }

  /**
   * 克隆球坐标
   * @returns 克隆结果
   */
  clone () {
    return new Spherical().copyFrom(this);
  }

  getCartesianCoords (): Vector3 {
    return new Vector3();
  }
}

export { Spherical };
