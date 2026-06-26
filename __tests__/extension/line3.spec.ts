import { Line3, Vector3 } from '@galacean/effects-math';

describe('Maths', () => {
  describe('Line3', () => {
    it('Instancing', () => {
      const line = new Line3(new Vector3(0, 0, 0), new Vector3(1, 0, 0));

      expect(line.start.x).toEqual(0);
      expect(line.start.y).toEqual(0);
      expect(line.start.z).toEqual(0);
      expect(line.end.x).toEqual(1);
      expect(line.end.y).toEqual(0);
      expect(line.end.z).toEqual(0);
    });

    it('delta', () => {
      const line = new Line3(new Vector3(1, 2, 3), new Vector3(4, 5, 6));
      const d = line.delta();

      expect(d.x).toBeCloseTo(3, 5);
      expect(d.y).toBeCloseTo(3, 5);
      expect(d.z).toBeCloseTo(3, 5);

      // 带 target 参数
      const target = new Vector3();
      const d2 = line.delta(target);

      expect(d2.x).toBeCloseTo(3, 5);
      expect(d2.y).toBeCloseTo(3, 5);
      expect(d2.z).toBeCloseTo(3, 5);
      expect(d2).toBe(target);  // 应返回同一个 target 对象
    });

    it('closestPointToPointParameter', () => {
      const line = new Line3(new Vector3(0, 0, 0), new Vector3(10, 0, 0));

      // 点在线段起点上 → t = 0
      const t0 = line.closestPointToPointParameter(new Vector3(0, 0, 0), true);

      expect(t0).toBeCloseTo(0, 5);

      // 点在线段终点上 → t = 1
      const t1 = line.closestPointToPointParameter(new Vector3(10, 0, 0), true);

      expect(t1).toBeCloseTo(1, 5);

      // 点在线段中点 → t = 0.5
      const t05 = line.closestPointToPointParameter(new Vector3(5, 0, 0), true);

      expect(t05).toBeCloseTo(0.5, 5);

      // 点在起点左侧 → clampToLine=true 时 t = 0
      const tClamped = line.closestPointToPointParameter(new Vector3(-3, 0, 0), true);

      expect(tClamped).toBeCloseTo(0, 5);

      // 点在起点左侧 → clampToLine=false 时 t < 0
      const tUnclamped = line.closestPointToPointParameter(new Vector3(-3, 0, 0), false);

      expect(tUnclamped).toBeCloseTo(-0.3, 5);

      // 点在线段上方 → 最近点在线段上 t = 0.5
      const tAbove = line.closestPointToPointParameter(new Vector3(5, 10, 0), true);

      expect(tAbove).toBeCloseTo(0.5, 5);
    });

    it('closestPointToPoint', () => {
      const line = new Line3(new Vector3(0, 0, 0), new Vector3(10, 0, 0));

      // 点在线段上 → 最近点是该点本身
      const p0 = line.closestPointToPoint(new Vector3(5, 0, 0), true);

      expect(p0.x).toBeCloseTo(5, 5);
      expect(p0.y).toBeCloseTo(0, 5);
      expect(p0.z).toBeCloseTo(0, 5);

      // 点在线段起点左侧 → clamp=true 时最近点是起点
      const p1 = line.closestPointToPoint(new Vector3(-3, 0, 0), true);

      expect(p1.x).toBeCloseTo(0, 5);
      expect(p1.y).toBeCloseTo(0, 5);

      // 点在线段终点右侧 → clamp=true 时最近点是终点
      const p2 = line.closestPointToPoint(new Vector3(15, 0, 0), true);

      expect(p2.x).toBeCloseTo(10, 5);
      expect(p2.y).toBeCloseTo(0, 5);

      // 点在线段上方 → 最近点是线段上的投影点
      const p3 = line.closestPointToPoint(new Vector3(5, 10, 0), true);

      expect(p3.x).toBeCloseTo(5, 5);
      expect(p3.y).toBeCloseTo(0, 5);

      // 带 target 参数
      const target = new Vector3();
      const p4 = line.closestPointToPoint(new Vector3(5, 0, 0), true, target);

      expect(p4.x).toBeCloseTo(5, 5);
      expect(p4).toBe(target);

      // clamp=false 时，点在起点左侧
      const p5 = line.closestPointToPoint(new Vector3(-3, 0, 0), false);

      expect(p5.x).toBeCloseTo(-3, 5);
      expect(p5.y).toBeCloseTo(0, 5);
    });
  });
});
