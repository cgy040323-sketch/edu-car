import React, { useMemo } from 'react'
import * as THREE from 'three'

export default function Dangban({
  dangbankuandu = 150,
  dangbanhoudu = 50,
  depth = 9,
  color = 'royalblue',
  edgeColor = 'black',
  ...props
}) {
  const points = useMemo(() => [
    [40, 0],
    [50, 15],
    [dangbankuandu / 2, 15],
    [dangbankuandu / 2, dangbanhoudu],
    [-dangbankuandu / 2, dangbanhoudu],
    [-dangbankuandu / 2, 15],
    [-50, 15],
    [-40, 0],
  ], [dangbankuandu, dangbanhoudu])

  const { extrudeGeometry, edgesGeometry } = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(points[0][0], points[0][1])
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i][0], points[i][1])
    }
    shape.closePath()

    const extrudeSettings = {
      depth,
      bevelEnabled: false,
      curveSegments: 12,
      steps: 1,
      material: 0,
      extrudeMaterial: 1,
    }

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    extrudeGeometry.computeVertexNormals()
    const edgesGeometry = new THREE.EdgesGeometry(extrudeGeometry, 1)
    return { extrudeGeometry, edgesGeometry }
  }, [points, depth])

  const sideMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide }), [color])
  const capMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide }), [color])

  return (
    <group {...props}>
      <mesh geometry={extrudeGeometry} material={[sideMaterial, capMaterial]} frustumCulled={false} />
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color={edgeColor} linewidth={1} />
      </lineSegments>
    </group>
  )
}
