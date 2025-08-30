import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import { useAnimations } from '@react-three/drei';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { Group } from 'three';

import { KeyState } from '@/app/components/Controls';
import { Soldier } from '@/app/components/animation/Soldier';

const testScene = new Group();

jest.mock('@react-three/drei', () => {
  const original = jest.requireActual('@react-three/drei');
  return {
    ...original,
    useGLTF: jest.fn(() => ({
      scene: testScene,
      animations: [],
    })),
    useAnimations: jest.fn(() => ({
      actions: {},
      mixer: { stopAllAction: jest.fn(), update: jest.fn() },
    })),
  };
});

describe('Test Soldier GLB', () => {
    it('Renders Soldier without crashing', async () => {
        const keys: KeyState = { w: false, a: false, s: false, d: false, shift: false };
        const renderer = await ReactThreeTestRenderer.create(<Soldier keys={keys} gltfPath='/public/models/Soldier.glb' />);
        const soldier = renderer.scene.children[0];
        expect(soldier.type).toBe('Group');
        expect(soldier.props.object).toEqual(testScene);
        expect(soldier.props.dispose).toBeNull();
    });

    it('Renders Soldier with idle animation', async () => {
        const mockAction = { reset: jest.fn().mockReturnThis(), fadeIn: jest.fn().mockReturnThis(), play: jest.fn() };
        (useAnimations as jest.Mock).mockReturnValueOnce({
            actions: { idle: mockAction },
            mixer: { stopAllAction: jest.fn(), update: jest.fn() },
        });

        const keys: KeyState = { w: false, a: false, s: false, d: false, shift: false };
        await ReactThreeTestRenderer.create(<Soldier keys={keys} gltfPath='./models/Soldier.glb' />);
        expect(mockAction.reset).toHaveBeenCalled();
        expect(mockAction.play).toHaveBeenCalled();
    });
});
