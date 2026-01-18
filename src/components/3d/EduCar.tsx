import React, { useMemo, createContext, useContext, useEffect, useRef } from 'react'
import { useCursor } from '@react-three/drei'
import Base from './Educar/Base.jsx'
import TireRaw from './Educar/lunzi.jsx'
import DianjiModel from './Educar/dianji.jsx'
import Dianyuan from './Educar/dianyuan.jsx'
import FangzhuanglanModel from './Educar/fangzhuanglan.jsx'
import ChasuqiModel from './Educar/chasuqimodel.jsx'
import Dangban from './Educar/fangzhuangjia.jsx'
import BizhenModel from './Educar/bizhen.jsx'
import Lunzu1Model from './Educar/lunzu1.jsx'
import Lunzu2Model from './Educar/lunzu2.jsx'
import Fork from './Educar/fork.jsx'
import Zhijia from './Educar/zhijia.jsx'
import ZhuanxiangModel from './Educar/zhuanxiang.jsx'

// 创建上下文来共享选中状态
const SelectionContext = createContext<{ selectedComponent: string | null, setSelectedComponent: React.Dispatch<React.SetStateAction<string | null>> }>({
  selectedComponent: null,
  setSelectedComponent: () => {}
});

// Minimal shared params typing for standalone usage
export type CommonParams = {
  X: number
  Y: number
  Base_W1: number
  Base_L5: number
  outerRadius: number
  innerRadius: number
  depth: number
  dangbankuandu: number
  dangbanhoudu: number
  Bumper_W1: number
  Base_W2: number
  Base_L4: number
  Base_L3: number
  Base_TH1: number
}

// For TSX friendliness when importing the jsx tire component
const Tire: React.FC<any> = (TireRaw as unknown) as React.FC<any>

export type EduParams = CommonParams & {
  weight?: number
}

interface InteractiveComponentProps {
  children: React.ReactNode;
  componentName: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  [key: string]: any; // Allow any additional props
}

interface EduCarProps extends EduParams {
  selectedComponent: string | null;
  setSelectedComponent: React.Dispatch<React.SetStateAction<string | null>>;
}

const InteractiveComponent = ({ children, componentName, position, rotation, scale }: InteractiveComponentProps) => {
  const { selectedComponent, setSelectedComponent } = useContext(SelectionContext);
  const groupRef = useRef<any>(null);
  const [hovered, setHovered] = React.useState(false);

  useCursor(hovered, 'pointer');

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (selectedComponent === componentName) {
      setSelectedComponent(null); // 如果点击的是当前选中的组件，则取消选择
    } else {
      setSelectedComponent(componentName);
      // 触发自定义事件传递组件名称
      window.dispatchEvent(new CustomEvent('componentClicked', { detail: { componentName } }));
    }
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
  };

  // 根据是否选中来设置可见性
  const visible = !selectedComponent || selectedComponent === componentName;

  // 更新可见性
  useEffect(() => {
    if (groupRef.current) {
      const traverse = (obj: any) => {
        if (obj.visible !== undefined) {
          obj.visible = visible;
        }
        if (obj.children) {
          obj.children.forEach(traverse);
        }
      };
      traverse(groupRef.current);
    }
  }, [visible]);

  return (
    <group position={position} rotation={rotation} scale={scale} ref={groupRef}>
      <group onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
        {children}
      </group>
    </group>
  );
};

