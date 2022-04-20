import React from "react";
import { Box, Text, useInput } from "ink";

type HelpScreenProps = { exit: () => void; }
export const HelpScreen = ({ exit }: HelpScreenProps) => {
  useInput((_, key) => {
    if (key.escape) {
      exit();
    }
  });

  const helpItems: Array<[string, string]> = [
    ['←↑↓→         ', ' Move the cursor'],
    ['[a-f0-9]     ', ' Edit the currently selected byte'],
    ['Del/Backspace', ' Delete the currently selected byte'],
    ['/            ', ' Search for the next occurrence of a byte sequence'],
    ['i            ', ' Insert a zero byte before the cursor'],
    ['I            ', ' Insert a zero byte after the cursor'],
    ['j            ', ' Jump to a specific offset in the file'],
    ['v            ', ' Switch the address display in the status line between hex'],
    ['             ', ' and decimal'],
    ['Ctrl+S       ', ' Save this file'],
    ['Esc          ', ' Exit any menu'],
    ['?            ', ' Show this help menu'],
  ];

  return <Box
    flexDirection='column'
    height={25}
    width={80}
    borderStyle='doubleSingle'
    paddingLeft={1}
    paddingRight={1}
  >
    <Box justifyContent='center' paddingBottom={2}>
      <Text bold underline>Bewitched :: Help</Text>
    </Box>

    {helpItems.map(([key, text]) => (
      <Box key={key}>
        <Text bold>{key}</Text>
        <Text>{text}</Text>
      </Box>
    ))}
  </Box>;
}
