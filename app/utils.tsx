import * as THREE from 'three';

export { 
  boundarySize,
  halfBoundary,
  blockSize,
  gameOrigin,
  isBoundaryHit,
  getCollectedFruitSet,
  breakpointSM,
  isWindowDefined
};

const boundarySize = 1000;
const halfBoundary = boundarySize / 2;
const blockSize = 20;
const gameOrigin = new THREE.Vector3(0, 0, 0);

function isBoundaryHit(head: THREE.Mesh | null, boundaryDim: number = halfBoundary, origin: THREE.Vector3 = gameOrigin) {
  const ret = {
    pos: new THREE.Vector3(),
    isHit: false
  };

  if (!head) return ret;

  ret.pos.copy(head.position);

  if (head.position.x < -boundaryDim) ret.pos.x = -boundaryDim;
  if (head.position.x > boundaryDim) ret.pos.x = boundaryDim;
  if (head.position.z < -(boundaryDim + -origin.z)) ret.pos.z = -(boundaryDim + -origin.z);
  if (head.position.z > (boundaryDim + origin.z)) ret.pos.z = (boundaryDim + origin.z);

  if (!ret.pos.equals(head.position)) ret.isHit = true;

  return ret;
}

function getCollectedFruitSet(fruits: THREE.Vector3[], head: THREE.Mesh | null, fruitSize: number = blockSize): Set<THREE.Vector3> {
  if (!head) return new Set<THREE.Vector3>();

  return new Set<THREE.Vector3>(fruits.filter((fruit) => {
    return fruit.distanceTo(head.position) < fruitSize;
  }));
}

// Use the same breakpoint philosophy as TailwindCSS which is based on the
// Root Element (<html>) size. https://tailwindcss.com/docs/responsive-design
function breakpointSM(width: number): boolean {
  const rootElementSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return width >= (40 * rootElementSize);
}

// TODO(@NyaliaLui): Checking for undefined window seems like a hack, consider making a custom hook for window size.
function isWindowDefined(): boolean {
  return typeof window !== 'undefined';
}