import Vector3 from './Vector3'
import EulerAngles from './EulerAngles'
import Quaternion from './Quaternion'

/**
 * mat4 标准矩阵
 *
 * @class Matrix4
 */
class Matrix4 {
  m11: number
  m12: number
  m13: number
  m14: number
  m21: number
  m22: number
  m23: number
  m24: number
  m31: number
  m32: number
  m33: number
  m34: number
  tx: number
  ty: number
  tz: number
  tw: number

  constructor(m11: number = 1, m12: number = 0, m13: number = 0, m14: number = 0, m21: number = 0, m22: number = 1, m23: number = 0, m24: number = 0, m31: number = 0, m32: number = 0, m33: number = 1, m34: number = 0, tx: number = 0, ty: number = 0, tz: number = 0, tw: number = 1) {
    this.m11 = m11
    this.m12 = m12
    this.m13 = m13
    this.m14 = m14
    this.m21 = m21
    this.m22 = m22
    this.m23 = m23
    this.m24 = m24
    this.m31 = m31
    this.m32 = m32
    this.m33 = m33
    this.m34 = m34
    this.tx = tx
    this.ty = ty
    this.tz = tz
    this.tw = tw
  }

  /**
   * 标量乘法
   *
   * @static
   * @param {number} scalar
   * @param {Matrix4} m
   * @returns {Matrix4}
   * @memberof Matrix4
   */
  static scalarMultiply(scalar: number, m: Matrix4): Matrix4 {
    return new Matrix4(
      m.m11 * scalar, m.m12 * scalar, m.m13 * scalar, m.m14 * scalar,
      m.m21 * scalar, m.m22 * scalar, m.m23 * scalar, m.m24 * scalar,
      m.m31 * scalar, m.m32 * scalar, m.m33 * scalar, m.m34 * scalar,
      m.tx * scalar, m.ty * scalar, m.tz * scalar, m.tw * scalar
    )
  }

  /**
   * 通过欧拉角构建旋转矩阵
   *
   * @static
   * @param {EulerAngles} orientation
   * @returns {RotationMatrix}
   * @memberof Matrix4
   */
  static fromEulerAngle(orientation: EulerAngles): Matrix4 {
    let sinH = Math.sin(orientation.heading)
    let cosH = Math.cos(orientation.heading)
    let sinP = Math.sin(orientation.picth)
    let cosP = Math.cos(orientation.picth)
    let sinB = Math.sin(orientation.bank)
    let cosB = Math.cos(orientation.bank)

    let m11 = cosH * cosB + sinH * sinP * sinB
    let m12 = -cosH * sinB + sinH * sinP * cosB
    let m13 = sinH * cosP
    let m21 = sinB * cosP
    let m22 = cosB * cosP
    let m23 = -sinP
    let m31 = -sinH * cosB + cosH * sinP * sinB
    let m32 = sinB * sinH + cosH * sinP * cosB
    let m33 = cosH * cosP

    return new Matrix4(m11, m12, m13, 0, m21, m22, m23, 0, m31, m32, m33, 0, 0, 0, 0, 1)
  }

  /**
   * 从世界-物体四元数构建旋转矩阵
   *
   * @static
   * @param {Quaternion} q
   * @returns {RotationMatrix}
   * @memberof Matrix4
   */
  static fromWorldToObjectQuaternion(q: Quaternion): Matrix4 {
    let m11 = 1 - 2 * q.y * q.y - 2 * q.z * q.z
    let m12 = 2 * q.x * q.y + 2 * q.w * q.z
    let m13 = 2 * q.x * q.z - 2 * q.w * q.y
    let m21 = 2 * q.x * q.y - 2 * q.w * q.z
    let m22 = 1 - 2 * q.x * q.x - 2 * q.z * q.z
    let m23 = 2 * q.y * q.z + 2 * q.w * q.x
    let m31 = 2 * q.x * q.z + 2 * q.w * q.y
    let m32 = 2 * q.y * q.z - 2 * q.w * q.x
    let m33 = 1 - 2 * q.x * q.x - 2 * q.y * q.y

    return new Matrix4(m11, m12, m13, 0, m21, m22, m23, 0, m31, m32, m33, 0, 0, 0, 0, 1)
  }

