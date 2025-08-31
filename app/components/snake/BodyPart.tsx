import { Cube, CubeProps } from '@/app/components/snake/Cube';

export { BodyPart };

function BodyPart({ bodyProps }: { bodyProps: CubeProps }) {
  return <Cube cubeProps={bodyProps} />;
}