// 全局组件信息弹窗组件
export const ComponentInfoModal = ({ componentName, onClose }: { componentName: string | null, onClose: () => void }) => {
  if (!componentName) return null;

  // 当弹窗关闭时，确保所有组件恢复显示
  const handleClose = () => {
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '25vw', // 改为占据屏幕宽度的四分之一
        height: '100vh',
        backgroundColor: 'white',
        zIndex: 9999,
        color: 'black',
        fontSize: '16px',
        textAlign: 'left',
        transform: 'translateX(100%)', // 初始位置在屏幕右侧
        animation: 'slideInFromRight 0.3s ease-out forwards',
      }}
      onClick={handleClose}
    >
      <style>
        {`
          @keyframes slideInFromRight {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}
      </style>
      <div 
        className="modal-content" // 添加类名以便检测
        style={{
          height: '100%',
          padding: '20px',
          overflow: 'auto',
          backgroundColor: '#f9fafb',
          borderLeft: '1px solid #e5e7eb'
        }}
        onClick={(e) => e.stopPropagation()} // 防止点击弹窗内容时关闭
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '18px' }}>组件信息</h2>
          <button 
            style={{
              padding: '5px 10px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            onClick={handleClose}
          >
            ×
          </button>
        </div>
        <p>您点击的组件是：<strong>{componentName}</strong></p>
        <div style={{ marginTop: '15px' }}>
          <h3 style={{ color: '#4b5563', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', fontSize: '16px' }}>组件详情</h3>
          <p>这是一个教育小车的重要组成部分。</p>
          <p>该组件在小车的运行中起到关键作用。</p>
        </div>
      </div>
    </div>
  );
};

export default function EduCar({ selectedComponent, setSelectedComponent, ...props }: EduCarProps) {
  const {
    Y, Base_W1, X, Base_L5, outerRadius, innerRadius, depth,
    dangbankuandu, dangbanhoudu,
    Bumper_W1, Base_W2, Base_L4, Base_L3, Base_TH1,
  } = props

  const modelPositions = useMemo(() => ({
    front: [0, -43, -189 - (Y - 600) / 2] as [number, number, number],
    back: [0, -43, 189 + (Y - 600) / 2] as [number, number, number],
  }), [Y])

  return (
    <SelectionContext.Provider value={{ selectedComponent, setSelectedComponent }}>
      <group>
        <InteractiveComponent componentName="底座">
          <Base
            rotation={[Math.PI / 2, 0, 0]}
            Y={Y}
            Bumper_W1={Bumper_W1}
            Base_W2={Base_W2}
            Base_W1={Base_W1}
            Base_L4={Base_L4}
            Base_L3={Base_L3}
            Base_TH1={Base_TH1}
          />
        </InteractiveComponent>

        <InteractiveComponent componentName="电源" position={[0, 25, 0]} rotation={[0, 0, 0]} scale={1}>
          <Dianyuan />
        </InteractiveComponent>

        <InteractiveComponent componentName="前差速器" position={modelPositions.front} rotation={[-Math.PI / 2, 0, 0]} scale={10}>
          <ChasuqiModel />
        </InteractiveComponent>
        <InteractiveComponent componentName="后差速器" position={modelPositions.back} rotation={[Math.PI / 2, Math.PI, 0]} scale={10}>
          <ChasuqiModel />
        </InteractiveComponent>

        <InteractiveComponent 
          componentName="前方挡板"
          position={[0, 5, 240 + (Y - 600) / 2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={1}
        >
          <Dangban
            dangbankuandu={dangbankuandu}
            dangbanhoudu={dangbanhoudu}
          />
        </InteractiveComponent>
        <InteractiveComponent 
          componentName="后方挡板"
          position={[0, 5, -240 - (Y - 600) / 2]}
          rotation={[Math.PI / 2, 0, Math.PI]}
          scale={1}
        >
          <Dangban
            dangbankuandu={dangbankuandu}
            dangbanhoudu={dangbanhoudu}
          />
        </InteractiveComponent>

        <InteractiveComponent componentName="前电机" position={[0, 2, -Base_L5 + 185 + (Y - 600) / 2]} rotation={[0, 0, 0]} scale={10}>
          <DianjiModel />
        </InteractiveComponent>
        <InteractiveComponent componentName="后电机" position={[0, 2, Base_L5 - 185 - (Y - 600) / 2]} rotation={[0, Math.PI, 0]} scale={10}>
          <DianjiModel />
        </InteractiveComponent>

        <InteractiveComponent componentName="右前轴承" position={[(X - 280) / 2 + 5, 0, -(Y - 600) / 2]} rotation={[0, Math.PI, 0]} scale={10}>
          <BizhenModel />
        </InteractiveComponent>
        <InteractiveComponent componentName="左前轴承" position={[-5 - (X - 280) / 2, 0, -426 - (Y - 600) / 2]} rotation={[0, 0, 0]} scale={10}>
          <BizhenModel />
        </InteractiveComponent>
        <InteractiveComponent componentName="左后轴承" position={[-(X - 280) / 2, 0, (Y - 600) / 2]} rotation={[Math.PI, Math.PI, Math.PI]} scale={10}>
          <BizhenModel />
        </InteractiveComponent>
        <InteractiveComponent componentName="右后轴承" position={[(X - 280) / 2 + 5, 0, 426 + (Y - 600) / 2]} rotation={[0, Math.PI, 0]} scale={10}>
          <BizhenModel />
        </InteractiveComponent>

        <InteractiveComponent componentName="左前轮组" position={[-167 - (X - 280) / 2, 115, 117 - (Y - 600) / 2]} rotation={[0, Math.PI, 0]} scale={10}>
          <Lunzu1Model />
        </InteractiveComponent>
        <InteractiveComponent componentName="左前轮胎" position={[-137 - (X - 280) / 2, 26, -211 - (Y - 600) / 2]} rotation={[0, Math.PI / 2, Math.PI / 2]} scale={1}>
          <Tire outerRadius={outerRadius} innerRadius={innerRadius} depth={depth} />
        </InteractiveComponent>
        <InteractiveComponent componentName="右前轮组" position={[167 + (X - 280) / 2, 115, -117 + (Y - 600) / 2]} rotation={[0, 0, 0]} scale={10}>
          <Lunzu1Model />
        </InteractiveComponent>
        <InteractiveComponent componentName="右前轮胎" position={[137 + (X - 280) / 2, 26, -211 - (Y - 600) / 2]} rotation={[0, Math.PI / 2, Math.PI / 2]} scale={1}>
          <Tire outerRadius={outerRadius} innerRadius={innerRadius} depth={depth} />
        </InteractiveComponent>
        <InteractiveComponent componentName="左后轮胎" position={[-137 - (X - 280) / 2, 26, 211 + (Y - 600) / 2]} rotation={[0, Math.PI / 2, Math.PI / 2]} scale={1}>
          <Tire outerRadius={outerRadius} innerRadius={innerRadius} depth={depth} />
        </InteractiveComponent>
        <InteractiveComponent componentName="右后轮组" position={[167 + (X - 280) / 2, 115, 117 - (Y - 600) / 2]} rotation={[0, 0, 0]} scale={10}>
          <Lunzu2Model />
        </InteractiveComponent>
        <InteractiveComponent componentName="左后轮组" position={[-167 - (X - 280) / 2, 115, -117 + (Y - 600) / 2]} rotation={[0, Math.PI, 0]} scale={10}>
          <Lunzu2Model />
        </InteractiveComponent>
        <InteractiveComponent componentName="右后轮胎" position={[137 + (X - 280) / 2, 26, 211 + (Y - 600) / 2]} rotation={[0, Math.PI / 2, Math.PI / 2]} scale={1}>
          <Tire outerRadius={outerRadius} innerRadius={innerRadius} depth={depth} />
        </InteractiveComponent>

        <InteractiveComponent componentName="左前叉臂" position={[-20, 7, -226 - (Y - 600) / 2]} rotation={[Math.PI / 2, 0, 0]} X={X}>
          <Fork X={X} />
        </InteractiveComponent>
        <InteractiveComponent componentName="右前叉臂" position={[20, 7, -226 - (Y - 600) / 2]} rotation={[Math.PI / 2, Math.PI, 0]} X={X}>
          <Fork X={X} />
        </InteractiveComponent>
        <InteractiveComponent componentName="右后叉臂" position={[20, 7, 226 + (Y - 600) / 2]} rotation={[Math.PI / 2, 0, Math.PI]} X={X}>
          <Fork X={X} />
        </InteractiveComponent>
        <InteractiveComponent componentName="左后叉臂" position={[-20, 7, 226 + (Y - 600) / 2]} rotation={[Math.PI / 2, -Math.PI, -Math.PI]} X={X}>
          <Fork X={X} />
        </InteractiveComponent>

        <InteractiveComponent componentName="前支架" position={[0, 63, -212 - (Y - 600) / 2]} rotation={[0, 0, 0]} X={X} scale={1}>
          <Zhijia X={X} />
        </InteractiveComponent>
        <InteractiveComponent componentName="后支架" position={[0, 63, 212 + (Y - 600) / 2]} rotation={[Math.PI, 0, Math.PI]} X={X} scale={1}>
          <Zhijia X={X} />
        </InteractiveComponent>
{/* 
      <Cylinder length={X - 20} position={[0, 26, 212 + (Y - 600) / 2]} rotation={[0, 0, Math.PI / 2]} />
      <Cylinder length={X - 20} position={[0, 26, -212 - (Y - 600) / 2]} rotation={[0, 0, Math.PI / 2]} */}

        <InteractiveComponent componentName="后转向机构" position={[0, -75, 105 + (Y - 600) / 2]} rotation={[0, 0, 0]} scale={10}>
          <ZhuanxiangModel />
        </InteractiveComponent>
        <InteractiveComponent componentName="前转向机构" position={[0, -75, -105 - (Y - 600) / 2]} rotation={[0, Math.PI, 0]} scale={10}>
          <ZhuanxiangModel />
        </InteractiveComponent>

        {/* <ZhuanxiangzhouModel length={80 + (X - 150) / 2 - 65} position={[25, 15, 180 + (Y - 600) / 2]} rotation={[0, 0, Math.PI / 2]} />
        <ZhuanxiangzhouModel length={80 + (X - 150) / 2 - 65} position={[25, 15, -180 - (Y - 600) / 2]} rotation={[0, 0, Math.PI / 2]} />
        <ZhuanxiangzhouModel length={-80 - (X - 150) / 2 + 65} position={[-25, 18, -180 - (Y - 600) / 2]} rotation={[0, 0, Math.PI / 2]} />
        <ZhuanxiangzhouModel length={-80 - (X - 150) / 2 + 65} position={[-25, 15, 180 + (Y - 600) / 2]} rotation={[0, 0, Math.PI / 2]} /> */}

        <InteractiveComponent componentName="方柱栏" position={[0, Math.max(dangbanhoudu / 2 + 5, 15), Y * 0.28]} scale={0.9}>
          <FangzhuanglanModel />
        </InteractiveComponent>
      </group>
    </SelectionContext.Provider>
  )
}