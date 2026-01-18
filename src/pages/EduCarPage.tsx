import React, { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import EduCar, { ComponentInfoModal, EduParams } from '../components/3d/EduCar'
import './EduCarPage.css'

type ParamKey =
  | 'Y'
  | 'Base_W1'
  | 'X'
  | 'Base_L5'
  | 'outerRadius'
  | 'innerRadius'
  | 'depth'
  | 'dangbankuandu'
  | 'dangbanhoudu'
  | 'Bumper_W1'
  | 'Base_W2'
  | 'Base_L4'
  | 'Base_L3'
  | 'Base_TH1'
  | 'weight'            // 新增：载重量（kg）
  | 'motorPower'        // 新增：电机功率（W）
  | 'batteryCapacity'   // 新增：电池容量（mAh）



type ParamsState = Record<ParamKey, number>







const DEFAULT_PARAMS: ParamsState = {
  Y: 550,
  Base_W1: 260,
  X: 300,
  Base_L5: 68,
  outerRadius: 50,        // 改为与 educationParameterPanel 一致
  innerRadius: 35,
  depth: 55,
  dangbankuandu: 150,
  dangbanhoudu: 50,
  weight: 5,
  motorPower: 500,
  batteryCapacity: 5000,
  Bumper_W1: 50,
  Base_W2: 50,
  Base_L4: 140,
  Base_L3: 75.5,
  Base_TH1: 3,
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)



function CanvasStage({ params, selectedComponent, setSelectedComponent }: { params: EduParams, selectedComponent: string | null, setSelectedComponent: React.Dispatch<React.SetStateAction<string | null>> }) {
  return (
    <Canvas shadows camera={{ position: [250, 220, 600], fov: 65, near: 0.1, far: 2000 }} className="canvas-stage-full">
      {/* <color attach="background" args={["#0b1120"]} /> */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[400, 500, 200]} intensity={1.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <Suspense fallback={null}>
        <group position={[0, 0, 0]}> 
          <EduCar {...params} selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -90, 0]} receiveShadow>
            <planeGeometry args={[3000, 3000]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
        <Environment preset="city" />
      </Suspense>
      {/* <gridHelper args={[3000, 40, '#334155', '#1f2937']} /> */}
      <OrbitControls
        enableDamping
        dampingFactor={0.12}
        minDistance={300}
        maxDistance={1500}
        target={[0, 40, 0]}
      />
    </Canvas>
  )
}

export default function EduCarPage() {
  const [params, setParams] = useState<ParamsState>(DEFAULT_PARAMS)
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)

  // 添加事件监听器来处理组件点击
  React.useEffect(() => {
    const handleComponentClick = (event: any) => {
      setSelectedComponent(event.detail.componentName);
    };

    window.addEventListener('componentClicked', handleComponentClick);
    
    return () => {
      window.removeEventListener('componentClicked', handleComponentClick);
    };
  }, []);

  const safeParams = useMemo<EduParams>(() => {
    const next = { ...params }

    // 确保轮毂直径小于轮胎直径
    const maxInner = next.outerRadius - 2
    if (next.innerRadius >= maxInner) {
      next.innerRadius = clamp(maxInner, 10, next.innerRadius)
    }

    // 限制肩部长度与包角，避免底板几何畸形
    const maxBaseL4 = (next.Y - next.Bumper_W1 * 2) / 2 - 5
    if (maxBaseL4 > 0 && next.Base_L4 > maxBaseL4) {
      next.Base_L4 = Number(maxBaseL4.toFixed(2))
    }
    const maxBumper = next.Y / 2 - next.Base_L4 - 5
    if (maxBumper > 0 && next.Bumper_W1 > maxBumper) {
      next.Bumper_W1 = Number(maxBumper.toFixed(2))
    }

    return next
  }, [params])



  const resetParams = () => setParams(DEFAULT_PARAMS)

  return (
    <div className="app-shell-full">
      <div className="canvas-wrap-center">
        <div className="canvas-overlay">
          <button className="button" onClick={resetParams}>
            重置参数
          </button>
        </div>
        <CanvasStage params={safeParams} selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent} />
      </div>
      <ComponentInfoModal componentName={selectedComponent} onClose={() => setSelectedComponent(null)} />
    </div>
  )
}