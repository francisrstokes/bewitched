import React from "react";
import * as fs from 'fs/promises';
import { AppState, SetStateFn } from "../utils";
import { InputField } from "./InputField";
import * as path from 'path';

type SaveDialogProps = {
  buffer: Uint8Array;
  setAppState: SetStateFn<AppState>;
  openFilePath: string;
}
export const SaveDialog = ({ buffer, setAppState, openFilePath }: SaveDialogProps) => {
  return <InputField
    label='Filepath: '
    initialValue={openFilePath}
    onEnter={filepath => {
      fs.writeFile(path.resolve(filepath), buffer)
        .then(() => setAppState(AppState.Edit))
        .catch(() => {
          // TODO: Handle this better
          setAppState(AppState.Edit);
        });
    }}
    onEscape={() => setAppState(AppState.Edit)}
  />;
}
