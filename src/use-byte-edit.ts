import { SetStateFn } from "./utils";
import {useInput} from 'ink';
import { useState } from "react";

const hexRegex = /[0-9a-f]/;
const isHexChar = (char: string) => hexRegex.test(char);

type ByteEditParams = {
  cursor: number;
  buffer: Uint8Array;
  moveCursorRight: () => void;
  enabled: boolean;
}
export const useByteEdit = ({cursor, moveCursorRight, buffer, enabled}: ByteEditParams) => {
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
    }
  }, {isActive: enabled});
}
