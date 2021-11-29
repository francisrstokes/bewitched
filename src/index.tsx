#!node
import React, {useEffect, useState} from 'react';
import {render, Text, Box} from 'ink';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AppState, SCREEN_W } from './utils';
import { useBuffer } from './hooks/use-buffer';
import { useMovement } from './hooks/use-movement';
import { useEdit } from './hooks/use-edit';
import { HexView } from './components/HexView';
import { HelpScreen } from './components/HelpScreen';
import { SaveDialog } from './components/SaveDialog';
import { StatusInfo } from './components/StatusInfo';
import { JumpDialog } from './components/JumpDialog';

if (process.argv.length < 3) {
  console.log('Usage: betwitched <input file>');
  process.exit(1);
}

const inputFile = path.isAbsolute(process.argv[2])
  ? process.argv[2]
  : path.join(process.cwd(), process.argv[2]);

const App = () => {
  const {
    buffer,
    cursor,
    offset,
    cursorCommands,
    bufferCommands,
    jumpToOffset
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

  return appState === AppState.Help ? <HelpScreen exit={() => setAppState(AppState.Edit)} /> : (
    <Box flexDirection='column'>
      <HexView buffer={buffer} offset={offset} cursor={cursor} />
      <Box flexDirection='column'>
        <Text>{'-'.repeat(SCREEN_W)}</Text>
          {
              appState === AppState.Edit
              ? <StatusInfo buffer={buffer} cursor={cursor} />
            : appState === AppState.Save
              ?<SaveDialog buffer={buffer} openFilePath={inputFile} setAppState={setAppState} />
            : appState === AppState.Jump
              ? <JumpDialog jumpToOffsset={jumpToOffset} setAppState={setAppState} />
            : null
          }
        <Text>{'-'.repeat(SCREEN_W)}</Text>
      </Box>
    </Box>
  );
};

render(<App />);