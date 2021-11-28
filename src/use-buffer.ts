import { useState } from "react"

export const useBuffer = () => {
  const [buffer, setBuffer] = useState(new Uint8Array(0));
  const [cursor, setCursor] = useState(0);

  return {
    buffer,
    setBuffer,
    cursor,
    setCursor
  };
}