  /**
   * 从物体——世界四元数构建旋转矩阵
   *
   * @static
   * @param {Quaternion} q
   * @returns {RotationMatrix}
   * @memberof Matrix4
   */
  static fromObjectToWorldQuaternion(q: Quaternion): Matrix4 {
    let m11 = 1 - 2 * q.y * q.y - 2 * q.z * q.z
    let m12 = 2 * q.x * q.y - 2 * q.w * q.z
    let m13 = 2 * q.x * q.z + 2 * q.w * q.y
    let m21 = 2 * q.x * q.y + 2 * q.w * q.z
    let m22 = 1 - 2 * q.x * q.x - 2 * q.z * q.z
    let m23 = 2 * q.y * q.z - 2 * q.w * q.x
    let m31 = 2 * q.x * q.z - 2 * q.w * q.y
    let m32 = 2 * q.y * q.z + 2 * q.w * q.x
    let m33 = 1 - 2 * q.x * q.x - 2 * q.y * q.y

    return new Matrix4(m11, m12, m13, 0, m21, m22, m23, 0, m31, m32, m33, 0, 0, 0, 0, 1)
  }

  /**
   * 矩阵叉乘
   *
   * @static
   * @param {...Matrix4[]} args
   * @returns {Matrix4}
   * @memberof Matrix4
   */
  static matrix4Multiply(...args: Matrix4[]): Matrix4 {
    if(args.length < 2) {
      throw Error('矩阵叉乘至少需要两个参数')
    }
    return args.reduce((a: Matrix4, b: Matrix4): Matrix4 => {
      return new Matrix4(
        a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31 + a.m14 * b.tx,
        a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32 + a.m14 * b.ty,
        a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33 + a.m14 * b.tz,
        a.m11 * b.m14 + a.m12 * b.m24 + a.m13 * b.m34 + a.m14 * b.tw,
        a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31 + a.m24 * b.tx,
        a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32 + a.m24 * b.ty,
        a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33 + a.m24 * b.tz,
        a.m21 * b.m14 + a.m22 * b.m24 + a.m23 * b.m34 + a.m24 * b.tw,
        a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31 + a.m34 * b.tx,
        a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32 + a.m34 * b.ty,
        a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33 + a.m34 * b.tz,
        a.m31 * b.m14 + a.m32 * b.m24 + a.m33 * b.m34 + a.m34 * b.tw,
        a.tx * b.m11 + a.ty * b.m21 + a.tz * b.m31 + a.tw * b.tx,
        a.tx * b.m12 + a.ty * b.m22 + a.tz * b.m32 + a.tw * b.ty,
        a.tx * b.m13 + a.ty * b.m23 + a.tz * b.m33 + a.tw * b.tz,
        a.tx * b.m14 + a.ty * b.m24 + a.tz * b.m34 + a.tw * b.tw
      )
    })
  }

  /**
   * 标量乘法（实例属性）
   *
   * @param {number} scalar
   * @memberof Matrix4
   */
  scalarMultiply(scalar: number): void {
    this.cloneFrom(Matrix4.scalarMultiply(scalar, this))
  }

  /**
   * 矩阵叉乘（实例属性）
   *
   * @param {...Matrix4[]} args
   * @returns {Matrix4}
   * @memberof Matrix4
   */
  matrix4Multiply(...args: Matrix4[]): void {
    this.cloneFrom(Matrix4.matrix4Multiply(this, ...args))
  }

