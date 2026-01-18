import React, { useMemo } from 'react'
import * as THREE from 'three'

function Cylinder({ length, position, rotation }) {
  const geometry = useMemo(() => new THREE.CylinderGeometry(1.5, 1.5, length, 32), [length])
  return (
    <mesh geometry={geometry} position={position} rotation={rotation}>
      <meshStandardMaterial color="royalblue" />
    </mesh>
  )
}

export default Cylinder
