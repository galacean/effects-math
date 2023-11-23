import { Vector3 } from '../core/vector3';

/**
 *
 */
export class Plane {
  distance: number;
  normal: Vector3;

  constructor (
    distance = 0,
    normal = Vector3.Z,
  ) {
    this.distance = distance;
    this.normal = normal.clone();
    this.set(distance, normal);
  }

  set (distance: number, normal: Vector3): Plane {
    this.normal.copyFrom(normal);

    const length = this.normal.length();

    if (length === 0) {
      this.normal.set(0, 0, 1);
    }

    this.distance = distance / length;
    this.normal.normalize();

    return this;
  }

  copyFrom (target: Plane): Plane {
    this.distance = target.distance;
    this.normal.copyFrom(target.normal);

    return this;
  }

  static setFromNormalAndCoplanarPoint (point: Vector3, normal: Vector3) {
    const distance = - point.dot(normal);
    const plane = new Plane(distance, normal);

    return plane;
  }

  setFromNormalAndCoplanarPoint (point: Vector3, normal: Vector3) {
    this.normal.copyFrom(normal);
    this.distance = - point.dot(this.normal);

    return this;
  }

  clone (): Plane {
    const plane = new Plane(this.distance, this.normal.clone());

    return plane;
  }

  distanceToPoint (point: Vector3): number {
    return this.normal.dot(point) + this.distance;
  }
}
