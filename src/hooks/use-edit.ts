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
  }, [cursor, buffer]);

  useInput((input, key) => {
    if (isHexChar(input)) {
      const value = parseInt(input, 16);
      if (isMSN) {
         const newByte = (value << 4) | (buffer[cursor] & 0x0f);
         bufferCommands.updateAtCursor(newByte);
      } else {
        const newByte = (buffer[cursor] & 0xf0) | value;
        bufferCommands.updateAtCursor(newByte);
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
        return;
      }
      case CommandChar.InsertByteAfterCursor: {
        bufferCommands.insertAfterCursor(new Uint8Array([0]));
        return;
      }
    }

    if (key.ctrl && input === 's') {
      return setAppState(AppState.Save);
    }
  }, {isActive: enabled});
}
