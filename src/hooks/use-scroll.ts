import { useEffect, useRef } from 'react';
import * as Blessed from 'blessed';
import { CursorCommands } from './use-buffer';

type ScrollParams = {
  cursorCommands: CursorCommands;
  enabled: boolean;
};

// in milli seconds.
const DEBOUNCE_DURATION = 100;

export const useScroll = ({ cursorCommands, enabled }: ScrollParams) => {
  const isDebouncedUp = useRef(false);
  const isDebouncedDown = useRef(false);

  useEffect(() => {
    const debouncedUp = () => {
      if (!enabled) return;
      if (isDebouncedUp.current) return;
      cursorCommands.up();
      isDebouncedUp.current = true;
      setTimeout(() => (isDebouncedUp.current = false), DEBOUNCE_DURATION);
    };

    const debouncedDown = () => {
      if (!enabled) return;
      if (isDebouncedDown.current) return;
      cursorCommands.down();
      isDebouncedDown.current = true;
      setTimeout(() => (isDebouncedDown.current = false), DEBOUNCE_DURATION);
    };

    const program = Blessed.program();
    program.enableMouse();
    program.on('mouse', (event: any) => {
      switch (event.action) {
        case 'wheelup':
          debouncedUp();
          break;
        case 'wheeldown':
          debouncedDown();
          break;
        default:
          break;
      }
    });

    return () => {
      program.disableMouse();
      program.destroy();
    };
  }, [cursorCommands, enabled]);
};
