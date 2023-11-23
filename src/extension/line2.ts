import { clamp } from '../core/utils';
import { Vector2 } from '../core/vector2';

/**
 * 二维线段
 */
export class Line2 {
  start: Vector2;
  end: Vector2;

  /**
   * 构造函数
   * @param [start=Vector2.ZERO] - 线段起点，默认值为(0, 0)
   * @param [end=Vector2.ZERO] - 线段终点，默认值为(0, 0)
   */
  constructor (
    start = Vector2.ZERO,
    end = Vector2.ZERO,
  ) {
    this.start = start.clone();
    this.end = end.clone();
  }

  /**
   * 设置二维线段
   * @param start - 线段起点
   * @param end - 线段终点
   * @returns 二维线段
   */
  set (start: Vector2, end: Vector2): this {
    this.start.copyFrom(start);
    this.end.copyFrom(end);

    return this;
  }

  /**
   * 复制二维线段
   * @param line - 复制对象
   * @returns 复制结果
   */
  copyFrom (line: Line2): this {
    this.start.copyFrom(line.start);
    this.end.copyFrom(line.end);

    return this;
  }

  /**
   * 二维线段求方向
   * @returns 二维线段方向
   */
  direction (): Vector2 {
    return new Vector2().subtractVectors(this.end, this.start).normalize();
  }

  /**
   * 二维线段求中点
   * @param [target=new Vector2()] - 目标保存对象
   * @returns 二维线段中点
   */
  getCenter (target = new Vector2()): Vector2 {
    return target.addVectors(this.start, this.end).multiply(0.5);
  }

  /**
   * 二维线段向量值
   * @param [target=new Vector2()] - 目标保存对象
   * @returns 二维线段向量值
   */
  delta (target = new Vector2()): Vector2 {
    return target.subtractVectors(this.end, this.start);
  }

  /**
   * 二维线段欧式距离平方
   * @returns 计算结果
   */
  distanceSq (): number {
    return this.start.distanceSquared(this.end);
  }

  /**
   * 二维线段欧式距离
   * @returns 计算结果
   */
  distance (): number {
    return this.start.distance(this.end);
  }

  /**
   * 求二维线段比例点
   * @param t - 比例值
   * @param [target=new Vector2()] - 目标保存对象
   * @returns 比例点结果
   */
  at (t: number, target = new Vector2()): Vector2 {
    return this.delta(target).multiply(t).add(this.start);
  }

  /**
   * 求点与线段的最短距离
   * @param point - 二维空间点
   * @param clampToLine - 是否限制于线段内
   * @returns 距离结果
   */
  closestPointToPointParameter (point: Vector2, clampToLine: boolean): number {
    const startP = new Vector2();
    const startEnd = new Vector2();

    startP.subtractVectors(point, this.start);
    startEnd.subtractVectors(this.end, this.start);

    const se2se = startEnd.dot(startEnd);
    const se2sp = startEnd.dot(startP);

    let t = se2sp / se2se;

    if (clampToLine) {
      t = clamp(t, 0, 1);
    }

    return t;
  }

  /**
   * 求点与线段的最近交点
   * @param point - 二维空间点
   * @param clampToLine - 是否限制于线段内
   * @param [target=new Vector2()] - 目标保存对象
   * @returns 最近交点
   */
  closestPointToPoint (point: Vector2, clampToLine: boolean, target: Vector2 = new Vector2()): Vector2 {
    const t = this.closestPointToPointParameter(point, clampToLine);

    return this.delta(target).multiply(t).add(this.start);
  }

  /**
   * 二维线段判等
   * @param line - 二维线段
   * @returns 判等结果
   */
  equals (line: Line2): boolean {
    return line.start.equals(this.start) && line.end.equals(this.end);
  }

  /**
   * 克隆二维线段
   * @returns 克隆结果
   */
  clone (): Line2 {
    return new Line2().copyFrom(this);
  }

  /**
   * 二维线段求长度
   * @returns 长度
   */
  length (): number {
    return new Vector2().subtractVectors(this.end, this.start).length();
  }

  /**
   * 二维线段判断相交
   * @param other - 二维线段
   * @returns 相交判断结果
   */
  crossWithLine (other: Line2): boolean {
    const vecA = this.delta();
    const vecB = other.delta();
    const vecAStart = new Vector2().subtractVectors(other.start, this.start);
    const vecAEnd = new Vector2().subtractVectors(other.end, this.start);
    const vecBStart = new Vector2().subtractVectors(this.start, other.start);
    const vecBEnd = new Vector2().subtractVectors(this.end, other.start);

    const crossA2BStart = vecAStart.cross(vecA);
    const crossA2BEnd = vecAEnd.cross(vecA);

    const crossB2AStart = vecBStart.cross(vecB);
    const crossB2AEnd = vecBEnd.cross(vecB);

    if (crossA2BStart * crossA2BEnd < 0 && crossB2AStart * crossB2AEnd < 0) {
      return true;
    }

    return false;
  }
}
