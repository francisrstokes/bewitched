import { useState } from "react"
import { BYTES_PER_LINE } from "./utils";

export type CursorCommands = {
  left: () => void;
  right: () => void;
  up: () => void;
  down: () => void;
};

export const useBuffer = () => {
  const [buffer, setBuffer] = useState(new Uint8Array(0));
  const [cursor, setCursor] = useState(0);

  const cursorCommands: CursorCommands = {
    left: () => setCursor(Math.max(0, cursor - 1)),
    up: () => setCursor(Math.max(0, cursor - BYTES_PER_LINE)),
    right: () => setCursor(Math.min(buffer.byteLength - 1, cursor + 1)),
    down: () => setCursor(Math.min(buffer.byteLength - 1, cursor + BYTES_PER_LINE)),
  }

  return {
    buffer,
    setBuffer,
    cursor,
    setCursor,
    cursorCommands
  };
}