  /**
   * 置为单位矩阵（实例属性）
   *
   * @memberof Matrix4
   */
  identity(): void {
    this.m11 = 1
    this.m12 = 0
    this.m13 = 0
    this.m14 = 0
    this.m21 = 0
    this.m22 = 1
    this.m23 = 0
    this.m24 = 0
    this.m31 = 0
    this.m32 = 0
    this.m33 = 1
    this.m34 = 0
    this.tx = 0
    this.ty = 0
    this.tz = 0
    this.tw = 1
  }

  /**
   * 清空平移部分
   *
   * @memberof Matrix4
   */
  clearTranslation(): void {
    this.tx = this.ty = this.tz = 0
  }

  /**
   * 设置平移
   *
   * @param {Vector3} v
   * @memberof Matrix4
   */
  setTranslation(v: Vector3): void {
    let tMat4 = new Matrix4(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      v.x, v.y, v.z, 1
    )
    this.matrix4Multiply(tMat4)
  }

  /**
   * 构造物体——世界变换矩阵，物体位置和方位在世界中描述
   *
   * @param {Vector3} pos
   * @param {EulerAngles} orientation
   * @memberof Matrix4
   */
  setLocalToParentFromEulerAngle(pos: Vector3, orientation: EulerAngles): void {
    let orientationMatrix = Matrix4.fromEulerAngle(orientation)
    this.setLocalToParentFromRotationMatrix(pos, orientationMatrix)
  }

  /**
   * 构造物体——世界变换矩阵，物体位置和方位在世界中描述
   *
   * @param {Vector3} pos
   * @param {RotationMatrix} orientation
   * @memberof Matrix4
   */
  setLocalToParentFromRotationMatrix(pos: Vector3, orientation: Matrix4): void {
    this.m11 = orientation.m11
    this.m12 = orientation.m12
    this.m13 = orientation.m13
    this.m14 = orientation.m14
    this.m21 = orientation.m21
    this.m22 = orientation.m22
    this.m23 = orientation.m23
    this.m24 = orientation.m24
    this.m31 = orientation.m31
    this.m32 = orientation.m32
    this.m33 = orientation.m33
    this.m34 = orientation.m34
    this.tx = pos.x
    this.ty = pos.y
    this.tz = pos.z
    this.tw = orientation.tw
  }

  /**
   * 构造世界——物体变换矩阵，物体位置和方位在世界中描述
   *
   * @param {Vector3} pos
   * @param {EulerAngles} orientation
   * @memberof Matrix4
   */
  setParentToLocalFromEulerAngle(pos: Vector3, orientation: EulerAngles): void {
    let orientationMatrix = Matrix4.fromEulerAngle(orientation)
    this.setParentToLocalFromRotationMatrix(pos, orientationMatrix)
  }

  /**
   * 构造世界——物体变换矩阵，物体位置和方位在世界中描述
   *
   * @param {Vector3} pos
   * @param {RotationMatrix} orientation
   * @memberof Matrix4
   */
  setParentToLocalFromRotationMatrix(pos: Vector3, orientation: Matrix4): void {
    this.m11 = orientation.m11
    this.m12 = orientation.m12
    this.m13 = orientation.m13
    this.m14 = orientation.m14
    this.m21 = orientation.m21
    this.m22 = orientation.m22
    this.m23 = orientation.m23
    this.m24 = orientation.m24
    this.m31 = orientation.m31
    this.m32 = orientation.m32
    this.m33 = orientation.m33
    this.m34 = orientation.m34
    this.tx = -(pos.x * this.m11 + pos.y * this.m21 + pos.z * this.m31)
    this.ty = -(pos.x * this.m12 + pos.y * this.m22 + pos.z * this.m32)
    this.tz = -(pos.x * this.m13 + pos.y * this.m23 + pos.z * this.m33)
    this.tw = orientation.tw
  }

