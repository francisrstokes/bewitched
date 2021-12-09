import { Box, Text, useInput } from "ink";
import React from "react";
import { AppState, SetStateFn } from "../utils";

type ErrorDialogProps = {
  error: string;
  setAppState: SetStateFn<AppState>;
}
export const ErrorDialog = ({ error, setAppState }: ErrorDialogProps) => {
  useInput((_, key) => {
    if (key.escape) {
      setAppState(AppState.Edit);
    }
  });

  return <Box>
    <Text color='red' bold>Error: </Text>
    <Text>{error}</Text>
  </Box>;
}
