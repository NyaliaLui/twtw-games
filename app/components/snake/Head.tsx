import { snakeConfig } from "@/app/constants";

import { MutableRefObject } from "react";
import { Mesh } from 'three';

export type { HeadProps };
export { makeHeadProps, Head };

interface HeadProps {
  ref: MutableRefObject<Mesh | null>;
  position: [number, number, number];
  dim: number;
  color: string | number;
};

function makeHeadProps(ref: MutableRefObject<Mesh | null>, position: [number, number, number],
  dim: number = snakeConfig.blockSize, color: string | number = 0x00ff00): HeadProps {
  return {
    ref: ref,
    position: position,
    dim: dim,
    color: color
  };
}

function Head({ headProps }: { headProps: HeadProps }) {
  return (
    <mesh ref={headProps.ref} position={headProps.position}>
      <boxGeometry args={[headProps.dim, headProps.dim, headProps.dim]} />
      <meshBasicMaterial color={headProps.color} />
    </mesh>
  );
}