  /**
   * 绕坐标轴旋转
   *
   * @param {string} axis
   * @param {number} theta
   * @memberof Matrix4
   */
  setRotateFromXYZAxis(axis: string, theta: number): void {
    let sin: number = Math.sin(theta)
    let cos: number = Math.cos(theta)
    let resultMat4 = new Matrix4()

    switch(axis) {
      case('x'):
      case('X'): {
        resultMat4.m11 = 1
        resultMat4.m12 = 0
        resultMat4.m13 = 0
        resultMat4.m14 = 0
        resultMat4.m21 = 0
        resultMat4.m22 = cos
        resultMat4.m23 = sin
        resultMat4.m24 = 0
        resultMat4.m31 = 0
        resultMat4.m32 = -sin
        resultMat4.m33 = cos
        resultMat4.m34 = 0
        break
      }
      case('y'):
      case('Y'): {
        resultMat4.m11 = cos
        resultMat4.m12 = 0
        resultMat4.m13 = -sin
        resultMat4.m14 = 0
        resultMat4.m21 = 0
        resultMat4.m22 = 1
        resultMat4.m23 = 0
        resultMat4.m24 = 0
        resultMat4.m31 = sin
        resultMat4.m32 = 0
        resultMat4.m33 = cos
        resultMat4.m34 = 0
        break
      }
      case('z'):
      case('Z'): {
        resultMat4.m11 = cos
        resultMat4.m12 = sin
        resultMat4.m13 = 0
        resultMat4.m14 = 0
        resultMat4.m21 = -sin
        resultMat4.m22 = cos
        resultMat4.m23 = 0
        resultMat4.m24 = 0
        resultMat4.m31 = 0
        resultMat4.m32 = 0
        resultMat4.m33 = 1
        resultMat4.m34 = 0
        break
      }
    }

    resultMat4.tx = 0
    resultMat4.ty = 0
    resultMat4.tz = 0
    resultMat4.tw = 1

    this.matrix4Multiply(resultMat4)
  }

  /**
   * 绕特定轴旋转
   *
   * @param {Vector3} axis
   * @param {number} theta
   * @memberof Matrix4
   */
  setRotateFromVector3(axis: Vector3, theta: number): void {
    if(Math.abs(Vector3.getNorm(axis) - 1) > 0.01) {
      throw Error('旋转轴向量应为单位向量!')
    }

    let sin: number = Math.sin(theta)
    let cos: number = Math.cos(theta)
    let a: number = 1 - cos
    let ax: number = a * axis.x
    let ay: number = a * axis.y
    let az: number = a * axis.z
    let resultMat4 = new Matrix4()

    resultMat4.m11 = ax * axis.x + cos
    resultMat4.m12 = ax * axis.y + axis.z * sin
    resultMat4.m13 = ax * axis.z - axis.y * sin
    resultMat4.m14 = 0
    resultMat4.m21 = ay * axis.x - axis.z * sin
    resultMat4.m22 = ay * axis.y + cos
    resultMat4.m23 = ay * axis.z + axis.x * sin
    resultMat4.m24 = 0
    resultMat4.m31 = az * axis.x + axis.y * sin
    resultMat4.m32 = az * axis.y - axis.x * sin
    resultMat4.m33 = az * axis.z + cos
    resultMat4.m34 = 0
    resultMat4.tx = 0
    resultMat4.ty = 0
    resultMat4.tz = 0
    resultMat4.tw = 1

    this.matrix4Multiply(resultMat4)
  }

  /**
   * 沿坐标轴缩放
   *
   * @param {Vector3} v
   * @memberof Matrix4
   */
  setScale(v: Vector3): void {
    let resultMat4 = new Matrix4()

    resultMat4.m11 = v.x
    resultMat4.m12 = 0
    resultMat4.m13 = 0
    resultMat4.m21 = 0
    resultMat4.m22 = v.y
    resultMat4.m23 = 0
    resultMat4.m31 = 0
    resultMat4.m32 = 0
    resultMat4.m33 = v.z
    resultMat4.tx = 0
    resultMat4.ty = 0
    resultMat4.tz = 0

    resultMat4.m14 = resultMat4.m24 = resultMat4.m34 = 0
    resultMat4.tw = 1

    this.matrix4Multiply(resultMat4)
  }

