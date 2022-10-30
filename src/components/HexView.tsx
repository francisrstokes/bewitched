import React from "react";
import { Box, Text } from "ink";
import { BYTES_PER_LINE, HEXVIEW_H, toHex } from "../utils";

type HexViewProps = {
  buffer: Uint8Array;
  cursor: number;
  offset: number;
}
export const HexView = ({ buffer, cursor, offset: startOffset }: HexViewProps) => {
  const lines: React.ReactElement[] = [];

  for (let lineNumber = 0; lineNumber < HEXVIEW_H; lineNumber++) {
    const offset = startOffset + (lineNumber * BYTES_PER_LINE);
    const slice = [...buffer.slice(offset, offset + BYTES_PER_LINE)];

    const offsetComponent = <Text bold>{toHex(offset, 8)}: </Text>;
    const bytes = slice.map((byte, i) => {
      const spacing = ((i + 1) % 4 === 0) ? '  ' : ' ';
      if (offset + i === cursor) {
        return <Box key={offset + i}>
          <Text backgroundColor='white' color='black'>{toHex(byte, 2)}</Text>
          <Text>{spacing}</Text>
        </Box>;
      }
      return <Text key={offset + i}>{toHex(byte, 2)}{spacing}</Text>;
    });

    if (bytes.length < BYTES_PER_LINE) {
      const wordSpaces = 4 - Math.floor(bytes.length / 4);
      const diff = BYTES_PER_LINE - bytes.length;
      const padding = <Text key='padding'>{'   '.repeat(diff)}{' '.repeat(wordSpaces)}</Text>;
      bytes.push(padding);
    }

    const bytesComponent = <Box>{bytes}</Box>;
    const asciiComponent = <Box>
      <Text>|</Text>
      {slice.map((byte, i) => {
        const char = (byte >= 0x20 && byte < 0x7f)
          ? String.fromCharCode(byte)
          : '.';

        if (offset + i === cursor) {
          return <Text backgroundColor='white' color='black'>{char}</Text>
        }
        return <Text>{char}</Text>
      })}
      <Text>|</Text>
    </Box>;

    lines.push(<Box key={offset}>{offsetComponent}{bytesComponent}{asciiComponent}</Box>);
  }

  return <Box flexDirection='column'>{lines}</Box>;
}
