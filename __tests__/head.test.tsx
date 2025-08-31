import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import ReactThreeTestRenderer from '@react-three/test-renderer';

import React from 'react';

import {
  ChildrenType,
  TestProps,
  checkBoxMesh,
  makeSnakeHeadProps,
} from './utils/snake';
import { Head } from '@/app/components/snake/Head';
import { CubeProps } from '@/app/components/snake/Cube';

describe('Test Snake head', () => {
  it('Renders snake head', async () => {
    const { mockRef, spy, headProps } = makeSnakeHeadProps([1, 2, 3]);
    const renderer = await ReactThreeTestRenderer.create(
      <Head headProps={headProps} />,
    );

    const checkHeadProps = (
      geometry: ChildrenType,
      material: ChildrenType,
      props: TestProps,
    ) => {
      let headProps = props as CubeProps;
      expect(headProps.ref?.current).toEqual(mockRef.current);
      expect(geometry.props.args).toEqual(headProps.dims);
    };

    checkBoxMesh(renderer, headProps, checkHeadProps);

    spy.mockRestore();
  });
});
