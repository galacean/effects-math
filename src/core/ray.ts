import type { Matrix4 } from './matrix4';
import type { Box3Like, PlaneLike, SphereLike, TriangleLike } from './type';
import { Vector3 } from './vector3';

/**
 * 光线类
 */
export class Ray {
  private static readonly tempVec0: Vector3 = new Vector3();
  private static readonly tempVec1: Vector3 = new Vector3();
  private static readonly tempVec2: Vector3 = new Vector3();
  private static readonly tempVec3: Vector3 = new Vector3();

  /**
   * 光线的原点
   */
  origin = new Vector3();
  /**
   * 光线的方向
   */
  direction = new Vector3();

  /**
   * 构造函数
   * @param [origin] - 原点，默认是 (0, 0, 0)
   * @param [direction] - 方向，默认是 (1, 0, 0)
   */
  constructor (origin = Vector3.ZERO, direction = Vector3.X) {
    // 注意这里必须拷贝
    this.origin.copyFrom(origin);
    this.direction.copyFrom(direction).normalize();
  }

  /**
   * 光线设置
   * @param origin - 原点
   * @param direction - 方向
   * @returns
   */
  set (origin: Vector3, direction: Vector3): this {
    this.origin.copyFrom(origin);
    this.direction.copyFrom(direction).normalize();

    return this;
  }

  /**
   * 光线克隆
   * @returns 克隆结果
   */
  clone (): Ray {
    return new Ray(this.origin, this.direction);
  }

  /**
   * 光线拷贝
   * @param ray - 要拷贝对象
   * @returns 拷贝结果
   */
  copyFrom (ray: Ray): this {
    return this.set(ray.origin, ray.direction);
  }

  /**
   * 根据t计算新的光线原点
   * @param t - 光线的系数 t
   * @returns
   */
  recast (t: number): this {
    this.origin.copyFrom(this.at(t, Ray.tempVec0));

    return this;
  }

  /**
   * 根据t值计算光线上的点
   * @param t - 光线的系数 t
   * @param [out] - 计算的点
   * @returns
   */
  at (t: number, out?: Vector3): Vector3 {
    const ret = out ? out : new Vector3();

    ret.copyFrom(this.origin);

    return ret.addScaledVector(this.direction, t);
  }

  /**
   * 光线相等判断
   * @param other - 其他对象
   * @returns
   */
  equals (other: Ray): boolean {
    return this.origin.equals(other.origin) && this.direction.equals(other.direction);
  }

  /**
   * 根据矩阵对光线进行变换
   * @param m - 变换矩阵
   * @returns
   */
  applyMatrix (m: Matrix4): this {
    this.origin.applyProjectionMatrix(m);
    this.direction.applyNormalMatrix(m);

    return this;
  }

  /**
   * 光线和包围盒求交
   * @param box - 类包围盒对象
   * @param [out] - 交点
   * @returns
   */
  intersectBox (box: Box3Like, out?: Vector3): Vector3 | undefined {
    const { x: ox, y: oy, z: oz } = this.origin;
    const { x: dx, y: dy, z: dz } = this.direction;
    const { x: bxmin, y: bymin, z: bzmin } = box.min;
    const { x: bxmax, y: bymax, z: bzmax } = box.max;
    let tmin, tmax, tymin, tymax, tzmin, tzmax;
    const invdirx = 1 / dx;
    const invdiry = 1 / dy;
    const invdirz = 1 / dz;

    if (invdirx >= 0) {
      tmin = (bxmin - ox) * invdirx;
      tmax = (bxmax - ox) * invdirx;
    } else {
      tmin = (bxmax - ox) * invdirx;
      tmax = (bxmin - ox) * invdirx;
    }
    if (invdiry >= 0) {
      tymin = (bymin - oy) * invdiry;
      tymax = (bymax - oy) * invdiry;
    } else {
      tymin = (bymax - oy) * invdiry;
      tymax = (bymin - oy) * invdiry;
    }
    if ((tmin > tymax) || (tymin > tmax)) {
      return;
    }
    if (tymin > tmin || tmin !== tmin) {
      tmin = tymin;
    }
    if (tymax < tmax || tmax !== tmax) {
      tmax = tymax;
    }
    if (tymin > tmin || tmin !== tmin) {
      tmin = tymin;
    }
    if (tymax < tmax || tmax !== tmax) {
      tmax = tymax;
    }
    if (invdirz >= 0) {
      tzmin = (bzmin - oz) * invdirz;
      tzmax = (bzmax - oz) * invdirz;
    } else {
      tzmin = (bzmax - oz) * invdirz;
      tzmax = (bzmin - oz) * invdirz;
    }
    if ((tmin > tzmax) || (tzmin > tmax)) {
      return;
    }
    if (tzmin > tmin || tmin !== tmin) {
      tmin = tzmin;
    }
    if (tzmax < tmax || tmax !== tmax) {
      tmax = tzmax;
    }
    if (tmax < 0) {
      return;
    }

    return tmin >= 0 ? this.at(tmin, out) : this.at(tmax, out);
  }

