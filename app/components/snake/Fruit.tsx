import { Cube, CubeProps } from '@/app/components/snake/Cube';

export { Fruit };

function Fruit({ fruitProps }: { fruitProps: CubeProps }) {
  return <Cube cubeProps={fruitProps} />;
}
