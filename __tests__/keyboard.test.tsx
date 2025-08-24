import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';

import { KeyState, KeyHandlerFn, KeyboardHandler } from '@/app/components/KeyboardHandler';

interface FireEventOpts {
    key: string,
    code: string
};

interface HandlerOpts {
    handleKeyDown: KeyHandlerFn,
    handleKeyUp: KeyHandlerFn,
    fireEventOpts: FireEventOpts,
    msg: string,
    keys: KeyState
};

function makeHandlerOpts(char: string): HandlerOpts {
    return {
        handleKeyDown: (keys: KeyState) => {
            expect(keys[char as keyof KeyState]).toBe(true);
        },
        handleKeyUp: (keys: KeyState) => {
            expect(keys[char as keyof KeyState]).toBe(false);
        },
        fireEventOpts: { key: char, code: `Key${char.toUpperCase()}` },
        msg: `${char} key`,
        keys: { w: false, a: false, s: false, d: false, shift: false }
    };
}

function runHandlerCheck(opts: HandlerOpts) {
    render(<KeyboardHandler onKeyDown={opts.handleKeyDown} onKeyUp={opts.handleKeyUp} keys={opts.keys} msg={opts.msg} />);

    fireEvent.keyDown(window, opts.fireEventOpts);
    fireEvent.keyUp(window, opts.fireEventOpts);
 
    const controlsDiv = screen.getByText(opts.msg);
    expect(controlsDiv.classList).toContain('keyboard-controls');
}

describe('Keyboard Clicks', () => {
  it('registers w key', () => {
    const opts = makeHandlerOpts('w');
    runHandlerCheck(opts);
  });

  it('registers a key', () => {    
    const opts = makeHandlerOpts('a');
    runHandlerCheck(opts);
  });

  it('registers s key', () => {    
    const opts = makeHandlerOpts('s');
    runHandlerCheck(opts);
  });

  it('registers d key', () => {    
    const opts = makeHandlerOpts('d');
    runHandlerCheck(opts);
  });

  it('registers shift key', () => {    
    const opts = makeHandlerOpts('shift');
    runHandlerCheck(opts);
  });
});
