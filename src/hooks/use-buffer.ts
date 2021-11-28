import { useState } from "react"
import { BYTES_PER_LINE, HEXVIEW_H } from "../utils";

export type CursorCommands = {
  left: () => void;
  right: () => void;
  up: () => void;
  down: () => void;
};

const cursorIsVisible = (cursor: number, offset: number) => (
  cursor >= offset && cursor < (offset + HEXVIEW_H * BYTES_PER_LINE)
);

export const useBuffer = () => {
  const [buffer, setBuffer] = useState(new Uint8Array(0));
  const [cursor, setCursor] = useState(0);
  const [offset, setOffset] = useState(0);

  const cursorCommands: CursorCommands = {
    left: () => {
      const newValue = Math.max(0, cursor - 1);
      setCursor(newValue);
      if (!cursorIsVisible(newValue, offset)) {
        setOffset(offset - BYTES_PER_LINE);
      }
    },
    up: () => {
      const newValue = Math.max(0, cursor - BYTES_PER_LINE);
      setCursor(newValue);
      if (!cursorIsVisible(newValue, offset)) {
        setOffset(offset - BYTES_PER_LINE);
      }
    },
    right: () => {
      const newValue = Math.min(buffer.byteLength - 1, cursor + 1);
      setCursor(newValue);
      if (!cursorIsVisible(newValue, offset)) {
        setOffset(offset + BYTES_PER_LINE);
      }
    },
    down: () => {
      const newValue = Math.min(buffer.byteLength - 1, cursor + BYTES_PER_LINE);
      setCursor(newValue);
      if (!cursorIsVisible(newValue, offset)) {
        setOffset(offset + BYTES_PER_LINE);
      }
    },
  };

  return {
    buffer,
    setBuffer,
    cursor,
    setCursor,
    cursorCommands,
    offset,
  };
}
