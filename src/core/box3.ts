import type { Matrix4 } from './matrix4';
import type { Sphere } from './sphere';
import { Vector3 } from './vector3';

/**
 * 三维包围盒
 */
export class Box3 {
  min: Vector3;
  max: Vector3;

  /**
   * 构造函数，传入值为空时表示空包围盒
   * @param [min=new Vector3(Infinity)] - 最小角点
   * @param [max=new Vector3(-Infinity)] - 最大角点
   */
  constructor (
    min = new Vector3(Infinity, Infinity, Infinity),
    max = new Vector3(-Infinity, -Infinity, -Infinity),
  ) {
    this.min = min.clone();
    this.max = max.clone();
  }

  /**
   * 设置三维包围盒的值
   * @param min - 三维包围盒最小点
   * @param max - 三维包围盒最大点
   * @returns
   */
  set (min: Vector3, max: Vector3): this {
    this.min.copyFrom(min);
    this.max.copyFrom(max);

    return this;
  }

  /**
   * 通过数组构建三维包围盒
   * @param array - 数组集合（每三个数视为一个三维空间点）
   * @returns 三维包围盒
   */
  setFromArray (array: number[]): this {
    let minX = Number(Infinity);
    let minY = Number(Infinity);
    let minZ = Number(Infinity);

    let maxX = -Infinity;
    let maxY = -Infinity;
    let maxZ = -Infinity;

    for (let i = 0, l = array.length; i < l; i += 3) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];

      if (x < minX) { minX = x; }
      if (y < minY) { minY = y; }
      if (z < minZ) { minZ = z; }

