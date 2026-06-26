import { Vector3 } from '../core/vector3';

/**
 * 三维线段
 */
export class Line3 {
  private static readonly tempVec0: Vector3 = new Vector3();
  private static readonly tempVec1: Vector3 = new Vector3();

  start: Vector3;
  end: Vector3;

  /**
   * 构造函数
   * @param [start=new Vector3()] - 线段起点，默认值为(0, 0, 0)
   * @param [end=new Vector3()] - 线段终点，默认值为(0, 0, 0)
   */
  constructor (
    start = Vector3.ZERO,
    end = Vector3.ZERO,
  ) {
    this.start = start.clone();
    this.end = end.clone();
  }

  /**
   * 方向向量（终点减起点）
   * @param [target] - 结果保存对象
   * @returns 方向向量
   */
  delta (target?: Vector3): Vector3 {
    const result = target ?? new Vector3();

    return result.subtractVectors(this.end, this.start);
  }

  /**
   * 计算点到线段的最近点参数
   * @param point - 空间点
   * @param clampToLine - 是否将参数限制在 [0, 1] 范围内
   * @returns 参数 t，0 表示起点，1 表示终点
   */
  closestPointToPointParameter (point: Vector3, clampToLine: boolean): number {
    const startP = Line3.tempVec0.subtractVectors(point, this.start);
    const startEnd = Line3.tempVec1.subtractVectors(this.end, this.start);

    const startEnd2 = startEnd.dot(startEnd);
    const dotProduct = startEnd.dot(startP);

    let t = startEnd2 !== 0 ? dotProduct / startEnd2 : 0;

    if (clampToLine) {
      t = Math.max(0, Math.min(1, t));
    }

    return t;
  }

  /**
   * 计算点到线段的最近点
   * @param point - 空间点
   * @param clampToLine - 是否将结果限制在线段上
   * @param [target] - 结果保存对象
   * @returns 最近点
   */
  closestPointToPoint (point: Vector3, clampToLine: boolean, target?: Vector3): Vector3 {
    const t = this.closestPointToPointParameter(point, clampToLine);

    return this.delta(target).multiply(t).add(this.start);
  }
}