import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import ReactThreeTestRenderer from '@react-three/test-renderer';

import React from 'react';

import { ChildrenType, TestProps, checkBoxMesh, makeSnakeHeadProps } from '@/testutils/snake';
import { HeadProps, Head } from '@/app/components/snake/Head';

describe('Test Snake head', () => {
    it('Renders snake head', async () => {
        const { mockRef, spy, headProps } = makeSnakeHeadProps([1, 2, 3]);
        const renderer = await ReactThreeTestRenderer.create(<Head headProps={headProps} />);

        const checkHeadProps = (geometry: ChildrenType, material: ChildrenType, props: TestProps) => {
            let headProps = props as HeadProps;
            expect(headProps.ref.current).toEqual(mockRef.current);
            expect(geometry.props.args).toEqual(new Array(3).fill(headProps.dim));
        };

        checkBoxMesh(renderer, headProps, checkHeadProps);

        spy.mockRestore();
    });
});