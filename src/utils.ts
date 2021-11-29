export const SCREEN_W = 80;
export const SCREEN_H = 24;
export const HEXVIEW_W = SCREEN_W;
export const HEXVIEW_H = SCREEN_H - 3;
export const BYTES_PER_LINE = 16;

export const toHex = (n: number, l: number) => n.toString(16).padStart(l, '0');

export type SetStateFn<T> = (x: T) => void;
export enum AppState {
  Edit = 'Edit',
  Save = 'Save',
  Help = 'Help'
};