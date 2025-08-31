import { MutableRefObject } from 'react';
import { FrontSide, Mesh } from 'three';

export type { CubeProps };
export { makeCubeProps, Cube };

interface CubeProps {
  ref?: MutableRefObject<Mesh | null>;
  position: [number, number, number];
  dims: [number, number, number];
  color: string | number;
  isWireframe: boolean;
  side: 0 | 2 | 1 | undefined;
}

function makeCubeProps(
  position: [number, number, number],
  dim: number,
  color: string | number,
  ref?: MutableRefObject<Mesh | null>,
  isWireframe: boolean = false,
  side: 0 | 2 | 1 | undefined = FrontSide,
): CubeProps {
  return {
    ref: ref,
    position: position,
    dims: [dim, dim, dim],
    color: color,
    isWireframe: isWireframe,
    side: side,
  };
}

function Cube({ cubeProps }: { cubeProps: CubeProps }) {
  return (
    <mesh ref={cubeProps?.ref} position={cubeProps.position}>
      <boxGeometry args={cubeProps.dims} />
      <meshBasicMaterial
        wireframe={cubeProps.isWireframe}
        color={cubeProps.color}
        side={cubeProps.side}
      />
    </mesh>
  );
}
