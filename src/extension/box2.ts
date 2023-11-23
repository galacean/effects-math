import { Line2 } from './line2';
import { Vector2 } from '../core/vector2';

/**
 * 二维包围盒
 */
export class Box2 {
  min: Vector2;
  max: Vector2;

  /**
   * @member corners - 二维包围盒角点
   */
  corners: Vector2[];

  /**
   * 构造函数，传入值为空时表示空包围盒
   * @param min - 最小点
   * @param max - 最大点
   */
  constructor (
    min = new Vector2(+Infinity, +Infinity),
    max = new Vector2(-Infinity, -Infinity),
  ) {
    this.min = min.clone();
    this.max = max.clone();
    //
    if (!this.isEmpty()) {
      this.corners = [
        min.clone(),
        new Vector2(max.x, min.y),
        max.clone(),
        new Vector2(min.x, max.y),
      ];
    } else {
      this.corners = [];
    }
  }

  /**
   * 通过最大最小点设置二维包围盒
   * @param min 最小点
   * @param max 最大点
   * @returns 二维包围盒
   */
  set (min: Vector2, max: Vector2): this {
    this.min.copyFrom(min);
    this.max.copyFrom(max);
    this.corners = [
      min.clone(),
      new Vector2(max.x, min.y),
      max.clone(),
      new Vector2(min.x, max.y),
    ];

    return this;
  }

  /**
   * 通过角点设置二维包围盒
   * @param vecArray - 二维空间点数组
   * @returns 二维包围盒
   */
  setFromVec2Array (vecArray: Vector2[]): this {
    this.min = vecArray[0].clone();
    this.max = vecArray[0].clone();
    vecArray.forEach(v => {
      this.min.min(v);
      this.max.max(v);
      this.corners.push(v.clone());
    });

    return this;
  }

  setFromVec2ArrayWithOutCorners (vecArray: Vector2[]): this {
    this.min = vecArray[0].clone();
    this.max = vecArray[0].clone();
    vecArray.forEach(v => {
      this.min.min(v);
      this.max.max(v);
    });

    this.corners.push(new Vector2(this.min.x, this.min.y));
    this.corners.push(new Vector2(this.min.x, this.max.y));
    this.corners.push(new Vector2(this.max.x, this.max.y));
    this.corners.push(new Vector2(this.max.x, this.min.y));

    return this;
  }

  /**
   * 通过中心与大小设置二维包围盒
   * @param center - 二维中心点
   * @param size - 二维大小
   * @returns 二维包围盒
   */
  setFromCenterAndSize (center: Vector2, size: Vector2): this {
    const halfSize = size.clone().multiply(0.5);

    this.min.copyFrom(center).subtract(halfSize);
    this.max.copyFrom(center).add(halfSize);
    this.corners = [
      this.min.clone(),
      new Vector2(this.max.x, this.min.y),
      this.max.clone(),
      new Vector2(this.min.x, this.max.y),
    ];

    return this;
  }

  /**
   * 克隆二维包围盒
   * @returns 克隆结果
   */
  clone (): Box2 {
    return new Box2().copyFrom(this);
  }

  /**
   * 复制二维包围盒
   * @param box - 二维包围盒
   * @returns 复制结果
   */
  copyFrom (box: Box2): this {
    this.corners = [];
    this.min.copyFrom(box.min);
    this.max.copyFrom(box.max);
    box.corners.forEach(corner => {
      this.corners.push(corner.clone());
    });

    return this;
  }

  /**
   * 二维包围盒置空
   * @returns 置空结果
   */
  makeEmpty (): this {
    this.min.x = this.min.y = +Infinity;
    this.max.x = this.max.y = -Infinity;
    this.corners = [];

    return this;
  }

  /**
   * 二维包围盒判空
   * @returns 判空结果
   */
  isEmpty (): boolean {
    // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
    return (this.max.x <= this.min.x) || (this.max.y <= this.min.y);
  }

  /**
   * 获取二维包围盒角点
   * @returns 二维包围盒角点
   */
  getCorners (): Vector2[] {
    const res: Vector2[] = [];

    this.corners.forEach(corner => {
      res.push(corner.clone());
    });

    return res;
  }

  /**
   * 过去二维包围盒左上角点
   * @returns 二维包围盒左上角点
   */
  getLeftTopCorner (): Vector2 {
    return this.corners[0].clone();
  }