  /**
   * 沿任意轴缩放
   *
   * @param {Vector3} axis
   * @param {number} k
   * @memberof Matrix4
   */
  setScaleFromAxis(axis: Vector3, k: number): void {
    if(Math.abs(Vector3.getNorm(axis) - 1) > 0.01) {
      throw Error('旋转轴向量应为单位向量!')
    }

    let a = k - 1
    let ax = a * axis.x
    let ay = a * axis.y
    let az = a * axis.z
    let resultMat4 = new Matrix4()

    resultMat4.m11 = ax * axis.x + 1
    resultMat4.m22 = ay * axis.y + 1
    resultMat4.m33 = az * axis.z + 1
    resultMat4.m12 = resultMat4.m21 = ax * axis.y
    resultMat4.m13 = resultMat4.m31 = ax * axis.z
    resultMat4.m23 = resultMat4.m32 = ay * axis.z
    resultMat4.tx = resultMat4.ty = resultMat4.tz = 0

    resultMat4.m14 = resultMat4.m24 = resultMat4.m34 = 0
    resultMat4.tw = 1

    this.matrix4Multiply(resultMat4)
  }

  /**
   * 设置切变
   *
   * @param {string} axis
   * @param {number} s
   * @param {number} t
   * @memberof Matrix4
   */
  setShear(axis: string, s: number, t: number): void {
    let resultMat4 = new Matrix4()
    switch(axis) {
      case('x'):
      case('X'): {
        resultMat4.m11 = 1
        resultMat4.m12 = 0
        resultMat4.m13 = 0
        resultMat4.m21 = 0
        resultMat4.m22 = 1
        resultMat4.m23 = 0
        resultMat4.m31 = s
        resultMat4.m32 = t
        resultMat4.m33 = 1
        break
      }
      case('y'):
      case('Y'): {
        resultMat4.m11 = 1
        resultMat4.m12 = 0
        resultMat4.m13 = 0
        resultMat4.m21 = s
        resultMat4.m22 = 1
        resultMat4.m23 = t
        resultMat4.m31 = 0
        resultMat4.m32 = 0
        resultMat4.m33 = 1
        break
      }
      case('z'):
      case('Z'): {
        resultMat4.m11 = 1
        resultMat4.m12 = s
        resultMat4.m13 = t
        resultMat4.m21 = 0
        resultMat4.m22 = 1
        resultMat4.m23 = 0
        resultMat4.m31 = 0
        resultMat4.m32 = 0
        resultMat4.m33 = 1
        break
      }
    }
    resultMat4.tx = resultMat4.ty = resultMat4.tx = 0

    resultMat4.m14 = resultMat4.m24 = resultMat4.m34 = 0
    resultMat4.tw = 1

    this.matrix4Multiply(resultMat4)
  }

  /**
   * 设置指定反射平面的反射矩阵
   *
   * @param {Vector3} n
   * @memberof Matrix4x3
   */
  setReflection(n: Vector3): void {
    if(Math.abs(Vector3.getNorm(n) - 1) > 0.01) {
      throw Error('反射平面法向量应为单位向量!')
    }

    let ax = -2 * n.x
    let ay = -2 * n.y
    let az = -2 * n.z
    let resultMat4 = new Matrix4()

    resultMat4.m11 = 1 + ax * n.x
    resultMat4.m22 = 1 + ay * n.y
    resultMat4.m33 = 1 + az * n.z
    resultMat4.m12 = resultMat4.m21 = ax * n.y
    resultMat4.m13 = resultMat4.m31 = ax * n.z
    resultMat4.m23 = resultMat4.m32 = ay * n.z
    resultMat4.tx = resultMat4.ty = resultMat4.tz = 0

    resultMat4.m14 = resultMat4.m24 = resultMat4.m34 = 0
    resultMat4.tw = 1

    this.matrix4Multiply(resultMat4)
  }

