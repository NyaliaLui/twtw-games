import { Mesh, Vector3 } from 'three';

import { snakeConfig } from '@/app/constants';

export { isBoundaryHit, getCollectedFruitSet, breakpointSM, isWindowDefined };

function isBoundaryHit(
  head: Mesh | null,
  boundaryDim: number = snakeConfig.boundarySize / 2,
  origin: Vector3 = snakeConfig.origin,
) {
  const ret = {
    pos: new Vector3(),
    isHit: false,
  };

  if (!head) return ret;

  ret.pos.copy(head.position);

  if (head.position.x < -boundaryDim) ret.pos.x = -boundaryDim;
  if (head.position.x > boundaryDim) ret.pos.x = boundaryDim;
  if (head.position.z < -(boundaryDim + -origin.z))
    ret.pos.z = -(boundaryDim + -origin.z);
  if (head.position.z > boundaryDim + origin.z)
    ret.pos.z = boundaryDim + origin.z;

  if (!ret.pos.equals(head.position)) ret.isHit = true;

  return ret;
}

function getCollectedFruitSet(
  fruits: Vector3[],
  head: Mesh | null,
  fruitSize: number = snakeConfig.blockSize,
): Set<Vector3> {
  if (!head) return new Set<Vector3>();

  return new Set<Vector3>(
    fruits.filter((fruit) => {
      return fruit.distanceTo(head.position) < fruitSize;
    }),
  );
}

// Use the same breakpoint philosophy as TailwindCSS which is based on the
// Root Element (<html>) size. https://tailwindcss.com/docs/responsive-design
function breakpointSM(width: number): boolean {
  const rootElementSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );
  return width >= snakeConfig.breakpoints.SM * rootElementSize;
}

// TODO(@NyaliaLui): Checking for undefined window seems like a hack, consider making a custom hook for window size.
function isWindowDefined(): boolean {
  return typeof window !== 'undefined';
}
