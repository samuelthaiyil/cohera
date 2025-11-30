import { CursorPosition } from "@/types/cursor";

type CursorProps = {
  name: string;
  position: CursorPosition;
  hasKeyDownTimeoutReached: boolean;
};

const Cursor = ({ name, position, hasKeyDownTimeoutReached }: CursorProps) => {
    console.log("pos: ", position);
  return (<span
    className={`tooltip-text ${!hasKeyDownTimeoutReached ? "visible" : ""}`}
    style={{
      top: position.top,
      left: position.left,
    }}
  >
    {name}
  </span>)
};

export default Cursor;

