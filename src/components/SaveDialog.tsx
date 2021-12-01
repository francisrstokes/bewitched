import React from "react";
import * as fs from 'fs/promises';
import { AppState, SetStateFn } from "../utils";
import { InputField } from "./InputField";
import * as path from 'path';

type SaveDialogProps = {
  buffer: Uint8Array;
  setAppState: SetStateFn<AppState>;
  setErrorMsg: SetStateFn<string>;
  openFilePath: string;
}
export const SaveDialog = ({ buffer, setAppState, setErrorMsg, openFilePath }: SaveDialogProps) => {
  return <InputField
    label='Filepath: '
    initialValue={openFilePath}
    onEnter={filepath => {
      fs.writeFile(path.resolve(filepath), buffer)
        .then(() => setAppState(AppState.Edit))
        .catch(() => {
          setErrorMsg(`Error when saving file [${filepath}]`);
          setAppState(AppState.Error);
        });
    }}
    onEscape={() => setAppState(AppState.Edit)}
  />;
}
