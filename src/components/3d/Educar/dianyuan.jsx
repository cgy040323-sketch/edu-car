import React from 'react'
import { Edges } from '@react-three/drei'

export default function Dianyuan({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[100, 40, 70]} />
      <meshStandardMaterial color="red" />
      <Edges scale={1.01} threshold={15} color="black" />
    </mesh>
  )
}
