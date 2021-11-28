import * as fs from 'fs/promises';

if (process.argv.length < 4) {
  console.log('Usage: generate-bin.ts <number of bytes> <filename>');
  process.exit(1);
}

const numBytes = Number(process.argv[2]);
const filename = process.argv[3];

const randomByte = () => (Math.random() * 256) | 0;

const bytes = Array.from({ length: numBytes }, randomByte);
const buffer = new Uint8Array(bytes);

fs.writeFile(filename, buffer).then(() => {
  // 👍
});
