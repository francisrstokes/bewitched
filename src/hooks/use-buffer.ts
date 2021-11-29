import { useState } from "react"
import { BYTES_PER_LINE, HEXVIEW_H } from "../utils";

export type CursorCommands = {
  left: () => void;
  right: () => void;
  up: () => void;
  down: () => void;
};

export type BufferCommands = {
  insertAtCursor: (bytes: Uint8Array) => void;
  insertAfterCursor: (bytes: Uint8Array) => void;
  delete: () => void;
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
      if (buffer.byteLength === 0) return;
      const newValue = Math.max(0, cursor - 1);
      setCursor(newValue);
      if (!cursorIsVisible(newValue, offset)) {
        setOffset(Math.max(0, offset - BYTES_PER_LINE));
      }
    },
    up: () => {
      if (buffer.byteLength === 0) return;
      const newValue = Math.max(0, cursor - BYTES_PER_LINE);
      setCursor(newValue);
      if (!cursorIsVisible(newValue, offset)) {
        setOffset(Math.max(0, offset - BYTES_PER_LINE));
      }
    },
    right: () => {
      if (buffer.byteLength === 0) return;
      const newValue = Math.min(buffer.byteLength - 1, cursor + 1);
      setCursor(newValue);
      if (!cursorIsVisible(newValue, offset)) {
        setOffset(Math.min(Math.max(0, buffer.byteLength - 1), offset + BYTES_PER_LINE));
      }
    },
    down: () => {
      if (buffer.byteLength === 0) return;
      const newValue = Math.min(buffer.byteLength - 1, cursor + BYTES_PER_LINE);
      setCursor(newValue);
      if (!cursorIsVisible(newValue, offset)) {
        setOffset(Math.min(buffer.byteLength - 1, offset + BYTES_PER_LINE));
      }
    },
  };

  const insertAtCursor = (bytes: Uint8Array) => {
    const newSize = buffer.byteLength + bytes.byteLength;
    const newBuffer = new Uint8Array(newSize);

    newBuffer.set(buffer.slice(0, cursor), 0);
    newBuffer.set(bytes, cursor);
    newBuffer.set(buffer.slice(cursor + bytes.byteLength - 1), cursor + bytes.byteLength);

    setBuffer(newBuffer);
  };

  const insertAfterCursor = (bytes: Uint8Array) => {
    const newSize = buffer.byteLength + bytes.byteLength;
    const newBuffer = new Uint8Array(newSize);

    newBuffer.set(buffer.slice(0, cursor + 1), 0);
    newBuffer.set(bytes, cursor + 1);
    newBuffer.set(buffer.slice(cursor + bytes.byteLength), cursor + bytes.byteLength + 1);

    setBuffer(newBuffer);
  };

  const deleteByte = () => {
    if (buffer.byteLength === 0) return;

    const newSize = buffer.byteLength - 1;
    const newBuffer = new Uint8Array(newSize);

    newBuffer.set(buffer.slice(0, cursor), 0);
    newBuffer.set(buffer.slice(cursor + 1), cursor);

    setBuffer(newBuffer);
    setCursor(Math.max(0, Math.min(newSize-1, cursor)));
  };

  const jumpToOffset = (jumpOffset: number) => {
    if (jumpOffset < 0 || !Number.isInteger(jumpOffset) || buffer.byteLength === 0) return;
    setOffset(Math.min(buffer.byteLength - 1, jumpOffset) & 0xfffffff0);
    setCursor(Math.min(buffer.byteLength - 1, jumpOffset));
  };

  const bufferCommands: BufferCommands = {
    insertAtCursor,
    insertAfterCursor,
    delete: deleteByte
  };

  return {
    buffer,
    setBuffer,
    cursor,
    setCursor,
    cursorCommands,
    bufferCommands,
    offset,
    jumpToOffset,
  };
}