      if (x > maxX) { maxX = x; }
      if (y > maxY) { maxY = y; }
      if (z > maxZ) { maxZ = z; }
    }

    this.min.set(minX, minY, minZ);
    this.max.set(maxX, maxY, maxZ);

    return this;
  }

  /**
   * 通过三维空间点构建三维包围盒
   * @param points - 三维空间点集合
   * @returns 三维包围盒
   */
  setFromPoints (points: Vector3[]): this {
    this.makeEmpty();

    for (let i = 0, il = points.length; i < il; i++) {
      this.expandByPoint(points[i]);
    }

    return this;
  }

  /**
   * 通过三维空间点（包围盒中心）和大小确定包围盒
   * @param center - 三维包围盒中心点
   * @param size - 三维包围盒大小值
   * @returns 三维包围盒
   */
  setFromCenterAndSize (center: Vector3, size: Vector3): this {
    const halfSize = size.clone().multiply(0.5);

    this.min.copyFrom(center).subtract(halfSize);
    this.max.copyFrom(center).add(halfSize);

    return this;
  }

  // TODO
  /**
   * 通过实体构建包围盒
   * @param object - 构件实体
   * @returns 三维包围盒
   */
  setFromObject (object: any) {
    this.makeEmpty();

    return this.expandByObject(object);
  }

  /**
   * 克隆三维包围盒
   * @returns 克隆结果
   */
  clone (): Box3 {
    return new Box3().copyFrom(this);
  }

  /**
   * 复制三维包围盒
   * @param box - 复制对象
   * @returns 复制结果
   */
  copyFrom (box: Box3): this {
    this.min.copyFrom(box.min);
    this.max.copyFrom(box.max);

    return this;
  }

  /**
   * 三维包围盒置空
   * @returns 置空结果
   */
  makeEmpty (): this {
    this.min.x = this.min.y = this.min.z = Number(Infinity);
    this.max.x = this.max.y = this.max.z = -Infinity;

    return this;
  }

  /**
   * 三维包围盒判空
   * @returns 判空结果
   */
  isEmpty (): boolean {
    // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
    return this.max.x < this.min.x
      || this.max.y < this.min.y
      || this.max.z < this.min.z;
  }

  /**
   * 获取三维包围盒中心
   * @param [target=new Vector3()]
   * @returns
   */
  getCenter (target: Vector3 = new Vector3()): Vector3 {
    return this.isEmpty() ? target.set(0, 0, 0) : target.addVectors(this.min, this.max).multiply(0.5);
  }

  /**
   * 获取三维包围盒大小
   * @param [target=new Vector3()] - 结果保存对象
   * @returns 三维包围盒大小
   */
  getSize (target: Vector3 = new Vector3()): Vector3 {
    return this.isEmpty() ? target.set(0, 0, 0) : target.subtractVectors(this.max, this.min);
  }

  /**
   * 通过三维空间点扩展三维包围盒
   * @param point - 三维空间点
   * @returns 扩展结果
   */
  expandByPoint (point: Vector3): this {
    this.min.min(point);
    this.max.max(point);

    return this;
  }

  /**
   * 通过三维向量扩展三维包围盒
   * @param vector - 三维向量
   * @returns 扩展结果
   */
  expandByVector (vector: Vector3): this {
    this.min.subtract(vector);
    this.max.add(vector);

    return this;
  }

  /**
   * 通过实数扩展三维包围盒
   * @param scalar - 扩展大小
   * @returns 扩展结果
   */
  expandByScalar (scalar: number): this {
    this.min.add(-scalar);
    this.max.add(scalar);

    return this;
  }

  /**
   * 通过包围盒扩展三维包围盒
   * @param box
   * @returns
   */
  expandByBox (box: Box3): this {
    this.min.min(box.min);
    this.max.max(box.max);

    return this;
  }

  // TODO
  /**
   * 通过实体扩展三维包围盒
   * @param object - 构件实体
   * @returns 扩展结果
   */
  expandByObject (object: any): this {
    // Computes the world-axis-aligned bounding box of an object (including its children),
    // accounting for both the object's, and children's, world transforms
    object.updateWorldMatrix(false, false);

    const geometry = object.geometry;

    if (geometry !== undefined) {
      if (geometry.boundingBox === null) {
        geometry.computeBoundingBox();
      }

      const box3 = new Box3();

      box3.copyFrom(geometry.boundingBox as Box3);
      box3.applyMatrix4(object.matrixWorld as Matrix4);

      this.union(box3);
    }

    const children = object.children;

    for (let i = 0, l = children.length; i < l; i++) {
      this.expandByObject(children[i]);
    }

    return this;
  }

  /**
   * 判断三维包围盒相交关系(if this intersect other)
   * @param point - 三维空间点
   * @returns 点包含判断结果
   */
  containsPoint (point: Vector3): boolean {
    return !(point.x < this.min.x
      || point.x > this.max.x
      || point.y < this.min.y
      || point.y > this.max.y
      || point.z < this.min.z
      || point.z > this.max.z);
  }

  /**
   * 判断三维包围盒与三维包围盒的包含关系
   * @param other - 三维包围盒
   * @returns 包围盒包含结果（true 表示包含 other, false 表示不包含 other）
   */
  containsBox (other: Box3): boolean {
    return this.min.x <= other.min.x
      && this.max.x >= other.max.x
      && this.min.y <= other.min.y
      && this.max.y >= other.max.y
      && this.min.z <= other.min.z
      && this.max.z >= other.max.z;
  }

  // TODO
  /**
   * 获取点在三维包围盒的比例位置
   * @param point - 三维空间点
   * @param [target=new Vector3()] - 结果保存对象
   * @returns 点在包围盒比例位置
   */
  getParameter (point: Vector3, target: Vector3 = new Vector3()): Vector3 {
    // This can potentially have a divide by zero if the box
    // has a size dimension of 0.
    return target.set(
      (point.x - this.min.x) / (this.max.x - this.min.x),
      (point.y - this.min.y) / (this.max.y - this.min.y),
      (point.z - this.min.z) / (this.max.z - this.min.z)
    );
  }

  /**
   * 判断三维包围盒相交关系(if this intersect other)
   * @param other - 三维包围盒
   * @returns 相交判断结果
   */
  intersectsBox (other: Box3): boolean {
    // using 6 splitting planes to rule out intersections.
    return !(other.max.x < this.min.x || other.min.x > this.max.x
      || other.max.y < this.min.y || other.min.y > this.max.y
      || other.max.z < this.min.z || other.min.z > this.max.z);
  }

  /**
   * 判断三维包围盒和球是否相交
   * @param sphere
   * @returns
   */
  intersectsSphere (sphere: Sphere) {
    // Find the point on the AABB closest to the sphere center.
    const vector = new Vector3();

    this.clampPoint(sphere.center, vector);

    // If that point is inside the sphere, the AABB and sphere intersect.
    return vector.distanceSquared(sphere.center) <= (sphere.radius * sphere.radius);
  }

  /**
   * 求点与三维包围盒的最近点
   * @param point - 三维空间点
   * @param [target=new Vector3()] - 结果存放对象
   * @returns 计算结果
   */
  clampPoint (point: Vector3, target: Vector3 = new Vector3()): Vector3 {
    return target.copyFrom(point).clamp(this.min, this.max);
  }

  /**
   * 三维空间点到三维包围盒的距离
   * @param point - 三维包围盒
   * @returns 距离结果
   */
  distanceToPoint (point: Vector3): number {
    const clampedPoint = point.clone().clamp(this.min, this.max);

    return clampedPoint.subtract(point).length();
  }

  /**
   * 三维包围盒求交集
   * @param box - 三维包围盒
   * @returns 求交结果
   */
  intersect (box: Box3): this {
    this.min.max(box.min);
    this.max.min(box.max);

    // ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
    if (this.isEmpty()) { this.makeEmpty(); }

    return this;
  }

  /**
   * 三维包围盒求并集
   * @param box - 三维包围盒
   * @returns 求并结果
   */
  union (box: Box3): this {
    this.min.min(box.min);
    this.max.max(box.max);

    return this;
  }

  /**
   * 通过三维变换矩阵变化三维包围盒
   * @param matrix - 三维变换矩阵
   * @returns 变换结果
   */
  applyMatrix4 (matrix: Matrix4, center = new Vector3()): this {
    // transform of empty box is an empty box.
    if (this.isEmpty()) { return this; }

    const points = this.getOBBPoints(matrix, center);

    this.setFromPoints(points);

    return this;
  }

  getOBBPoints (matrix: Matrix4, center = new Vector3()): Vector3[] {
    // transform of empty box is an empty box.
    if (this.isEmpty()) { return []; }

    const points: Vector3[] = [];

    // NOTE: I am using a binary pattern to specify all 2^3 combinations below
    points[0] = new Vector3(this.min.x, this.min.y, this.min.z); // 000
    points[1] = new Vector3(this.min.x, this.min.y, this.max.z); // 001
    points[2] = new Vector3(this.min.x, this.max.y, this.min.z); // 010
    points[3] = new Vector3(this.min.x, this.max.y, this.max.z); // 011
    points[4] = new Vector3(this.max.x, this.min.y, this.min.z); // 100
    points[5] = new Vector3(this.max.x, this.min.y, this.max.z); // 101
    points[6] = new Vector3(this.max.x, this.max.y, this.min.z); // 110
    points[7] = new Vector3(this.max.x, this.max.y, this.max.z); // 111
    points.forEach(p => {
      p.subtract(center);
      p.applyMatrix(matrix);
      p.add(center);
    });

    return points;
  }

  /**
   * 通过包围盒获取包围球
   * @param target
   * @returns
   */
  getBoundingSphere (target: Sphere) {
    this.getCenter(target.center);

    const vector = new Vector3();

    target.radius = this.getSize(vector).length() * 0.5;

    return target;
  }

  /**
   * 三维包围盒位移
   * @param offset - 三维位移向量
   * @returns 位移结果
   */
  translate (offset: Vector3): this {
    this.min.add(offset);
    this.max.add(offset);

    return this;
  }

  /**
   * 三维包围盒判等
   * @param other - 三维包围盒
   * @returns 判等结果
   */
  equals (other: Box3): boolean {
    return other.min.equals(this.min) && other.max.equals(this.max);
  }
}
