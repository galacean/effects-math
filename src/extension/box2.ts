import { Vector2 } from '../core/vector2';

/**
 * 二维轴对齐包围盒（AABB）。
 *
 * 包围盒仅由 `min` 和 `max` 表示，
 * 不保存旋转后的角点或其它 OBB 状态。
 */
export class Box2 {
  min: Vector2;
  max: Vector2;

  /**
   * 构造函数，传入值为空时表示空包围盒。
   * @param min - 最小点
   * @param max - 最大点
   */
  constructor (
    min = new Vector2(+Infinity, +Infinity),
    max = new Vector2(-Infinity, -Infinity),
  ) {
    this.min = min.clone();
    this.max = max.clone();
  }

  /**
   * 通过最大、最小点设置二维包围盒。
   * @param min - 最小点
   * @param max - 最大点
   * @returns 当前包围盒
   */
  set (min: Vector2, max: Vector2): this {
    this.min.copyFrom(min);
    this.max.copyFrom(max);

    return this;
  }

  /**
   * 通过二维空间点集合设置包围盒。
   * @param points - 二维空间点集合
   * @returns 当前包围盒
   */
  setFromPoints (points: readonly Vector2[]): this {
    this.makeEmpty();

    for (let i = 0, il = points.length; i < il; i++) {
      this.expandByPoint(points[i]);
    }

    return this;
  }

  /**
   * 通过中心与大小设置二维包围盒。
   * @param center - 中心点
   * @param size - 包围盒大小
   * @returns 当前包围盒
   */
  setFromCenterAndSize (center: Vector2, size: Vector2): this {
    const halfSize = size.clone().multiply(0.5);

    this.min.copyFrom(center).subtract(halfSize);
    this.max.copyFrom(center).add(halfSize);

    return this;
  }

  /**
   * 克隆二维包围盒。
   * @returns 克隆结果
   */
  clone (): Box2 {
    return new Box2().copyFrom(this);
  }

  /**
   * 复制二维包围盒。
   * @param box - 复制对象
   * @returns 当前包围盒
   */
  copyFrom (box: Box2): this {
    this.min.copyFrom(box.min);
    this.max.copyFrom(box.max);

    return this;
  }

  /**
   * 将二维包围盒置空。
   * @returns 当前包围盒
   */
  makeEmpty (): this {
    this.min.x = this.min.y = +Infinity;
    this.max.x = this.max.y = -Infinity;

    return this;
  }

  /**
   * 判断二维包围盒是否为空。
   *
   * 零宽或零高的退化盒仍包含点，不视为空盒。
   * @returns 是否为空包围盒
   */
  isEmpty (): boolean {
    return this.max.x < this.min.x || this.max.y < this.min.y;
  }

  /**
   * 获取二维包围盒中心点。
   * @param target - 结果存放对象
   * @returns 二维包围盒中心点
   */
  getCenter (target: Vector2 = new Vector2()): Vector2 {
    return this.isEmpty() ? target.set(0, 0) : target.addVectors(this.min, this.max).multiply(0.5);
  }

  /**
   * 获取二维包围盒大小。
   * @param target - 结果存放对象
   * @returns 二维包围盒大小
   */
  getSize (target: Vector2 = new Vector2()): Vector2 {
    return this.isEmpty() ? target.set(0, 0) : target.subtractVectors(this.max, this.min);
  }

  /**
   * 扩展包围盒以包含指定点。
   * @param point - 二维空间点
   * @returns 当前包围盒
   */
  expandByPoint (point: Vector2): this {
    this.min.min(point);
    this.max.max(point);

    return this;
  }

  /**
   * 沿两个坐标轴扩展包围盒。
   * @param vector - 两个坐标轴上的扩展量
   * @returns 当前包围盒
   */
  expandByVector (vector: Vector2): this {
    this.min.subtract(vector);
    this.max.add(vector);

    return this;
  }

  /**
   * 沿两个坐标轴等量扩展包围盒。
   * @param scalar - 扩展量
   * @returns 当前包围盒
   */
  expandByScalar (scalar: number): this {
    this.min.add(-scalar);
    this.max.add(scalar);

    return this;
  }

  /**
   * 判断包围盒是否包含指定点。
   * @param point - 二维空间点
   * @returns 是否包含指定点
   */
  containsPoint (point: Vector2): boolean {
    return point.x >= this.min.x && point.x <= this.max.x
      && point.y >= this.min.y && point.y <= this.max.y;
  }

  /**
   * 判断当前包围盒是否完整包含另一个包围盒。
   * @param box - 其它包围盒
   * @returns 是否完整包含
   */
  containsBox (box: Box2): boolean {
    return this.min.x <= box.min.x
      && box.max.x <= this.max.x
      && this.min.y <= box.min.y
      && box.max.y <= this.max.y;
  }

  /**
   * 获取点在二维包围盒内的比例位置。
   * @param point - 二维空间点
   * @param target - 结果存放对象
   * @returns 点在包围盒内的比例位置
   */
  getParameter (point: Vector2, target: Vector2 = new Vector2()): Vector2 {
    return target.set(
      (point.x - this.min.x) / (this.max.x - this.min.x),
      (point.y - this.min.y) / (this.max.y - this.min.y),
    );
  }

  /**
   * 判断当前包围盒是否与另一个包围盒相交。
   * @param box - 其它包围盒
   * @returns 是否相交
   */
  intersectsBox (box: Box2): boolean {
    return box.max.x >= this.min.x
      && box.min.x <= this.max.x
      && box.max.y >= this.min.y
      && box.min.y <= this.max.y;
  }

  /**
   * 将指定点约束在包围盒内。
   * @param point - 二维空间点
   * @param target - 结果存放对象
   * @returns 约束后的点
   */
  clampPoint (point: Vector2, target: Vector2 = new Vector2()): Vector2 {
    return target.copyFrom(point).clamp(this.min, this.max);
  }

  /**
   * 获取指定点到包围盒的距离。
   * @param point - 二维空间点
   * @returns 距离
   */
  distanceToPoint (point: Vector2): number {
    const clampedPoint = point.clone().clamp(this.min, this.max);

    return clampedPoint.subtract(point).length();
  }

  /**
   * 计算当前包围盒与另一个包围盒的交集。
   * @param box - 其它包围盒
   * @returns 当前包围盒
   */
  intersect (box: Box2): this {
    this.min.max(box.min);
    this.max.min(box.max);

    if (this.isEmpty()) {
      this.makeEmpty();
    }

    return this;
  }

  /**
   * 计算当前包围盒与另一个包围盒的并集。
   * @param box - 其它包围盒
   * @returns 当前包围盒
   */
  union (box: Box2): this {
    this.min.min(box.min);
    this.max.max(box.max);

    return this;
  }

  /**
   * 平移二维包围盒。
   * @param offset - 位移向量
   * @returns 当前包围盒
   */
  translate (offset: Vector2): this {
    this.min.add(offset);
    this.max.add(offset);

    return this;
  }

  /**
   * 判断二维包围盒是否相等。
   * @param box - 其它包围盒
   * @returns 是否相等
   */
  equals (box: Box2): boolean {
    return box.min.equals(this.min) && box.max.equals(this.max);
  }
}
