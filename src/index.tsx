#!node
import React, {useEffect, useState} from 'react';
import {render, Text, Box} from 'ink';
import * as fs from 'fs/promises';
import * as path from 'path';

import {
  AppState,
  BYTES_PER_LINE,
  HEXVIEW_H,
  SCREEN_W,
  SetStateFn,
  toHex
} from './utils';
import { InputField } from './InputField';
import { useBuffer } from './hooks/use-buffer';
import { useMovement } from './hooks/use-movement';
import { useEdit } from './hooks/use-edit';

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
    const asciiComponent = <Text>|{slice.map(byte => {
      if (byte >= 0x20 && byte < 0x7f) {
        return String.fromCharCode(byte);
      }
      return '.';
    }).join('').padEnd(BYTES_PER_LINE, '.')}|</Text>;

    lines.push(<Box key={offset}>{offsetComponent}{bytesComponent}{asciiComponent}</Box>);
  }

  return <Box flexDirection='column'>{lines}</Box>;
}

type StatusInfoProps = {
  buffer: Uint8Array;
  cursor: number;
}
const StatusInfo = ({ cursor }: StatusInfoProps) => {
  return <Text> Offset [<Text bold>{toHex(cursor, 8)}</Text>]</Text>;
}

type SaveDialogProps = {
  buffer: Uint8Array;
  setAppState: SetStateFn<AppState>;
}
const SaveDialog = ({ buffer, setAppState }: SaveDialogProps) => {
  return <InputField
    label='Filepath: '
    initialValue={inputFile}
    onEnter={filepath => {
      fs.writeFile(filepath, buffer)
        .then(() => setAppState(AppState.Edit))
        .catch(() => {
          // TODO: Handle this better
          setAppState(AppState.Edit);
        });
    }}
    onEscape={() => setAppState(AppState.Edit)}
  />;
}

const App = () => {
  const {
    buffer,
    cursor,
    offset,
    cursorCommands,
    bufferCommands,
  } = useBuffer();

  const [appState, setAppState] = useState<AppState>(AppState.Edit);

  useEffect(() => {
    fs.readFile(inputFile).then(file => {
      bufferCommands.insertAtCursor(new Uint8Array(file.buffer));
    });
  }, []);

  useMovement({
    cursorCommands,
    enabled: appState === AppState.Edit
  });

  useEdit({
    buffer,
    bufferCommands,
    cursor,
    moveCursorRight: cursorCommands.right,
    setAppState,
    enabled: appState === AppState.Edit,
  });

  return <Box flexDirection='column'>
    <HexView buffer={buffer} offset={offset} cursor={cursor} />
    <Box flexDirection='column'>
      <Text>{'-'.repeat(SCREEN_W)}</Text>
        {appState === AppState.Edit
          ? <StatusInfo buffer={buffer} cursor={cursor} />
          : <SaveDialog buffer={buffer} setAppState={setAppState} />
        }
      <Text>{'-'.repeat(SCREEN_W)}</Text>
    </Box>
  </Box>;
};

render(<App />);