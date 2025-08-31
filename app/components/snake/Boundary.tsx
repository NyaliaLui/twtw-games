'use client';
import { snakeConfig } from '@/app/constants';
import { Cube } from '@/app/components/snake/Cube';

import { DoubleSide } from 'three';

export type { BoundaryProps };
export { makeBoundaryProps, Boundary };

interface BoundaryProps {
  position: [number, number, number];
  dims: [number, number, number];
  color: string | number;
  isWireframe: boolean;
  side: 0 | 2 | 1 | undefined;
}

function makeBoundaryProps(
  position: [number, number, number],
  dims: [number, number, number] = [
    snakeConfig.boundarySize,
    0.1,
    snakeConfig.boundarySize,
  ],
  color: string | number = snakeConfig.colors.boundary,
  isWireframe: boolean = true,
  side: 0 | 2 | 1 | undefined = DoubleSide,
): BoundaryProps {
  return {
    position: position,
    dims: dims,
    color: color,
    isWireframe: isWireframe,
    side: side,
  };
}

function Boundary({ boundProps }: { boundProps: BoundaryProps }) {
  return <Cube cubeProps={boundProps} />;
}
