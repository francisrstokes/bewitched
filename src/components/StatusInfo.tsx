import { Box, Text, useInput } from "ink";
import React from "react";
import { AlternateAddressViewMode, SetStateFn, toHex } from "../utils";

const toDecimal = (n: number, l = 8) => n.toString().padStart(l, ' ');

type StatusInfoProps = {
  buffer: Uint8Array;
  cursor: number;
  alternateAddressMode: AlternateAddressViewMode;
  setAlternateAddressMode: SetStateFn<AlternateAddressViewMode>;
}
export const StatusInfo = ({
  buffer,
  cursor,
  alternateAddressMode,
  setAlternateAddressMode
}: StatusInfoProps) => {

  useInput(input => {
    if (input === 'v') {
      if (alternateAddressMode === AlternateAddressViewMode.Hex) {
        setAlternateAddressMode(AlternateAddressViewMode.Decimal);
      } else {
        setAlternateAddressMode(AlternateAddressViewMode.Hex);
      }
    }
  });

  const formatFn = alternateAddressMode === AlternateAddressViewMode.Hex
    ? toHex
    : toDecimal;

  return <Box>
    <Text> Offset [<Text bold>{formatFn(cursor, 8)}</Text>]</Text>
    <Text bold> ({buffer.byteLength === 0 ? '-' : buffer[cursor]})</Text>
    <Text> [<Text bold>?</Text>] Help</Text>
  </Box>;
}
