import { useInput } from 'ink';
import { CursorCommands } from './use-buffer';

type MovementParams = {
  cursorCommands: CursorCommands;
  enabled: boolean;
};
export const useMovement = ({ cursorCommands, enabled }: MovementParams) => {
  useInput(
    (_, key) => {
      if (key.leftArrow) return cursorCommands.left();
      if (key.rightArrow) return cursorCommands.right();
      if (key.upArrow) return cursorCommands.up();
      if (key.downArrow) return cursorCommands.down();
    },
    { isActive: enabled }
  );
};