  /**
   * 矩阵求逆
   *
   * @memberof Matrix4
   */
  inverse(): void {
    let result = new Matrix4()
    let det: number

    result.m11 = this.m22 * this.m33 * this.tw - this.m22 * this.m34 * this.tz - this.m32 * this.m23 * this.tw + this.m32 * this.m24 * this.tz + this.ty * this.m23 * this.m34 - this.ty * this.m24 * this.m33
    result.m21 = - this.m21 * this.m33 * this.tw + this.m21 * this.m34 * this.tz + this.m31 * this.m23 * this.tw - this.m31 * this.m24 * this.tz - this.tx * this.m23 * this.m34 + this.tx * this.m24 * this.m33
    result.m31 = this.m21 * this.m32 * this.tw - this.m21 * this.m34 * this.ty - this.m31 * this.m22 * this.tw + this.m31 * this.m24 * this.ty + this.tx * this.m22 * this.m34 - this.tx * this.m24 * this.m32
    result.tx = - this.m21 * this.m32 * this.tz + this.m21 * this.m33 * this.ty + this.m31 * this.m22 * this.tz - this.m31 * this.m23 * this.ty - this.tx * this.m22 * this.m33 + this.tx * this.m23 * this.m32

    result.m12 = - this.m12 * this.m33 * this.tw + this.m12 * this.m34 * this.tz + this.m32 * this.m13 * this.tw - this.m32 * this.m14 * this.tz - this.ty * this.m13 * this.m34 + this.ty * this.m14 * this.m33
    result.m22 = this.m11 * this.m33 * this.tw - this.m11 * this.m34 * this.tz - this.m31 * this.m13 * this.tw + this.m31 * this.m14 * this.tz + this.tx * this.m13 * this.m34 - this.tx * this.m14 * this.m33
    result.m32 = - this.m11 * this.m32 * this.tw + this.m11 * this.m34 * this.ty + this.m31 * this.m12 * this.tw - this.m31 * this.m14 * this.ty - this.tx * this.m12 * this.m34 + this.tx * this.m14 * this.m32
    result.ty = this.m11 * this.m32 * this.tz - this.m11 * this.m33 * this.ty - this.m31 * this.m12 * this.tz + this.m31 * this.m13 * this.ty + this.tx * this.m12 * this.m33 - this.tx * this.m13 * this.m32

    result.m13 = this.m12 * this.m23 * this.tw - this.m12 * this.m24 * this.tz - this.m22 * this.m13 * this.tw + this.m22 * this.m14 * this.tz + this.ty * this.m13 * this.m24 - this.ty * this.m14 * this.m23
    result.m23 = - this.m11 * this.m23 * this.tw + this.m11 * this.m24 * this.tz + this.m21 * this.m13 * this.tw - this.m21 * this.m14 * this.tz - this.tx * this.m13 * this.m24 + this.tx * this.m14 * this.m23
    result.m33 = this.m11 * this.m22 * this.tw - this.m11 * this.m24 * this.ty - this.m21 * this.m12 * this.tw + this.m21 * this.m14 * this.ty + this.tx * this.m12 * this.m24 - this.tx * this.m14 * this.m22
    result.tz = - this.m11 * this.m22 * this.tz + this.m11 * this.m23 * this.ty + this.m21 * this.m12 * this.tz - this.m21 * this.m13 * this.ty - this.tx * this.m12 * this.m23 + this.tx * this.m13 * this.m22

    result.m14 = - this.m12 * this.m23 * this.m34 + this.m12 * this.m24 * this.m33 + this.m22 * this.m13 * this.m34 - this.m22 * this.m14 * this.m33 - this.m32 * this.m13 * this.m24 + this.m32 * this.m14 * this.m23
    result.m24 = this.m11 * this.m23 * this.m34 - this.m11 * this.m24 * this.m33 - this.m21 * this.m13 * this.m34 + this.m21 * this.m14 * this.m33 + this.m31 * this.m13 * this.m24 - this.m31 * this.m14 * this.m23
    result.m34 = - this.m11 * this.m22 * this.m34 + this.m11 * this.m24 * this.m32 + this.m21 * this.m12 * this.m34 - this.m21 * this.m14 * this.m32 - this.m31 * this.m12 * this.m24 + this.m31 * this.m14 * this.m22
    result.tw = this.m11 * this.m22 * this.m33 - this.m11 * this.m23 * this.m32 - this.m21 * this.m12 * this.m33 + this.m21 * this.m13 * this.m32 + this.m31 * this.m12 * this.m23 - this.m31 * this.m13 * this.m22

    det = this.m11 * result.m11 + this.m12 * result.m21 + this.m13 * result.m31 + this.m14 * result.tx
    if (det === 0) {
      this.cloneFrom(result)
      return
    }

    det = 1 / det
    result.scalarMultiply(det)
    this.cloneFrom(result)
  }

