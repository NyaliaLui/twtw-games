import { snakeConfig } from '@/app/constants';

export type { FruitProps };
export { makeFruitProps, Fruit };

interface FruitProps {
  position: [number, number, number];
  dim: number;
  color: string | number;
}

function makeFruitProps(
  position: [number, number, number],
  dim: number = snakeConfig.blockSize,
  color: string | number = 0xff0000,
): FruitProps {
  return {
    position: position,
    dim: dim,
    color: color,
  };
}

function Fruit({ fruitProps }: { fruitProps: FruitProps }) {
  return (
    <mesh position={fruitProps.position}>
      <boxGeometry args={[fruitProps.dim, fruitProps.dim, fruitProps.dim]} />
      <meshBasicMaterial color={fruitProps.color} />
    </mesh>
  );
}
