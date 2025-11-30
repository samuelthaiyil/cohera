export type CursorPosition = {
  top: number;
  left: number;
};

export type Client = {
  id: string;
  username: string;
};

export type ClientCursorPosition = Client & {
  position: CursorPosition;
};

