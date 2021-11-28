import React, {useState, useEffect} from 'react';
import {render, Text, Box} from 'ink';

import * as fs from 'fs/promises';
import * as path from 'path';
import { BYTES_PER_LINE, SCREEN_W, toHex } from './utils';
import { useBuffer } from './use-buffer';
import { useMovement } from './use-movement';
import { useByteEdit } from './use-byte-edit';
import { useSave } from './use-save';

if (process.argv.length < 3) {
  console.log('Usage: betwitched <input file>');
  process.exit(1);
}

const inputFile = path.isAbsolute(process.argv[2])
  ? process.argv[2]
  : path.join(process.cwd(), process.argv[2]);

type HexViewProps = {
  buffer: Uint8Array;
  cursor: number;
}
const HexView = ({ buffer, cursor }: HexViewProps) => {
  const lines: React.ReactElement[] = [];

  for (let offset = 0; offset < buffer.byteLength; offset += BYTES_PER_LINE) {
    const slice = [...buffer.slice(offset, offset + BYTES_PER_LINE)];

    const offsetComponent = <Text bold>{toHex(offset, 8)}: </Text>;
    const bytes = slice.map((byte, i) => {
      if (offset + i === cursor) {
        return <Box key={offset + i}>
          <Text backgroundColor='white' color='black'>{toHex(byte, 2)}</Text>
          <Text> </Text>
        </Box>;
      }
      return <Text key={offset + i}>{toHex(byte, 2)} </Text>;
    });
    const bytesComponent = <Box>{bytes}</Box>;
    const asciiComponent = <Text>|{
      slice.map(byte => {
        if (byte >= 0x20 && byte < 0x7f) {
          return String.fromCharCode(byte);
        }
        return '.';
      })
    }|</Text>;

    lines.push(<Box key={offset}>{offsetComponent}{bytesComponent}{asciiComponent}</Box>);
  }

  return <Box flexDirection='column'>{lines}</Box>;
}

type StatusInfoProps = {
  buffer: Uint8Array;
  cursor: number;
}
const StatusInfo = ({ buffer, cursor }: StatusInfoProps) => {
  return <Box flexDirection='column'>
    <Text>{'-'.repeat(SCREEN_W)}</Text>
    <Text> Offset [<Text bold>{toHex(cursor, 8)}</Text>]</Text>
    <Text>{'-'.repeat(SCREEN_W)}</Text>
  </Box>
}

const App = () => {
  const {
    buffer,
    setBuffer,
    cursor,
    cursorCommands
  } = useBuffer();

  useEffect(() => {
    fs.readFile(inputFile).then(file => {
      setBuffer(new Uint8Array(file.buffer));
    });
  }, []);

  useMovement({
    cursorCommands,
    enabled: true
  });

  useByteEdit({
    buffer,
    cursor,
    moveCursorRight: cursorCommands.right,
    enabled: true
  });

  useSave({
    buffer,
    outputFilepath: inputFile,
    enabled: true
  });

  return <Box flexDirection='column'>
    <HexView
      buffer={buffer}
      cursor={cursor}
    />
    <StatusInfo
      buffer={buffer}
      cursor={cursor}
    />
  </Box>;
};

render(<App />);