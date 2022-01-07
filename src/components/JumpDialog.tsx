import React, {useState} from "react";
import { AppState, SetStateFn } from "../utils";
import { InputField } from "./InputField";

type JumpDialogProps = {
  setAppState: SetStateFn<AppState>;
  jumpToOffsset: (jumpOffset: number) => void;
}
export const JumpDialog = ({ setAppState, jumpToOffsset }: JumpDialogProps) => {
  const [isHex, setIsHex] = useState(false);
  return <InputField
    label={`Jump to (${isHex ? 'hex' : 'decimal'}): `}
    mask={/^(0x[0-9a-f]*|[0-9]*)$/}
    onChange={address => {
      setIsHex(address.startsWith('0x'));
    }}
    onEnter={address => {
      if (address.startsWith('0x')) {
        if (address.length > 2) jumpToOffsset(parseInt(address, 16));
      } else if (address.length) {
        jumpToOffsset(Number(address));
      }
      setAppState(AppState.Edit);
    }}
    onEscape={() => setAppState(AppState.Edit)}
  />;
}
