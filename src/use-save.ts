import {useInput} from 'ink';
import * as fs from 'fs/promises';

type SaveParams = {
  enabled: boolean;
  buffer: Uint8Array;
  outputFilepath: string;
}
export const useSave = ({buffer, outputFilepath, enabled}: SaveParams) => {
  useInput((input) => {
    if (input === 's') {
      fs.writeFile(outputFilepath, buffer);
    }
  }, {isActive: enabled});
}
