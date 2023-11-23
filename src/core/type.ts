/**
 * 二维向量内部数据类型
 */
export type vec2 = [x: number, y: number];
export type Vector2DataType = number[] | vec2 | Float32Array;

/**
 * 类二维向量
 */
export interface Vector2Like {
  x: number,
  y: number,
}

/**
* 三维向量内部数据类型
*/
export type vec3 = [x: number, y: number, z: number];
export type Vector3DataType = number[] | vec3 | Float32Array;

/**
 * 类三维向量
 */
export interface Vector3Like {
  x: number,
  y: number,
  z: number,
}

/**
* 四维向量内部数据类型
*/
export type vec4 = [x: number, y: number, z: number, w: number];
export type Vector4DataType = number[] | vec4 | Float32Array;

/**
 * 类四维向量
 */
export interface Vector4Like {
  x: number,
  y: number,
  z: number,
  w: number,
}

/**
* 颜色内部数据类型
*/
export type ColorDataType = number[] | vec4 | Float32Array;

/**
 * 类四维向量
 */
export interface ColorLike {
  r: number,
  g: number,
  b: number,
  a: number,
}

/**
* 二维矩阵内部数据类型
*/
export type Matrix2DataType = number[] | [number, number, number, number] | Float32Array;

/**
* 三维矩阵内部数据类型
*/
export type mat3 = [
  m11: number, m12: number, m13: number,
  m21: number, m22: number, m23: number,
  m31: number, m32: number, m33: number,
];
export type Matrix3DataType = number[] | mat3 | Float32Array;

/**
* 四阶矩阵内部数据类型
*/
export type mat4 = [
  m11: number, m12: number, m13: number, m14: number,
  m21: number, m22: number, m23: number, m24: number,
  m31: number, m32: number, m33: number, m34: number,
  m41: number, m42: number, m43: number, m44: number,
];
export type Matrix4DataType = number[] | mat4 | Float32Array;

/**
 * 欧拉角内部数据类型
 */
export type EulerDataType = number[] | vec3 | vec4 | Float32Array;

/**
 * 四元数内部数据类型
 */
export type QuaternionDataType = number[] | vec4 | Float32Array;

/**
 * 类二维包围盒
 */
export interface Box2Like {
  min: Vector2Like,
  max: Vector2Like,
}

/**
 * 类三维包围盒
 */
export interface Box3Like {
  min: Vector3Like,
  max: Vector3Like,
}

/**
 * 类球体
 */
export interface SphereLike {
  center: Vector3Like,
  radius: number,
}

/**
 * 类三角形
 */
export interface TriangleLike {
  p0: Vector3Like,
  p1: Vector3Like,
  p2: Vector3Like,
}

/**
 * 类平面
 */
export interface PlaneLike {
  distance: number,
  normal: Vector3Like,
}
