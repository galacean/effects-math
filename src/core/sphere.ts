import type { Matrix4 } from './matrix4';
import { Box3 } from './box3';
import { Vector3 } from './vector3';

/**
 * 球
 */
export class Sphere {
  private static readonly tempBox = new Box3();
  private static readonly tempVec0 = new Vector3();
  private static readonly tempVec1 = new Vector3();

  center: Vector3;
  radius: number;

  /**
   * 构造函数
   * @param [center=Vector3.ZERO] - 球心，默认值为(0, 0, 0)
   * @param [radius=-1] - 半径
   */
  constructor (
    center = Vector3.ZERO,
    radius = -1
  ) {
    this.center = center.clone();
    this.radius = radius;
  }

  /**
   * 通过参数设置球
   * @param center - 球心
   * @param radius - 半径
   * @returns
   */
  set (center: Vector3, radius: number): this {
    this.center.copyFrom(center);
    this.radius = radius;

    return this;
  }

  /**
   * 通过空间点与球心设置球
   * @param points - 三维空间点
   * @param [optionalCenter] - 指定球心
   * @returns
   */
  setFromPoints (points: Vector3[], optionalCenter?: Vector3): this {
    const { center } = this;

    if (optionalCenter !== undefined) {
      center.copyFrom(optionalCenter);
    } else {
      const box = Sphere.tempBox.setFromPoints(points);

      box.getCenter(center);
    }

    let maxRadiusSq = 0;

    for (let i = 0; i < points.length; i++) {
      maxRadiusSq = Math.max(maxRadiusSq, center.distanceSquared(points[i]));
    }

    this.radius = Math.sqrt(maxRadiusSq);

    return this;
  }

  /**
   * 复制球
   * @param sphere - 球信息
   * @returns 复制结果
   */
  copyFrom (sphere: Sphere): this {
    this.center.copyFrom(sphere.center);
    this.radius = sphere.radius;

    return this;
  }

  /**
   * 球判空
   * @returns 判空结果
   */
  isEmpty (): boolean {
    return this.radius < 0;
  }

  /**
   * 球置空
   * @returns 置空结果
   */
  makeEmpty (): this {
    this.center.set(0, 0, 0);
    this.radius = - 1;

    return this;
  }

  /**
   * 三维空间点包围判断
   * @param point - 三维空间点
   * @returns 空间点包含判断
   */
  containsPoint (point: Vector3): boolean {
    return point.distanceSquared(this.center) <= (this.radius * this.radius);
  }

  /**
   * 空间点与球表面的最短距离
   * @param point - 三维空间点
   * @returns 距离结果
   */
  distanceToPoint (point: Vector3): number {
    return point.distance(this.center) - this.radius;
  }

  /**
   * 与球相交判断
   * @param sphere - 球
   * @returns 相交判断结果
   */
  intersectsSphere (sphere: Sphere): boolean {
    const radiusSum = this.radius + sphere.radius;

    return sphere.center.distanceSquared(this.center) <= (radiusSum * radiusSum);
  }

  /**
   * 与包围盒相交判断
   * @param box - 三维包围盒
   * @returns 相交判断结果
   */
  intersectsBox (box: Box3): boolean {
    return box.intersectsSphere(this);
  }

  /**
   * 收敛空间点在球范围内
   * 注：乘法的效率要比开方高很多
   * @param point - 三维空间点
   * @param [target] - 结果保存对象
   * @returns 收敛结果
   */
  clampPoint (point: Vector3, target?: Vector3): Vector3 {
    const deltaLengthSq = this.center.distanceSquared(point);

    if (target === undefined) { target = new Vector3(); }

    target.copyFrom(point);

    if (deltaLengthSq > (this.radius * this.radius)) {

      target.subtract(this.center).normalize();
      target.multiply(this.radius).add(this.center);

    }

    return target;
  }

