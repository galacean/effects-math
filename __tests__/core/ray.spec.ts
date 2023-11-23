import { Ray, Box3, Vector3, Sphere, Matrix4 } from '@galacean/effects-math';

const eps = 0.0001;
const zero3 = new Vector3();
const one3 = new Vector3(1, 1, 1);
const two3 = new Vector3(2, 2, 2);
const posInf3 = new Vector3(Infinity, Infinity, Infinity);

describe('Maths', () => {
  describe('Ray', () => {
    // INSTANCING
    it('Instancing', () => {
      let a = new Ray();

      expect(a.origin.equals(zero3)).toEqual(true);
      expect(a.direction.equals(new Vector3(1, 0, 0))).toEqual(true);

      a = new Ray(two3.clone(), one3.clone());
      expect(a.origin.equals(two3)).toEqual(true);
      expect(a.direction.equals(one3.clone().normalize())).toEqual(true);
    });

    // PUBLIC
    it('set', () => {
      const a = new Ray();

      a.set(one3, one3);
      expect(a.origin.equals(one3)).toEqual(true);
      expect(a.direction.equals(one3.clone().normalize())).toEqual(true);
    });

    it('recast/clone', () => {
      const a = new Ray(one3.clone(), new Vector3(0, 0, 1));

      expect(a.recast(0).equals(a)).toEqual(true);

      const b = a.clone();

      expect(b.recast(- 1).equals(new Ray(new Vector3(1, 1, 0), new Vector3(0, 0, 1)))).toEqual(true);

      const c = a.clone();

      expect(c.recast(1).equals(new Ray(new Vector3(1, 1, 2), new Vector3(0, 0, 1)))).toEqual(true);

      const d = a.clone();
      const e = d.clone().recast(1);

      expect(d.equals(a)).toEqual(true);
      expect(!e.equals(d)).toEqual(true);
      expect(e.equals(c)).toEqual(true);
    });

    it('copy/equals', () => {
      const a = new Ray(zero3.clone(), one3.clone());
      const b = new Ray().copyFrom(a);

      expect(b.origin.equals(zero3)).toEqual(true);
      expect(b.direction.equals(one3.clone().normalize())).toEqual(true);

      // ensure that it is a true copy
      a.origin = zero3;
      a.direction = one3;
      expect(b.origin.equals(zero3)).toEqual(true);
      expect(b.direction.equals(one3.clone().normalize())).toEqual(true);
    });

    it('at', () => {
      const a = new Ray(one3.clone(), new Vector3(0, 0, 1));
      const point = new Vector3();

      a.at(0, point);
      expect(point.equals(one3)).toEqual(true);
      a.at(- 1, point);
      expect(point.equals(new Vector3(1, 1, 0))).toEqual(true);
      a.at(1, point);
      expect(point.equals(new Vector3(1, 1, 2))).toEqual(true);
    });

    it('intersectSphere', () => {
      const TOL = 0.0001;
      const point = new Vector3();

      // ray a0 origin located at ( 0, 0, 0 ) and points outward in negative-z direction
      const a0 = new Ray(zero3.clone(), new Vector3(0, 0, - 1));
      // ray a1 origin located at ( 1, 1, 1 ) and points left in negative-x direction
      const a1 = new Ray(one3.clone(), new Vector3(- 1, 0, 0));

      // sphere (radius of 2) located behind ray a0, should result in null
      let b = new Sphere(new Vector3(0, 0, 3), 2);

      a0.intersectSphere(b, point.copyFrom(posInf3));
      expect(point.equals(posInf3)).toEqual(true);

      // sphere (radius of 2) located in front of, but too far right of ray a0, should result in null
      b = new Sphere(new Vector3(3, 0, - 1), 2);
      a0.intersectSphere(b, point.copyFrom(posInf3));
      expect(point.equals(posInf3)).toEqual(true);

      // sphere (radius of 2) located below ray a1, should result in null
      b = new Sphere(new Vector3(1, - 2, 1), 2);
      a1.intersectSphere(b, point.copyFrom(posInf3));
      expect(point.equals(posInf3)).toEqual(true);

      // sphere (radius of 1) located to the left of ray a1, should result in intersection at 0, 1, 1
      b = new Sphere(new Vector3(- 1, 1, 1), 1);
      a1.intersectSphere(b, point);
      expect(point.distance(new Vector3(0, 1, 1)) < TOL).toEqual(true);

      // sphere (radius of 1) located in front of ray a0, should result in intersection at 0, 0, -1
      b = new Sphere(new Vector3(0, 0, - 2), 1);
      a0.intersectSphere(b, point);
      expect(point.distance(new Vector3(0, 0, - 1)) < TOL).toEqual(true);

      // sphere (radius of 2) located in front & right of ray a0, should result in intersection at 0, 0, -1, or left-most edge of sphere
      b = new Sphere(new Vector3(2, 0, - 1), 2);
      a0.intersectSphere(b, point);
      expect(point.distance(new Vector3(0, 0, - 1)) < TOL).toEqual(true);

      // same situation as above, but move the sphere a fraction more to the right, and ray a0 should now just miss
      b = new Sphere(new Vector3(2.01, 0, - 1), 2);
      a0.intersectSphere(b, point.copyFrom(posInf3));
      expect(point.equals(posInf3)).toEqual(true);

      // following QUnit.tests are for situations where the ray origin is inside the sphere

      // sphere (radius of 1) center located at ray a0 origin / sphere surrounds the ray origin, so the first intersect point 0, 0, 1,
      // is behind ray a0.  Therefore, second exit point on back of sphere will be returned: 0, 0, -1
      // thus keeping the intersection point always in front of the ray.
      b = new Sphere(zero3.clone(), 1);
      a0.intersectSphere(b, point);
      expect(point.distance(new Vector3(0, 0, - 1)) < TOL).toEqual(true);

      // sphere (radius of 4) center located behind ray a0 origin / sphere surrounds the ray origin, so the first intersect point 0, 0, 5,
      // is behind ray a0.  Therefore, second exit point on back of sphere will be returned: 0, 0, -3
      // thus keeping the intersection point always in front of the ray.
      b = new Sphere(new Vector3(0, 0, 1), 4);
      a0.intersectSphere(b, point);
      expect(point.distance(new Vector3(0, 0, - 3)) < TOL).toEqual(true);

      // sphere (radius of 4) center located in front of ray a0 origin / sphere surrounds the ray origin, so the first intersect point 0, 0, 3,
      // is behind ray a0.  Therefore, second exit point on back of sphere will be returned: 0, 0, -5
      // thus keeping the intersection point always in front of the ray.
      b = new Sphere(new Vector3(0, 0, - 1), 4);
      a0.intersectSphere(b, point);
      expect(point.distance(new Vector3(0, 0, - 5)) < TOL).toEqual(true);
    });

    it('intersectsSphere', () => {
      const a = new Ray(one3.clone(), new Vector3(0, 0, 1));
      const b = new Sphere(zero3, 0.5);
      const c = new Sphere(zero3, 1.5);
      const d = new Sphere(one3, 0.1);
      const e = new Sphere(two3, 0.1);
      const f = new Sphere(two3, 1);

      expect(a.intersectSphere(b, new Vector3())).toEqual(undefined);
      expect(a.intersectSphere(c, new Vector3())).toEqual(undefined);
      expect(a.intersectSphere(d, new Vector3())).not.toEqual(undefined);
      expect(a.intersectSphere(e, new Vector3())).toEqual(undefined);
      expect(a.intersectSphere(f, new Vector3())).toEqual(undefined);
    });

    it('intersectBox', () => {
      const TOL = 0.0001;
      const box = new Box3(new Vector3(- 1, - 1, - 1), new Vector3(1, 1, 1));
      const point = new Vector3();
      const a = new Ray(new Vector3(- 2, 0, 0), new Vector3(1, 0, 0));

      //ray should intersect box at -1,0,0
      expect(a.intersectBox(box, new Vector3())).not.toEqual(undefined);
      a.intersectBox(box, point);
      expect(point.distance(new Vector3(- 1, 0, 0)) < TOL).toEqual(true);

      const b = new Ray(new Vector3(- 2, 0, 0), new Vector3(- 1, 0, 0));

      //ray is point away from box, it should not intersect
      expect(b.intersectBox(box, new Vector3())).toEqual(undefined);
      b.intersectBox(box, point.copyFrom(posInf3));
      expect(point.equals(posInf3)).toEqual(true);

      const c = new Ray(new Vector3(0, 0, 0), new Vector3(1, 0, 0));

      // ray is inside box, should return exit point
      expect(c.intersectBox(box, new Vector3())).not.toEqual(undefined);
      c.intersectBox(box, point);
      expect(point.distance(new Vector3(1, 0, 0)) < TOL).toEqual(true);

      const d = new Ray(new Vector3(0, 2, 1), new Vector3(0, - 1, - 1).normalize());

      //tilted ray should intersect box at 0,1,0
      expect(d.intersectBox(box, new Vector3())).not.toEqual(undefined);
      d.intersectBox(box, point);
      expect(point.distance(new Vector3(0, 1, 0)) < TOL).toEqual(true);

      const e = new Ray(new Vector3(1, - 2, 1), new Vector3(0, 1, 0).normalize());

      //handle case where ray is coplanar with one of the boxes side - box in front of ray
      expect(e.intersectBox(box, new Vector3())).not.toEqual(undefined);
      e.intersectBox(box, point);
      expect(point.distance(new Vector3(1, - 1, 1)) < TOL).toEqual(true);

      const f = new Ray(new Vector3(1, - 2, 0), new Vector3(0, - 1, 0).normalize());

      //handle case where ray is coplanar with one of the boxes side - box behind ray
      expect(f.intersectBox(box, new Vector3())).toEqual(undefined);
      f.intersectBox(box, point.copyFrom(posInf3));
      expect(point.equals(posInf3)).toEqual(true);
    });

    it('intersectTriangle', () => {
      const ray = new Ray();
      const a = new Vector3(1, 1, 0);
      const b = new Vector3(0, 1, 1);
      const c = new Vector3(1, 0, 1);
      const point = new Vector3();

      // DdN ).toEqual( 0
      const triangle0 = {
        p0: a,
        p1: b,
        p2: c,
      };

      ray.set(ray.origin, zero3.clone());
      ray.intersectTriangle(triangle0, point.copyFrom(posInf3), false);
      expect(point.equals(posInf3)).toEqual(true);

      // DdN > 0, backfaceCulling = true
      ray.set(ray.origin, one3.clone());
      ray.intersectTriangle(triangle0, point.copyFrom(posInf3), true);
      expect(point.equals(posInf3)).toEqual(true);

      // DdN > 0
      ray.set(ray.origin, one3.clone());
      ray.intersectTriangle(triangle0, point, false);
      expect(Math.abs(point.x - 2 / 3) <= eps).toEqual(true);
      expect(Math.abs(point.y - 2 / 3) <= eps).toEqual(true);
      expect(Math.abs(point.z - 2 / 3) <= eps).toEqual(true);

      // DdN > 0, DdQxE2 < 0
      b.multiply(- 1);
      ray.intersectTriangle(triangle0, point.copyFrom(posInf3), false);
      expect(point.equals(posInf3)).toEqual(true);

      // DdN > 0, DdE1xQ < 0
      a.multiply(- 1);
      ray.intersectTriangle(triangle0, point.copyFrom(posInf3), false);
      expect(point.equals(posInf3)).toEqual(true);

      // DdN > 0, DdQxE2 + DdE1xQ > DdN
      b.multiply(- 1);
      ray.intersectTriangle(triangle0, point.copyFrom(posInf3), false);
      expect(point.equals(posInf3)).toEqual(true);

      // DdN < 0, QdN < 0
      a.multiply(- 1);
      b.multiply(- 1);
      ray.direction.multiply(- 1);
      ray.intersectTriangle(triangle0, point.copyFrom(posInf3), false);
      expect(point.equals(posInf3)).toEqual(true);
    });

    it('applyMatrix4', () => {
      let a = new Ray(one3.clone(), new Vector3(0, 0, 1));
      const m = new Matrix4();

      expect(a.clone().applyMatrix(m).equals(a)).toEqual(true);

      a = new Ray(zero3.clone(), new Vector3(0, 0, 1));
      m.setFromRotationZ(Math.PI);
      expect(a.clone().applyMatrix(m).equals(a)).toEqual(true);

      m.setFromRotationX(Math.PI);
      const b = a.clone();

      b.direction.negate();
      let a2 = a.clone().applyMatrix(m);

      expect(a2.origin.distance(b.origin) < 0.0001).toEqual(true);
      expect(a2.direction.distance(b.direction) < 0.0001).toEqual(true);

      a.origin = new Vector3(0, 0, 1);
      b.origin = new Vector3(0, 0, - 1);
      a2 = a.clone().applyMatrix(m);
      expect(a2.origin.distance(b.origin) < 0.0001).toEqual(true);
      expect(a2.direction.distance(b.direction) < 0.0001).toEqual(true);
    });
  });
});