  /**
   * 获取二维包围盒右上角点
   * @returns 二维包围盒右上角点
   */
  getRightTopCorner (): Vector2 {
    return this.corners[1].clone();
  }

  /**
   * 获取二维包围盒右下角点
   * @returns 二维包围盒右下角点
   */
  getRightBottomCorner (): Vector2 {
    return this.corners[2].clone();
  }

  /**
   * 获取二维包围盒左下角点
   * @returns 二维包围盒左下角点
   */
  getLeftBottomCorner (): Vector2 {
    return this.corners[3].clone();
  }

  // type 0 = 'center'
  // type 1 = 'left top'
  // type 2 = 'left center'
  // type 3 = 'left bottom'
  // type 4 = 'middle top'
  // type 5 = 'middle bottom'
  // type 6 = 'right top'
  // type 7 = 'right center'
  // type 8 = 'right bottom'

  /**
   * 通过类型获取二维包围盒指定点
   * @param type - 包围盒顶点顺序
   * @returns 二维包围盒指定点
   */
  getPoint (type: number): Vector2 {
    const size: Vector2 = this.getSize();
    const center: Vector2 = this.getCenter();

    switch (type) {
      case 0: {
        return center;
      }
      case 1: {
        return center.add(size.multiply(-1 / 2));
      }
      case 2: {
        return center.add(new Vector2(-size.x / 2, 0));
      }
      case 3: {
        return center.add(new Vector2(-size.x / 2, size.y / 2));
      }
      case 4: {
        return center.add(new Vector2(0, -size.y / 2));
      }
      case 5: {
        return center.add(new Vector2(0, size.y / 2));
      }
      case 6: {
        return center.add(new Vector2(size.x / 2, -size.y / 2));
      }
      case 7: {
        return center.add(new Vector2(size.x / 2, 0));
      }
      case 8: {
        return center.add(size.multiply(1 / 2));
      }
      default: {
        return center;
      }
    }
  }

  /**
   * 获取二维包围盒中心点
   * @param [target=new Vector2()] - 目标点(用以存放二维包围盒中心点)
   * @returns 二维包围盒中心点
   */
  getCenter (target: Vector2 = new Vector2()): Vector2 {
    return this.isEmpty() ? target.set(0, 0) : target.addVectors(this.min, this.max).multiply(0.5);
  }

  /**
   * 获取二维包围盒大小
   * @param [target=new Vector2()] - 目标向量(用以存放二维包围盒大小)
   * @returns 二维包围盒大小
   */
  getSize (target: Vector2 = new Vector2()): Vector2 {
    return this.isEmpty() ? target.set(0, 0) : target.subtractVectors(this.max, this.min);
  }

  /**
   * 通过二维空间点扩展二维包围盒
   * @param point - 二维空间点
   * @returns 扩展包围盒
   */
  expandByPoint (point: Vector2): this {
    this.min.min(point);
    this.max.max(point);

    return this;
  }

  /**
   * 通过向量扩展二维包围盒
   * @param vector - 二维向量
   * @returns 扩展结果
   */
  expandByVector (vector: Vector2): this {
    this.min.subtract(vector);
    this.max.add(vector);

    return this;
  }

  /**
   * 通过大小扩展二维包围盒
   * @param scalar - 扩展大小
   * @returns 扩展结果
   */
  expandByScalar (scalar: number): this {
    this.min.add(-scalar);
    this.max.add(scalar);

    return this;
  }

  /**
   * 判断二维包围盒是否包含二维空间点
   * @param point 二维空间点
   * @param [isOrthogonal=true] - 包围盒正交判断
   * @returns 点包含判断结果
   */
  containsPoint (point: Vector2, isOrthogonal = true): boolean {
    if (isOrthogonal) {
      return point.x < this.min.x || point.x > this.max.x ||
        point.y < this.min.y || point.y > this.max.y ? false : true;
    } else {
      if (this.isEmpty()) {
        return false;
      }

      for (let i = 0; i < this.corners.length; i++) {
        const corner = this.corners[i];
        const next = this.corners[(i + 1) % 4];
        const edge = new Vector2(next.x - corner.x, next.y - corner.y);
        const vec = new Vector2(point.x - corner.x, point.y - corner.y);

        if (edge.cross(vec) < 0) { return false; }
      }

      return true;
    }
  }