  /**
   * 矩阵转置
   *
   * @memberof Matrix4
   */
  transpose(): void {
    [
      this.m11, this.m12, this.m13, this.m14,
      this.m21, this.m22, this.m23, this.m24,
      this.m31, this.m32, this.m33, this.m34,
      this.tx, this.ty, this.tz, this.tw
    ] = [
      this.m11, this.m21, this.m31, this.tx,
      this.m12, this.m22, this.m32, this.ty,
      this.m13, this.m23, this.m33, this.tz,
      this.m14, this.m24, this.m34, this.tw
    ]
  }

  /**
   * 获取该矩阵的 mat4 类型化数组
   *
   * @returns {Float32Array}
   * @memberof Matrix4x3
   */
  getMat4FloatArray(): Float32Array {
    return new Float32Array([
      this.m11, this.m12, this.m13, this.m14,
      this.m21, this.m22, this.m23, this.m24,
      this.m31, this.m32, this.m33, this.m34,
      this.tx, this.ty, this.tz, this.tw
    ])
  }

  /**
   * 根据 eye, center, up 设置视图矩阵
   *
   * @param {Vector3} eye
   * @param {Vector3} center
   * @param {Vector3} up
   * @memberof Matrix4
   */
  setLookAt(eye: Vector3, center: Vector3, up: Vector3): void {
    // 构建新坐标轴
    // z轴 = eye - center
    let z = Vector3.plus(eye, Vector3.negate(center))
    z.normalize()
    up.normalize()
    let x = Vector3.crossProduct(up, z)
    x.normalize()
    let y = Vector3.crossProduct(z, x)
    y.normalize()

    // 构建复合矩阵，且求逆(物体绝对位置不动，是坐标轴变动了，物体相对坐标轴做反向运动)
    // C = R*T
    // C^-1 = T^-1*R^-1 注意：复合矩阵求逆时，其子矩阵顺序为反向，所以若要逆矩阵符合期望，计算符合矩阵时将子矩阵连接顺序反向。

    // 构建旋转矩阵
    let rMatrix = new Matrix4(
      ...x, 0,
      ...y, 0,
      ...z, 0,
      0, 0, 0, 1
    )

    // 构建平移矩阵
    let tMatrix = new Matrix4()
    tMatrix.setTranslation(eye)

    // 为了求逆正常，这里反向相乘，旋转*平移，正常应该是先平移再旋转
    let composedMatrix = Matrix4.matrix4Multiply(rMatrix, tMatrix)
    composedMatrix.inverse()

    this.matrix4Multiply(composedMatrix)
  }

