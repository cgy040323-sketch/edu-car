import React, { useMemo } from 'react'
import * as THREE from 'three'

function Cylinder({ length, position, rotation }) {
  const safeLength = Number.isFinite(length) ? length : 1
  const geometry = useMemo(() => new THREE.CylinderGeometry(1.5, 1.5, safeLength, 32), [safeLength])
  const adjustedPosition = [position[0] + safeLength / 2, position[1], position[2]]

  return (
    <mesh geometry={geometry} position={adjustedPosition} rotation={rotation}>
      <meshStandardMaterial color="royalblue" />
    </mesh>
  )
}

export default Cylinder
