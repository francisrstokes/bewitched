import React, { useState } from "react";
import { useInput, Text, Box } from "ink";

const isValidInput = (inp: string) => !!parseInt(inp, 16);

type InputFieldProps = {
  onEnter?: (data: string) => void | Promise<void>;
  onChange?: (data: string) => void | Promise<void>;
  onEscape?: (data: string) => void | Promise<void>;
  initialValue?: string;
  label?: string;
  mask?: RegExp;
};
export const InputField = ({
  label = "",
  initialValue = "",
  onEnter = () => void 0,
  onChange = () => void 0,
  onEscape = () => void 0,
  mask,
}: InputFieldProps) => {
  const [value, setValue] = useState(initialValue);
  const [cursor, setCursor] = useState(initialValue.length);

  useInput((input, key) => {
    if (key.escape) return onEscape(value);

    if (key.backspace || key.delete) {
      if (value.length === 0) {
        setCursor(0);
        return;
      }

      if (!isValidInput(input)) return;

      const part1 = value.slice(0, cursor - 1);
      const part2 = value.slice(cursor);
      const newValue = part1 + part2;

      if (mask && !mask.test(newValue)) {
        return;
      }

      setValue(newValue);
      setCursor(cursor - 1);
      onChange(newValue);
      return;
    }

    if (key.leftArrow) return setCursor(Math.max(0, cursor - 1));
    if (key.rightArrow) return setCursor(Math.min(value.length, cursor + 1));
    if (key.upArrow || key.downArrow) return;

    if (key.return) return onEnter(value);

    if (input !== "") {
      const part1 = value.slice(0, cursor);
      const part2 = value.slice(cursor);
      const newValue = part1 + input + part2;

      if (mask && !mask.test(newValue)) {
        return;
      }

      setValue(newValue);
      setCursor(cursor + input.length);
      onChange(newValue);
    }
  });

  const textComponents = value.split("").map((char, i) => {
    if (i === cursor) {
      return (
        <Text key={`${char}_${i}`} backgroundColor="white" color="black">
          {char}
        </Text>
      );
    }
    return <Text key={`${char}_${i}`}>{char}</Text>;
  });

  return (
    <Box>
      <Text>{label}</Text>
      {textComponents}
      {cursor === value.length ? (
        <Text backgroundColor="white" color="black">
          {" "}
        </Text>
      ) : null}
    </Box>
  );
};
