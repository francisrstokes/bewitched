import { Box, Text } from "ink";
import React from "react";
import { toHex } from "../utils";

type StatusInfoProps = {
  buffer: Uint8Array;
  cursor: number;
}
export const StatusInfo = ({ buffer, cursor }: StatusInfoProps) => {
  return <Box>
    <Text> Offset [<Text bold>{toHex(cursor, 8)}</Text>]</Text>
    <Text bold> ({buffer.byteLength === 0 ? '-' : buffer[cursor]})</Text>
    <Text> [<Text bold>?</Text>] Help</Text>
  </Box>;
}
