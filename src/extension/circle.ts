import type { Box2 } from './box2';
import { Vector2 } from '../core/vector2';

/**
 * 二维圆
 */
export class Circle {
  center: Vector2;
  radius: number;

  /**
   * 构造函数，默认值为圆心为原点，半径为0
   * @param [center=new Vector2()] - 圆心
   * @param [radius=0] - 半径
   */
  constructor (center = Vector2.ZERO, radius = 0) {
    this.center = center.clone();
    this.radius = radius;
  }

  /**
   * 通过中心点与大小设置圆
   * @param center - 圆心
   * @param radius - 半径
   * @returns
   */
  set (center: Vector2, radius: number): this {
    this.center = center.clone();
    this.radius = radius;

    return this;
  }

  /**
   * 克隆圆
   * @returns 克隆结果
   */
  clone (): Circle {
    return new Circle().copyFrom(this);
  }

  /**
   * 复制圆
   * @param circle - 复制对象
   * @returns 复制结果
   */
  copyFrom (circle: Circle): this {
    this.center.copyFrom(circle.center);
    this.radius = circle.radius;

    return this;
  }

  /**
   * 圆置空
   * @returns 置空结果
   */
  makeEmpty (): this {
    this.center = new Vector2();
    this.radius = 0;

    return this;
  }

  /**
   * 圆判空
   * @returns 判空结果
   */
  isEmpty (): boolean {
    // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
    return this.radius === 0;
  }

  /**
   * 获取圆心
   * @param [target=new Vector2()] - 目标结果对象
   * @returns 圆心
   */
  getCenter (target: Vector2 = new Vector2()): Vector2 {
    target.copyFrom(this.center);

    return target;
  }

  /**
   * 获取半径
   * @returns 半径
   */
  getRadius (): number {
    return this.radius;
  }

  /**
   * 通过二维空间点扩展圆
   * @param point - 二维空间点
   * @returns 扩展结果
   */
  expandByPoint (point: Vector2): this {
    this.radius = this.center.distance(point);

    return this;
  }

  /**
   * 通过大小扩展圆
   * @param scalar - 扩展大小
   * @returns 扩展结果
   */
  expandByScalar (scalar: number): this {
    this.radius += scalar;

    return this;
  }

  /**
   * 判断圆是否包含二维空间点
   * @param point - 二维空间点
   * @returns 包含判断结果
   */
  containsPoint (point: Vector2): boolean {
    return this.center.distance(point) < this.radius;
  }

  /**
   * 判断圆是否包含二维包围盒
   * @param box - 二维包围盒
   * @returns 包含判断结果
   */
  containsBox (box: Box2): boolean {
    for (let i = 0; i < 4; i++) {
      if (!this.containsPoint(box.corners[i])) {
        return false;
      }
    }

    return true;
  }

  /**
   * 判断圆与二维包围盒的相交关系
   * @param box - 二维包围盒
   * @returns 相交判断结果
   */
  intersectsBox (box: Box2): boolean {
    // using 4 splitting planes to rule out intersections
    for (let i = 0; i < 4; i++) {
      if (this.containsPoint(box.corners[i])) {
        return true;
      }
    }

    return false;
  }

  /**
   * 求点与圆的最短距离
   * @param point - 二维空间点
   * @returns 距离
   */
  distanceToPoint (point: Vector2): number {
    return this.center.distance(point) - this.radius;
  }

  /**
   * 圆求交集
   * @param circle - 二维圆
   * @returns 求交结果
   */
  intersect (circle: Circle): this {
    this.center = this.center.add(circle.center);
    this.radius = this.radius + circle.radius - this.center.distance(circle.center);
    this.radius = this.radius < 0 ? 0 : this.radius;

    return this;
  }

  /**
   * 圆求并集
   * @param circle - 二维圆
   * @returns 求并结果
   */
  union (circle: Circle): this {
    this.center = this.center.add(circle.center);
    this.radius = (this.radius + circle.radius + this.center.distance(circle.center)) / 2;

    return this;
  }

  /**
   * 圆的位移
   * @param offset - 二维向量
   * @returns 位移结果
   */
  translate (offset: Vector2): this {
    this.center.add(offset);

    return this;
  }

  /**
   * 圆判等
   * @param circle - 二维圆
   * @returns 判等结果
   */
  equals (circle: Circle): boolean {
    return this.center.equals(circle.center) && this.radius === circle.radius;
  }
}
