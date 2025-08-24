import { boundarySize } from '@/app/utils/snake';

import * as THREE from 'three';

export type { BoundaryProps };
export { makeBoundaryProps, Boundary };

interface BoundaryProps {
  position: [number, number, number];
  bounds: [number, number, number];
  isWireframe: boolean;
  color: string | number;
  side?: 0 | 2 | 1 | undefined;
};

function makeBoundaryProps(position: [number, number, number], bounds: [number, number, number] = [boundarySize, 0.1, boundarySize],
  isWireframe: boolean = true, color: string | number = 0xffffff, side: 0 | 2 | 1 | undefined = THREE.DoubleSide): BoundaryProps {
  return {
    position: position,
    bounds: bounds,
    isWireframe: isWireframe,
    color: color,
    side: side
  };
}

function Boundary({ boundProps }: { boundProps: BoundaryProps }) {
  return (
    <mesh position={boundProps.position}>
      <boxGeometry args={boundProps.bounds} />
      <meshBasicMaterial wireframe={boundProps.isWireframe} color={boundProps.color} side={boundProps.side} />
    </mesh>
  );
}