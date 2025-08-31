import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import { Object3D, Object3DEventMap } from 'three';
import { ReactThreeTest } from '@react-three/test-renderer';

import React from 'react';
import { Mesh } from 'three';

import { snakeConfig } from '@/app/constants';
import { BoundaryProps } from '@/app/components/snake/Boundary';
import { makeCubeProps, CubeProps } from '@/app/components/snake/Cube';

export type { Renderer, ChildrenType, TestProps };
export { checkBoxMesh, makeSnakeHeadProps };

type Renderer = ReactThreeTest.Renderer;
type ChildrenType = ReactThreeTest.ReactThreeTestInstance<
  Object3D<Object3DEventMap>
>;
type TestProps = BoundaryProps | CubeProps;

type ComponentCheckFn = (
  geometry: ChildrenType,
  material: ChildrenType,
  props: TestProps,
) => void;

function checkBoxMesh(
  renderer: Renderer,
  props: TestProps,
  componentCallback: ComponentCheckFn,
) {
  // ✅ Check mesh position
  const mesh = renderer.scene.children[0];
  expect(mesh.type).toBe('Mesh');
  expect(mesh.props.position).toEqual(props.position);

  // ✅ Check geometry
  const geometry = mesh.allChildren[0];
  expect(geometry.type).toBe('BoxGeometry');

  // ✅ Check material
  const material = mesh.allChildren[1];
  expect(material.type).toBe('MeshBasicMaterial');
  expect(material.props.color).toEqual(props.color);

  // Check component specific props
  componentCallback(geometry, material, props);
}

function makeSnakeHeadProps(position: [number, number, number]) {
  const mockRef = {
    current: new Mesh(),
  } as React.MutableRefObject<Mesh | null>;
  const spy = jest.spyOn(React, 'useRef').mockReturnValue(mockRef);
  const headProps = makeCubeProps(
    position,
    snakeConfig.blockSize,
    snakeConfig.colors.snakeHead,
    mockRef,
  );

  return {
    mockRef: mockRef,
    spy: spy,
    headProps: headProps,
  };
}
