import { snakeConfig } from '@/app/constants';

export type { BodyProps };
export { makeBodyProps, BodyPart };

interface BodyProps {
  position: [number, number, number];
  dim: number;
  color: string | number;
}

function makeBodyProps(
  position: [number, number, number],
  dim: number = snakeConfig.blockSize,
  color: string | number = 0x00aa00,
): BodyProps {
  return {
    position: position,
    dim: dim,
    color: color,
  };
}

function BodyPart({ bodyProps }: { bodyProps: BodyProps }) {
  return (
    <mesh position={bodyProps.position}>
      <boxGeometry args={[bodyProps.dim, bodyProps.dim, bodyProps.dim]} />
      <meshBasicMaterial color={bodyProps.color} />
    </mesh>
  );
}