  /**
   * 判断二维包围盒包含关系(if this contains other)
   * @param box - 其它包围盒
   * @returns 二维包围盒包含判断结果
   */
  containsBox (box: Box2): boolean {
    return this.min.x <= box.min.x
      && box.max.x <= this.max.x
      && this.min.y <= box.min.y
      && box.max.y <= this.max.y;
  }

  /**
   * 获取点以包围盒左上角顶点为原点的相对位置
   * @param point - 指定二维空间点
   * @param [target=new Vector2()] - 目标空间点
   * @returns 计算结果空间点
   */
  getParameter (point: Vector2, target: Vector2 = new Vector2()): Vector2 {
    // This can potentially have a divide by zero if the box
    // has a size dimension of 0.
    return target.set(
      (point.x - this.min.x) / (this.max.x - this.min.x),
      (point.y - this.min.y) / (this.max.y - this.min.y),
    );
  }

  /**
   * 判断二维包围盒相交关系(if this intersect other)
   * @param box - 二维包围盒
   * @param [isOrthogonal=true] - 正交判断(当前包围盒)
   * @returns 相交判断结果
   */
  intersectsBox (box: Box2, isOrthogonal = true): boolean {
    // using 4 splitting planes to rule out intersections
    // 基于点判断
    if (isOrthogonal) {
      return !(box.max.x < this.min.x
        || box.min.x > this.max.x
        || box.max.y < this.min.y
        || box.min.y > this.max.y);
    } else {
      if (!this.isEmpty()) {
        for (let i = 0; i < this.corners.length; i++) {
          const line = new Line2(this.corners[i], this.corners[(i + 1) % 4]);

          if (box.containsPoint(this.corners[i], false)) {
            return true;
          }
          for (let j = 0; j < box.corners.length; j++) {
            const boxLine = new Line2(box.corners[j], box.corners[(j + 1) % 4]);

            if (this.containsPoint(box.corners[j], false)) {
              return true;
            }
            if (line.crossWithLine(boxLine)) {
              return true;
            }
          }
        }
      }

      for (let i = 0; i < box.corners.length; i++) {
        const state = this.containsPoint(box.corners[i], false);
        const stateOther = box.containsPoint(this.corners[i], false);

        if (state || stateOther) {
          return true;
        }
      }

      return false;
    }
  }

  /**
   * 求点与二维包围盒的最近点
   * @param point - 二维空间点
   * @param [target=new Vector2()] - 结果点
   * @returns 二维空间点
   */
  clampPoint (point: Vector2, target: Vector2 = new Vector2()): Vector2 {
    return target.copyFrom(point).clamp(this.min, this.max);
  }

  /**
   * 求点到二维包围盒的距离
   * @param point - 二维空间点
   * @returns 距离
   */
  distanceToPoint (point: Vector2): number {
    const clampedPoint = point.clone().clamp(this.min, this.max);

    return clampedPoint.subtract(point).length();
  }

  /**
   * 二维包围盒求交集
   * @param box - 二维包围盒
   * @returns 求交结果
   */
  intersect (box: Box2): this {
    this.min.max(box.min);
    this.max.min(box.max);
    if (this.min.x > this.max.x || this.min.y > this.max.y) {
      return this.makeEmpty();
    }

    return this;
  }

  /**
   * 二维包围盒求并集
   * @param box - 二维包围盒
   * @returns 求并结果
   */
  union (box: Box2): this {
    this.min.min(box.min);
    this.max.max(box.max);

    this.corners = [
      this.min.clone(),
      new Vector2(this.max.x, this.min.y),
      this.max.clone(),
      new Vector2(this.min.x, this.max.y),
    ];

    return this;
  }

  /**
   * 二维包围盒位移
   * @param offset - 位移向量
   * @returns 位移结果
   */
  translate (offset: Vector2): this {
    this.min.add(offset);
    this.max.add(offset);

    this.corners.forEach(corner => {
      corner.add(offset);
    });

    return this;
  }

  /**
   * 二维包围盒判等
   * @param box - 二维包围盒
   * @returns 判等结果
   */
  equals (box: Box2): boolean {
    return box.min.equals(this.min) && box.max.equals(this.max);
  }
}
