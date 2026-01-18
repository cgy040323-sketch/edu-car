import React, { useMemo } from 'react'
import * as THREE from 'three'

export default function Fork({
  X = 280,
  Wheel_W1 = 55,
  Fork_W1 = 50,
  Fork_TH1 = 7,
  color = 'royalblue',
  ...props
}) {
  const Wheel_TW1 = X - Wheel_W1
  const Fork_L1 = (Wheel_TW1 - Wheel_W1) / 2 + 18
  const Fork_L2 = Fork_L1 - 72

  const points = [
    [0, 0],
    [0, 6.5],
    [-9, 6.5],
    [-9, 33.5],
    [0, 33.5],
    [0, 40],
    [-15, 40],
    [-15 - Fork_L2, 35.5],
    [-15 - Fork_L2 - 28, 35.5],
    [-15 - Fork_L2 - 28, 29.5],
    [-15 - Fork_L2 - 28 - 23, 29.5],
    [-15 - Fork_L2 - 28 - 23 - 6, 26.5],
    [-15 - Fork_L2 - 28 - 23 - 6, 3.5],
    [-15 - Fork_L2 - 28 - 23, 0],
    [-15 - Fork_L2 - 28, 0],
    [-15 - Fork_L2, -10],
    [-15, 0],
  ]

  const points2 = [
    [-20.75 - Fork_L2, -1.5],
    [-20.75 - Fork_L2 - 16.5, -1.5],
    [-20.75 - Fork_L2 - 16.5, -7.5],
    [-20.75 - Fork_L2, -7.5],
  ]

  const points3 = [
    [-20.75 - Fork_L2, 32.5],
    [-20.75 - Fork_L2 - 16.5, 32.5],
    [-20.75 - Fork_L2 - 16.5, 26.5],
    [-20.75 - Fork_L2, 26.5],
  ]

  const points4 = [
    [-39.5 - Fork_L2, 24.5],
    [-49, 24.5],
    [-49, 21],
    [-70, 21],
    [-70, 8],
    [-49, 8],
    [-49, 3.5],
    [-39.5 - Fork_L2, 3.5],
  ]

  const { extrudeGeometry, frontShape, backShape, extrudeEdges, frontEdges, backEdges } = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(points[0][0], points[0][1])
    for (let i = 1; i < points.length; i++) shape.lineTo(points[i][0], points[i][1])
    shape.closePath()

    const holePath = new THREE.Path()
    holePath.moveTo(points2[0][0], points2[0][1])
    for (let i = 1; i < points2.length; i++) holePath.lineTo(points2[i][0], points2[i][1])
    holePath.closePath()
    shape.holes.push(holePath)

    const holePath1 = new THREE.Path()
    holePath1.moveTo(points3[0][0], points3[0][1])
    for (let i = 1; i < points3.length; i++) holePath1.lineTo(points3[i][0], points3[i][1])
    holePath1.closePath()
    shape.holes.push(holePath1)

    const holePath2 = new THREE.Path()
    holePath2.moveTo(points4[0][0], points4[0][1])
    for (let i = 1; i < points4.length; i++) holePath2.lineTo(points4[i][0], points4[i][1])
    holePath2.closePath()
    shape.holes.push(holePath2)

    const extrudeSettings = { depth: Fork_TH1, bevelEnabled: false, curveSegments: 12 }
    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    extrudeGeometry.computeVertexNormals()
    extrudeGeometry.translate(0, 0, -Fork_TH1 / 2)

    const frontShape = new THREE.ShapeGeometry(shape)
    const backShape = new THREE.ShapeGeometry(shape)
    const halfDepth = Fork_TH1 / 2
    frontShape.translate(0, 0, halfDepth)
    backShape.translate(0, 0, -halfDepth)

    const maxDim = Math.max(...points.flat().map((v) => Math.abs(v)), ...points2.flat().map((v) => Math.abs(v))) * 2
    const boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), maxDim)
    extrudeGeometry.boundingSphere = boundingSphere
    frontShape.boundingSphere = boundingSphere
    backShape.boundingSphere = boundingSphere

    const min = new THREE.Vector3(-maxDim, -maxDim, -halfDepth - 1)
    const max = new THREE.Vector3(maxDim, maxDim, halfDepth + 1)
    const boundingBox = new THREE.Box3(min, max)
    extrudeGeometry.boundingBox = boundingBox
    frontShape.boundingBox = boundingBox
    backShape.boundingBox = boundingBox

    const extrudeEdges = new THREE.EdgesGeometry(extrudeGeometry, 30)
    const frontEdges = new THREE.EdgesGeometry(frontShape)
    const backEdges = new THREE.EdgesGeometry(backShape)
    return { extrudeGeometry, frontShape, backShape, extrudeEdges, frontEdges, backEdges }
  }, [X, Wheel_W1, Fork_W1, Fork_TH1, Fork_L2, points, points2, points3, points4])

  return (
    <group {...props}>
      <mesh geometry={extrudeGeometry} frustumCulled={false}>
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={frontShape} frustumCulled={false}>
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={backShape} frustumCulled={false}>
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={extrudeEdges}>
        <lineBasicMaterial color="black" linewidth={1} />
      </lineSegments>
      <lineSegments geometry={frontEdges}>
        <lineBasicMaterial color="black" linewidth={1} />
      </lineSegments>
      <lineSegments geometry={backEdges}>
        <lineBasicMaterial color="black" linewidth={1} />
      </lineSegments>
    </group>
  )
}
