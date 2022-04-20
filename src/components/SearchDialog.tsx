import React, {useState} from "react";
import { Text } from 'ink';
import { AppState, SetStateFn } from "../utils";
import { InputField } from "./InputField";

type SearchDialogProps = {
  setAppState: SetStateFn<AppState>;
  searchForSequence: (search: Uint8Array) => boolean;
}
export const SearchDialog = ({ setAppState, searchForSequence }: SearchDialogProps) => {
  const [showNotFound, setShowNotFound] = useState(false);
  return (
    <>
      {showNotFound ? <Text>Not found</Text> : null}
      <InputField
        label={`Search for bytes (hex): `}
        mask={/^([0-9a-f]*\s?)*$/}
        onChange={() => {
          if (showNotFound) {
            setShowNotFound(false);
          }
        }}
        onEnter={byteSequence => {
          const byteArray = byteSequence.split(/\s/).flatMap(n => {
            const out = [];
            let p = parseInt(n, 16);

            do {
              out.push(p & 0xff);
              p >>>= 8;
            } while (p > 255);

            return out;
          });

          if (!searchForSequence(new Uint8Array(byteArray))) {
            setShowNotFound(true);
          } else {
            setAppState(AppState.Edit);
          }
        }}
        onEscape={() => setAppState(AppState.Edit)}
      />
    </>
  );
}
