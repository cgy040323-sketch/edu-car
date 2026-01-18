import React, { useMemo } from 'react'
import * as THREE from 'three'

export default function Zhijia({
  X = 280,
  Wheel_W1 = 55,
  color = 'royalblue',
  Bracket_H1 = 60,
  Bracket_W5 = 24,
  Bracket_H6 = 16.4,
  Bracket_TH1 = 17.5,
  ...props
}) {
  const Wheel_TW1 = X - Wheel_W1
  const Fork_L1 = (Wheel_TW1 - Wheel_W1) / 2 + 18
  const Bracket_W1 = 50 + (Fork_L1 - 75) * 2

  const points = [
    [0, -15],
    [-15, -15],
    [-19, 0],
    [-Bracket_W1 / 2, 0],
    [-Bracket_W1 / 2, -12],
    [-Bracket_W1 / 2 + 13, -Bracket_H1],
    [-Bracket_W5 / 2, -Bracket_H1],
    [-Bracket_W5 / 2, -Bracket_H1 + Bracket_H6],
    [Bracket_W5 / 2, -Bracket_H1 + Bracket_H6],
    [Bracket_W5 / 2, -Bracket_H1],
    [Bracket_W1 / 2 - 13, -Bracket_H1],
    [Bracket_W1 / 2, -12],
    [Bracket_W1 / 2, 0],
    [19, 0],
    [15, -15],
  ]

  const { extrudeGeometry, frontShape, backShape, extrudeEdges, frontEdges, backEdges } = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(points[0][0], points[0][1])
    for (let i = 1; i < points.length; i++) shape.lineTo(points[i][0], points[i][1])
    shape.closePath()

    const frontShape = new THREE.ShapeGeometry(shape)
    const backShape = new THREE.ShapeGeometry(shape)

    const extrudeSettings = { depth: Bracket_TH1, bevelEnabled: false, curveSegments: 12 }
    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    extrudeGeometry.computeVertexNormals()
    extrudeGeometry.center()

    const halfDepth = extrudeSettings.depth / 2
    frontShape.translate(0, 30, halfDepth)
    backShape.translate(0, 30, -halfDepth)

    const maxDim = Math.max(Bracket_W1, Bracket_W5) * 2
    const boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), maxDim)
    extrudeGeometry.boundingSphere = boundingSphere
    frontShape.boundingSphere = boundingSphere
    backShape.boundingSphere = boundingSphere

    const min = new THREE.Vector3(-maxDim, -maxDim, -maxDim)
    const max = new THREE.Vector3(maxDim, maxDim, maxDim)
    const boundingBox = new THREE.Box3(min, max)
    extrudeGeometry.boundingBox = boundingBox
    frontShape.boundingBox = boundingBox
    backShape.boundingBox = boundingBox

    const extrudeEdges = new THREE.EdgesGeometry(extrudeGeometry, 30)
    const frontEdges = new THREE.EdgesGeometry(frontShape)
    const backEdges = new THREE.EdgesGeometry(backShape)

    return { extrudeGeometry, frontShape, backShape, extrudeEdges, frontEdges, backEdges }
  }, [X, Wheel_W1, Bracket_H1, Bracket_W5, Bracket_H6, Bracket_TH1, points])

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
