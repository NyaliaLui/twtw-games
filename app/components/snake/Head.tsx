import { Cube, CubeProps } from '@/app/components/snake/Cube';

export { Head };

function Head({ headProps }: { headProps: CubeProps }) {
  return <Cube cubeProps={headProps} />;
}
