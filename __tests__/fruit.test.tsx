import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import ReactThreeTestRenderer from '@react-three/test-renderer';

import React from 'react';
import * as THREE from 'three';

import { ChildrenType, TestProps, checkBoxMesh, makeSnakeHeadProps } from './utils/snake';
import { Head } from '@/app/components/snake/Head';
import { FruitProps, makeFruitProps, Fruit } from '@/app/components/snake/Fruit';
import { blockSize, gameOrigin, getCollectedFruitSet } from '@/app/utils/snake';

describe('Test Snake fruit', () => {
    it('Renders fruit', async () => {
        const fruitProps = makeFruitProps([1, 2, 3]);
        const renderer = await ReactThreeTestRenderer.create(<Fruit key={0} fruitProps={fruitProps} />);

        const specificFruitProps = (geometry: ChildrenType, material: ChildrenType, props: TestProps) => {
            let fruitProps = props as FruitProps;
            expect(geometry.props.args).toEqual(new Array(3).fill(fruitProps.dim));
        };

        checkBoxMesh(renderer, fruitProps, specificFruitProps);
    });

    it('Should register fruit collision', async () => {
        const testFruits = [new THREE.Vector3(gameOrigin.x, gameOrigin.y, gameOrigin.z + (blockSize*2))];
        const { spy, headProps} = makeSnakeHeadProps([testFruits[0].x, testFruits[0].y, testFruits[0].z]);
        await ReactThreeTestRenderer.create(<Head headProps={headProps} />);

        const checkFruitCollision = (fruits: THREE.Vector3[], head: THREE.Mesh | null, expectedSize: number, hasFruit: boolean) => {
            const collectedFruitSet: Set<THREE.Vector3> = getCollectedFruitSet(fruits, head);
            expect(collectedFruitSet.size).toEqual(expectedSize);
            expect(collectedFruitSet.has(fruits[0])).toBe(hasFruit);
        };

        // This should not happen, but if it does, there is something terribly wrong.
        if (!headProps.ref.current) fail('HeadProps reference is null');

        // Fruit collision occurs
        checkFruitCollision(testFruits, headProps.ref.current, 1, true);

        // Null head
        checkFruitCollision(testFruits, null, 0, false);

        // No fruit collision occurs
        headProps.ref.current.position.z = gameOrigin.z;
        checkFruitCollision(testFruits, headProps.ref.current, 0, false);

        spy.mockRestore();
    });
});