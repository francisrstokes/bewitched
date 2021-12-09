import { useInput } from 'ink';
import { useEffect, useState } from "react";
import { AppState, SetStateFn } from '../utils';
import { BufferCommands } from './use-buffer';

const hexRegex = /[0-9a-f]/;
const isHexChar = (char: string) => hexRegex.test(char);

enum CommandChar {
  InsertByteAtCursor    = 'i',
  InsertByteAfterCursor = 'I',
}

type EditParams = {
  cursor: number;
  buffer: Uint8Array;
  bufferCommands: BufferCommands;
  moveCursorRight: () => void;
  setAppState: SetStateFn<AppState>;
  enabled: boolean;
}
export const useEdit = ({
  cursor,
  moveCursorRight,
  bufferCommands,
  buffer,
  setAppState,
  enabled
}: EditParams) => {
  const [isMSN, setIsMSN] = useState(true);

  useEffect(() => {
    setIsMSN(true);
  }, [cursor]);

  useInput((input, key) => {
    if (isHexChar(input)) {
      const value = parseInt(input, 16);
      if (isMSN) {
        buffer[cursor] = (value << 4) | (buffer[cursor] & 0x0f);
      } else {
        buffer[cursor] = (buffer[cursor] & 0xf0) | value;
        moveCursorRight();
      }
      setIsMSN(!isMSN);
      return;
    }

    if (input === '?') {
      return setAppState(AppState.Help);
    }

    if (input === 'j') {
      return setAppState(AppState.Jump);
    }

    if (key.delete || key.backspace) {
      bufferCommands.delete();
      return;
    }

    switch (input) {
      case CommandChar.InsertByteAtCursor: {
        bufferCommands.insertAtCursor(new Uint8Array([0]));
        setIsMSN(true);
        return;
      }
      case CommandChar.InsertByteAfterCursor: {
        bufferCommands.insertAfterCursor(new Uint8Array([0]));
        setIsMSN(true);
        return;
      }
    }

    if (key.ctrl && input === 's') {
      return setAppState(AppState.Save);
    }
  }, {isActive: enabled});
}
