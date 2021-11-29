import React from "react";
import { AppState, SetStateFn } from "../utils";
import { InputField } from "./InputField";

type JumpDialogProps = {
  setAppState: SetStateFn<AppState>;
  jumpToOffsset: (jumpOffset: number) => void;
}
export const JumpDialog = ({ setAppState, jumpToOffsset }: JumpDialogProps) => {
  return <InputField
    label='Jump to (hex): '
    mask={/^[0-9a-f]*$/}
    onEnter={address => {
      jumpToOffsset(parseInt(address, 16));
      setAppState(AppState.Edit);
    }}
    onEscape={() => setAppState(AppState.Edit)}
  />;
}
