import React, { useMemo } from 'react'
import * as THREE from 'three'

export default function Base({
  Y = 600,
  Bumper_W1 = 50,
  Base_W2 = 50,
  Base_W1 = 240,
  Base_L4 = 140,
  Base_L3 = 75.5,
  Base_TH1 = 3,
  color = 'royalblue',
  ...props
}) {
  const Base_L1 = Y - Bumper_W1 * 2
  const Base_L2 = Base_L1 - Base_L4 * 2

  const { extrudeGeometry, frontShape, backShape, extrudeEdges, frontEdges, backEdges } = useMemo(() => {
    const points = [
      [-Base_W2 / 2, Base_L1 / 2],
      [Base_W2 / 2, Base_L1 / 2],
      [Base_W2 / 2, Base_L1 / 2 - Base_L3],
      [Base_W1 / 2, Base_L2 / 2],
      [Base_W1 / 2, -Base_L2 / 2],
      [Base_W2 / 2, -(Base_L1 / 2 - Base_L3)],
      [Base_W2 / 2, -Base_L1 / 2],
      [-Base_W2 / 2, -Base_L1 / 2],
      [-Base_W2 / 2, -(Base_L1 / 2 - Base_L3)],
      [-Base_W1 / 2, -Base_L2 / 2],
      [-Base_W1 / 2, Base_L2 / 2],
      [-Base_W2 / 2, Base_L1 / 2 - Base_L3],
    ]

    const shape = new THREE.Shape()
    shape.moveTo(points[0][0], points[0][1])
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i][0], points[i][1])
    }
    shape.closePath()

    const frontShape = new THREE.ShapeGeometry(shape)
    const backShape = new THREE.ShapeGeometry(shape)

    const extrudeSettings = {
      depth: Base_TH1,
      bevelEnabled: false,
      curveSegments: 12,
    }

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    extrudeGeometry.computeVertexNormals()
    extrudeGeometry.center()

    const halfDepth = extrudeSettings.depth / 2
    frontShape.translate(0, 0, halfDepth)
    backShape.translate(0, 0, -halfDepth)

    const maxDim = Math.max(Base_L1, Base_W1) * 2
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
  }, [Y, Bumper_W1, Base_W1, Base_W2, Base_L3, Base_L4, Base_TH1])

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