  /**
   * 构建正射投影矩阵
   *
   * @param {number} left
   * @param {number} right
   * @param {number} bottom
   * @param {number} top
   * @param {number} near
   * @param {number} far
   * @memberof Matrix4
   */
  setOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number): void {
    let resultMat4 = new Matrix4()

    // 构建正射投影矩阵
    // 默认可视空间是 x: -1 ~ 1, y: -1 ~ 1, z: -1 ~ 1
    // http://www.cnblogs.com/yiyezhai/archive/2012/09/12/2677902.html
    resultMat4.m11 = 2 / (right - left)
    resultMat4.m12 = 0
    resultMat4.m13 = 0
    resultMat4.m14 = 0
    resultMat4.m21 = 0
    resultMat4.m22 = 2 / (top - bottom)
    resultMat4.m23 = 0
    resultMat4.m24 = 0
    resultMat4.m31 = 0
    resultMat4.m32 = 0
    resultMat4.m33 = - 2 / (far - near)
    resultMat4.m34 = 0
    resultMat4.tx = - (right + left) / (right - left)
    resultMat4.ty = - (top + bottom) / (top - bottom)
    resultMat4.tz = - (far + near) / (far - near)
    resultMat4.tw = 1

    this.matrix4Multiply(resultMat4)
  }

  /**
   * 构建透视投影矩阵
   *
   * @param {number} fov
   * @param {number} aspect
   * @param {number} near
   * @param {number} far
   * @memberof Matrix4
   */
  setPerspective(fov: number, aspect: number, near: number, far: number): void {
    let resultMat4 = new Matrix4()

    // 构建透视投影矩阵
    // 默认可视空间是 x: -1 ~ 1, y: -1 ~ 1, z: -1 ~ 1
    // 推导过程 https://stackoverflow.com/questions/28286057/trying-to-understand-the-math-behind-the-perspective-matrix-in-webgl/28301213#28301213 写的贼好
    let f = Math.tan(Math.PI / 2 - fov / 2)
    let rangeInv = 1 / (near - far)

    resultMat4.m11 = f / aspect
    resultMat4.m12 = 0
    resultMat4.m13 = 0
    resultMat4.m14 = 0
    resultMat4.m21 = 0
    resultMat4.m22 = f
    resultMat4.m23 = 0
    resultMat4.m24 = 0
    resultMat4.m31 = 0
    resultMat4.m32 = 0
    resultMat4.m33 = rangeInv * (near + far)
    resultMat4.m34 = -1
    resultMat4.tx = 0
    resultMat4.ty = 0
    resultMat4.tz = 2 * near * far * rangeInv
    resultMat4.tw = 0

    this.matrix4Multiply(resultMat4)
  }

  /**
   * 克隆矩阵
   *
   * @param {Matrix4} target
   * @memberof Matrix4
   */
  cloneFrom(target: Matrix4): void {
    this.m11 = target.m11
    this.m12 = target.m12
    this.m13 = target.m13
    this.m14 = target.m14
    this.m21 = target.m21
    this.m22 = target.m22
    this.m23 = target.m23
    this.m24 = target.m24
    this.m31 = target.m31
    this.m32 = target.m32
    this.m33 = target.m33
    this.m34 = target.m34
    this.tx = target.tx
    this.ty = target.ty
    this.tz = target.tz
    this.tw = target.tw
  }

  /**
   * 迭代器
   *
   * @returns {Object}
   * @memberof Matrix4x3
   */
  [Symbol.iterator](): Object {
    let values: Array<number> = [
      this.m11, this.m12, this.m13, this.m14,
      this.m21, this.m22, this.m23, this.m24,
      this.m31, this.m32, this.m33, this.m34,
      this.tx, this.ty, this.tz, this.tw
    ]
    let index: number = 0
    return {
      next(): IteratorResult<number> {
        return {
          done: index === values.length,
          value: values[index++]
        }
      }
    }
  }
}

export default Matrix4
