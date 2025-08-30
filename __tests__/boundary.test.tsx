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
import {
  BoundaryProps,
  makeBoundaryProps,
  Boundary,
} from '@/app/components/snake/Boundary';
import { isBoundaryHit } from '@/app/utils';
import { snakeConfig } from '@/app/constants';

const halfBoundary = snakeConfig.boundarySize / 2;

describe('Test Snake boundaries', () => {
  it('Renders game boundaries', async () => {
    const boundProps = makeBoundaryProps([1, 2, 3]);
    const renderer = await ReactThreeTestRenderer.create(
      <Boundary boundProps={boundProps} />,
    );

    const specificBoundaryProps = (
      geometry: ChildrenType,
      material: ChildrenType,
      props: TestProps,
    ) => {
      let boundProps = props as BoundaryProps;
      expect(geometry.props.args).toEqual(boundProps.bounds);
      expect(material.props.wireframe).toBe(boundProps.isWireframe);
      expect(material.props.side).toEqual(boundProps.side);
    };

    checkBoxMesh(renderer, boundProps, specificBoundaryProps);
  });

  it('Should register boundary collision', async () => {
    const { spy, headProps } = makeSnakeHeadProps([
      snakeConfig.origin.x,
      snakeConfig.origin.y,
      snakeConfig.origin.z,
    ]);
    await ReactThreeTestRenderer.create(<Head headProps={headProps} />);

    const checkBoundary = (
      head: Mesh | null,
      expectedPos: Vector3,
      expectedIsHit: boolean,
    ) => {
      const { pos, isHit } = isBoundaryHit(head);
      expect(pos).toEqual(expectedPos);
      expect(isHit).toBe(expectedIsHit);
    };

    // This should not happen, but if it does, there is something terribly wrong.
    if (!headProps.ref.current) fail('HeadProps reference is null');

    // No boundary is hit
    checkBoundary(headProps.ref.current, headProps.ref.current.position, false);

    // Null head
    checkBoundary(null, new Vector3(), false);

    const originalPos = headProps.ref.current.position.clone();
    const expectedPos = headProps.ref.current.position.clone();

    // Top Boundary
    headProps.ref.current.position.x = -halfBoundary - 1;
    expectedPos.x = -halfBoundary;
    checkBoundary(headProps.ref.current, expectedPos, true);

    // Bottom Boundary
    headProps.ref.current.position.x = halfBoundary + 1;
    expectedPos.x = halfBoundary;
    checkBoundary(headProps.ref.current, expectedPos, true);

    headProps.ref.current.position.x = originalPos.x;
    expectedPos.x = originalPos.x;

    // Left Boundary
    headProps.ref.current.position.z =
      -(halfBoundary + -snakeConfig.origin.z) - 1;
    expectedPos.z = -(halfBoundary + -snakeConfig.origin.z);
    checkBoundary(headProps.ref.current, expectedPos, true);

    // Right Boundary
    headProps.ref.current.position.z = halfBoundary + snakeConfig.origin.z + 1;
    expectedPos.z = halfBoundary + snakeConfig.origin.z;
    checkBoundary(headProps.ref.current, expectedPos, true);

    spy.mockRestore();
  });
});
