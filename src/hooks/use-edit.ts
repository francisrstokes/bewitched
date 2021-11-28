import {useInput} from 'ink';
import { useState } from "react";
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
  enabled: boolean;
}
export const useEdit = ({cursor, moveCursorRight, bufferCommands, buffer, enabled}: EditParams) => {
  const [isMSN, setIsMSN] = useState(true);
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

    if (key.leftArrow || key.rightArrow || key.upArrow || key.downArrow) {
      setIsMSN(true);
      return;
    }

    if (key.delete || key.backspace) {
      return bufferCommands.delete();
    }

    switch (input) {
      case CommandChar.InsertByteAtCursor: return bufferCommands.insertAtCursor(new Uint8Array([0]));
      case CommandChar.InsertByteAfterCursor: return bufferCommands.insertAfterCursor(new Uint8Array([0]));
    }
  }, {isActive: enabled});
}
