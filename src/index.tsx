import React, {useEffect} from 'react';
import {render, Text, Box} from 'ink';

import * as fs from 'fs/promises';
import * as path from 'path';
import { BYTES_PER_LINE, HEXVIEW_H, SCREEN_W, toHex } from './utils';
import { useBuffer } from './hooks/use-buffer';
import { useMovement } from './hooks/use-movement';
import { useEdit } from './hooks/use-edit';
import { useSave } from './hooks/use-save';

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
  offset: number;
}
const HexView = ({ buffer, cursor, offset: startOffset }: HexViewProps) => {
  const lines: React.ReactElement[] = [];

  for (let lineNumber = 0; lineNumber < HEXVIEW_H; lineNumber++) {
    const offset = startOffset + (lineNumber * BYTES_PER_LINE);
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
    const asciiComponent = <Text>|{slice.map(byte => {
      if (byte >= 0x20 && byte < 0x7f) {
        return String.fromCharCode(byte);
      }
      return '.';
    }).join('')}|</Text>;

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
    cursor,
    offset,
    cursorCommands,
    bufferCommands,
  } = useBuffer();

  useEffect(() => {
    fs.readFile(inputFile).then(file => {
      bufferCommands.insertAtCursor(new Uint8Array(file.buffer));
    });
  }, []);

  useMovement({
    cursorCommands,
    enabled: true
  });

  useEdit({
    buffer,
    bufferCommands,
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
    <HexView buffer={buffer} offset={offset} cursor={cursor} />
    <StatusInfo buffer={buffer} cursor={cursor} />
  </Box>;
};

render(<App />);