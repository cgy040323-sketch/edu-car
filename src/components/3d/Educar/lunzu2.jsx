import React, { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Lunzu2Model({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef()
  const { scene } = useGLTF('./models/lunzu2.glb')

  useEffect(() => {
    if (!groupRef.current) return
    const clonedScene = scene.clone()
    clonedScene.traverse((obj) => {
      if (obj.isMesh) {
        obj.material = new THREE.MeshStandardMaterial({ color: 'orange', side: THREE.DoubleSide })
        const edges = new THREE.EdgesGeometry(obj.geometry, 30)
        const line = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({
            color: 'black',
            linewidth: 1,
            polygonOffset: true,
            polygonOffsetFactor: -1,
            polygonOffsetUnits: -1,
          })
        )
        line.applyMatrix4(obj.matrixWorld)
        clonedScene.add(line)
      }
    })
    groupRef.current.add(clonedScene)
  }, [scene])

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={typeof scale === 'number' ? [scale, scale, scale] : scale} />
  )
}

useGLTF.preload('./models/lunzu2.glb')