  /**
   * 根据包围盒获取球
   * @param target - 包围盒
   * @returns 球
   */
  getBoundingBox (target: Box3): Box3 {
    if (target === undefined) { target = new Box3(); }

    if (this.isEmpty()) {
      // Empty sphere produces empty bounding box
      target.makeEmpty();

      return target;
    }

    target.set(this.center, this.center);
    target.expandByScalar(this.radius);

    return target;
  }

  /**
   * 球空间变换
   * @param matrix - 空间变化矩阵
   * @returns 变换结果
   */
  applyMatrix4 (matrix: Matrix4): this {
    const mt = matrix.elements;

    const scaleXSq = mt[0] * mt[0] + mt[1] * mt[1] + mt[2] * mt[2];
    const scaleYSq = mt[4] * mt[4] + mt[5] * mt[5] + mt[6] * mt[6];
    const scaleZSq = mt[8] * mt[8] + mt[9] * mt[9] + mt[10] * mt[10];

    const maxScale = Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));

    this.center.applyMatrix(matrix);
    this.radius = this.radius * maxScale;

    return this;
  }

  /**
   * 球位移
   * @param offset - 位移信息
   * @returns 位移结果
   */
  translate (offset: Vector3): this {
    this.center.add(offset);

    return this;
  }

  /**
   * 通过三维空间点对球进行扩展
   * @param point - 扩展点
   * @returns 扩展结果
   */
  expandByPoint (point: Vector3): this {
    if (this.isEmpty()) {
      return this.set(point, 0);
    }

    const vector = Sphere.tempVec0.subtractVectors(point, this.center);
    const lengthSquared = vector.lengthSquared();

    if (lengthSquared > (this.radius * this.radius)) {
      const length = Math.sqrt(lengthSquared);
      const missingRadiusHalf = (length - this.radius) * 0.5;

      // Nudge this sphere towards the target point. Add half the missing distance to radius,
      // and the other half to position. This gives a tighter enclosure, instead of if
      // the whole missing distance were just added to radius.

      this.center.add(vector.multiply(missingRadiusHalf / length));
      this.radius += missingRadiusHalf;
    }

    return this;
  }

  /**
   * 包围球求并集
   * @param sphere - 包围球
   * @returns 求并结果
   */
  union (sphere: Sphere): this {
    if (sphere.isEmpty()) {
      return this;
    }

    if (this.isEmpty()) {
      return this.copyFrom(sphere);
    }

    if (this.center.equals(sphere.center)) {
      this.radius = Math.max(this.radius, sphere.radius);
    } else {
      const point = Sphere.tempVec0;
      const offset = Sphere.tempVec1.subtractVectors(sphere.center, this.center).setLength(sphere.radius);

      this.expandByPoint(point.copyFrom(sphere.center).add(offset));
      this.expandByPoint(point.copyFrom(sphere.center).subtract(offset));
    }

    return this;
  }

  /**
   * 获取两个包围球交集的保守包围球。部分重叠时，真实交集为透镜形，
   * 因此结果取两个输入中较小的包围球，并不精确表示交集。
   * @param other - 其它包围球
   * @returns 求交结果
   */
  intersect (other: Sphere): this {
    if (this.isEmpty() || other.isEmpty()) {
      return this.makeEmpty();
    }

    const distance = this.center.distance(other.center);

    if (distance > this.radius + other.radius) {
      return this.makeEmpty();
    }

    if (this.radius >= distance + other.radius) {
      return this.copyFrom(other);
    }

    if (other.radius >= distance + this.radius) {
      return this;
    }

    return this.radius <= other.radius ? this : this.copyFrom(other);
  }

  /**
   * 包围球判等
   * @param sphere - 包围球
   * @returns 判等结果
   */
  equals (sphere: Sphere): boolean {
    return sphere.center.equals(this.center) && (sphere.radius === this.radius);
  }

  /**
   * 包围球克隆
   * @returns 克隆结果
   */
  clone (): Sphere {
    return new Sphere().copyFrom(this);
  }
}
