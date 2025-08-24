import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import * as THREE from 'three';

import { World, GroundDim } from '@/app/components/animation/World';

const testTexture = new THREE.Texture();
testTexture.wrapS = testTexture.wrapT = THREE.RepeatWrapping;

jest.mock('@react-three/drei', () => {
  const original = jest.requireActual('@react-three/drei');
  return {
    ...original,
    useTexture: jest.fn(() => {
      return testTexture;
    }),
  };
});

describe('Test Ground and Sky', () => {
    it('Renders ground and sky', async () => {
        const renderer = await ReactThreeTestRenderer.create(<World />);
        const mesh = renderer.scene.children[0];
        expect(mesh.type).toBe('Mesh');
        expect(mesh.props['rotation-x']).toEqual(-Math.PI / 2);
        expect(mesh.props.receiveShadow).toBe(true);

        const plane = mesh.allChildren[0];
        expect(plane.type).toBe('PlaneGeometry');
        expect(plane.props.args).toEqual([GroundDim, GroundDim]);

        const material = mesh.allChildren[1];
        expect(material.type).toBe('MeshStandardMaterial');
        expect(material.props.map).toEqual(testTexture);
    });
});
