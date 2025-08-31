import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import ReactThreeTestRenderer from '@react-three/test-renderer';

import React from 'react';
import { Mesh, Vector3 } from 'three';

import {
  ChildrenType,
  TestProps,
  checkBoxMesh,
  makeSnakeHeadProps,
} from './utils/snake';
import { Head } from '@/app/components/snake/Head';
import { Fruit } from '@/app/components/snake/Fruit';
import { getCollectedFruitSet } from '@/app/utils';
import { snakeConfig } from '@/app/constants';
import { makeCubeProps, CubeProps } from '@/app/components/snake/Cube';

function makeFruitProps(position: [number, number, number]): CubeProps {
  return makeCubeProps(
    position,
    snakeConfig.blockSize,
    snakeConfig.colors.fruit,
  );
}

describe('Test Snake fruit', () => {
  it('Renders fruit', async () => {
    const fruitProps = makeFruitProps([1, 2, 3]);
    const renderer = await ReactThreeTestRenderer.create(
      <Fruit key={0} fruitProps={fruitProps} />,
    );

    const specificFruitProps = (
      geometry: ChildrenType,
      material: ChildrenType,
      props: TestProps,
    ) => {
      let fruitProps = props as CubeProps;
      expect(geometry.props.args).toEqual(fruitProps.dims);
    };

    checkBoxMesh(renderer, fruitProps, specificFruitProps);
  });

  it('Should register fruit collision', async () => {
    const testFruits = [
      new Vector3(
        snakeConfig.origin.x,
        snakeConfig.origin.y,
        snakeConfig.origin.z + snakeConfig.blockSize * 2,
      ),
    ];
    const { spy, headProps } = makeSnakeHeadProps([
      testFruits[0].x,
      testFruits[0].y,
      testFruits[0].z,
    ]);
    await ReactThreeTestRenderer.create(<Head headProps={headProps} />);

    const checkFruitCollision = (
      fruits: Vector3[],
      head: Mesh | null,
      expectedSize: number,
      hasFruit: boolean,
    ) => {
      const collectedFruitSet: Set<Vector3> = getCollectedFruitSet(
        fruits,
        head,
      );
      expect(collectedFruitSet.size).toEqual(expectedSize);
      expect(collectedFruitSet.has(fruits[0])).toBe(hasFruit);
    };

    // This should not happen, but if it does, there is something terribly wrong.
    if (!headProps.ref?.current) fail('HeadProps reference is null');

    // Fruit collision occurs
    checkFruitCollision(testFruits, headProps.ref.current, 1, true);

    // Null head
    checkFruitCollision(testFruits, null, 0, false);

    // No fruit collision occurs
    headProps.ref.current.position.z = snakeConfig.origin.z;
    checkFruitCollision(testFruits, headProps.ref.current, 0, false);

    spy.mockRestore();
  });
});
