import { BYTES_PER_LINE, SetStateFn } from "./utils";
import {useInput} from 'ink';

type MovementParams = {
  cursor: number;
  setCursor: SetStateFn<number>;
  buffer: Uint8Array;
  enabled: boolean;
}
export const useMovement = ({cursor, setCursor, buffer, enabled}: MovementParams) => {
  useInput((_, key) => {
    if (key.leftArrow) return setCursor(Math.max(cursor - 1, 0));
    if (key.rightArrow) return setCursor(Math.min(cursor + 1, buffer.byteLength - 1));
    if (key.upArrow) return setCursor(Math.max(cursor - BYTES_PER_LINE, 0));
    if (key.downArrow) return setCursor(Math.min(cursor + BYTES_PER_LINE, buffer.byteLength - 1));
  }, {isActive: enabled});
}