  /**
   * 光线和平面求交
   * @param plane - 类平面对象
   * @param [out] - 交点
   * @returns
   */
  intersectPlane (plane: PlaneLike, out?: Vector3): Vector3 | undefined {
    const normal = plane.normal as Vector3;
    const distance = plane.distance;
    const denominator = normal.dot(this.direction);

    if (denominator === 0) {

      // line is coplanar, return origin
      const t = normal.dot(this.origin) + distance;

      if (t === 0) {
        const ret = out ? out : new Vector3();

        return ret.copyFrom(this.origin);
      }

      // Null is preferable to undefined since undefined means.... it is undefined
      return;

    }

    const t = - (this.origin.dot(normal) + distance) / denominator;

    // Return if the ray never intersects the plane

    return t >= 0 ? this.at(t, out) : undefined;
  }

  /**
   * 光线和圆求交
   * @param sphere - 类球对象
   * @param [out] - 交点
   * @returns
   */
  intersectSphere (sphere: SphereLike, out?: Vector3): Vector3 | undefined {
    const center = sphere.center as Vector3;
    const vector = Ray.tempVec0.subtractVectors(center, this.origin);
    const tca = vector.dot(this.direction);
    const d2 = vector.dot(vector) - tca * tca;
    const radius2 = sphere.radius * sphere.radius;

    if (d2 > radius2) {
      return;
    }

    const thc = Math.sqrt(radius2 - d2);

    // t0 = first intersect point - entrance on front of sphere
    const t0 = tca - thc;

    // t1 = second intersect point - exit point on back of sphere
    const t1 = tca + thc;

    // test to see if t1 is behind the ray - if so, return null
    if (t1 < 0) {
      return;
    }

    // test to see if t0 is behind the ray:
    // if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
    // in order to always return an intersect point that is in front of the ray.
    // else t0 is in front of the ray, so return the first collision point scaled by t0
    return t0 >= 0 ? this.at(t0, out) : this.at(t1, out);
  }

  /**
   * 光线和三角形求交
   * @param triangle - 类三角形对象
   * @param [out] - 交点
   * @param [backfaceCulling] - 是否背面剔除
   * @returns
   */
  intersectTriangle (triangle: TriangleLike, out?: Vector3, backfaceCulling?: boolean): Vector3 | undefined {
    // FIXME: 交换out和backfaceCulling
    // Compute the offset origin, edges, and normal.

    // from https://github.com/pmjoniak/GeometricTools/blob/master/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h
    const a = triangle.p0 as Vector3;
    const b = triangle.p1 as Vector3;
    const c = triangle.p2 as Vector3;
    const edge1 = Ray.tempVec0.subtractVectors(b, a);
    const edge2 = Ray.tempVec1.subtractVectors(c, a);
    const diff = Ray.tempVec2.subtractVectors(this.origin, a);
    const normal = Ray.tempVec3.crossVectors(edge1, edge2);

    // Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
    // E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
    //   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
    //   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
    //   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
    let DdN = this.direction.dot(normal);
    let sign;

    if (DdN > 0) {
      if (backfaceCulling) {
        return;
      }
      sign = 1;
    } else if (DdN < 0) {
      sign = - 1;
      DdN = - DdN;
    } else {
      return;
    }
    edge2.crossVectors(diff, edge2);
    const DdQxE2 = sign * this.direction.dot(edge2);

    // b1 < 0, no intersection
    if (DdQxE2 < 0) {
      return;
    }

    edge1.cross(diff);
    const DdE1xQ = sign * this.direction.dot(edge1);

    // b2 < 0, no intersection
    if (DdE1xQ < 0) {
      return;
    }

    // b1+b2 > 1, no intersection
    if (DdQxE2 + DdE1xQ > DdN) {
      return;
    }

    // Line intersects triangle, check if ray does.
    const QdN = - sign * diff.dot(normal);

    // t < 0, no intersection
    if (QdN < 0) {
      return;
    }

    // Ray intersects triangle.
    return this.at(QdN / DdN, out);
  }
}
