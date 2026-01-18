import React, { useMemo } from 'react'
import * as THREE from 'three'

function Tire({ outerRadius = 50, innerRadius = 35, depth = 55, hubDepth = 3, ...props }) {
  const tireGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false)
    const holePath = new THREE.Path()
    holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, true)
    shape.holes.push(holePath)

    const extrudeSettings = { steps: 2, depth, bevelEnabled: false }
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    geom.center()
    return geom
  }, [outerRadius, innerRadius, depth])

  const hubGeometry = useMemo(() => {
    const geom = new THREE.CylinderGeometry(innerRadius, innerRadius, hubDepth, 32)
    geom.rotateX(Math.PI / 2)
    return geom
  }, [innerRadius, hubDepth])

  const tireMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.8, metalness: 0.2 }), [])
  const hubMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xffa500, roughness: 0.5, metalness: 0.5 }), [])

  return (
    <group {...props}>
      <mesh geometry={tireGeometry} material={tireMaterial} name="tireRing" />
      <mesh geometry={hubGeometry} material={hubMaterial} name="tireHub" />
    </group>
  )
}

export default Tire
