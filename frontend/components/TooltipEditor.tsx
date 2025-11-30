"use client";

import { useUser } from "@clerk/nextjs";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type CursorPosition = {
  top: number;
  left: number;
};

export type Client = {
  id: number;
  position: CursorPosition;
};

type TooltipEditorProps = {
  clients: Client[];
  value: string;
  onValueChange: Dispatch<SetStateAction<string>>;
  hasKeyDownTimeoutReached: boolean;
  updateLastKeyPress: () => void;
  broadcastPosition: (payload: {
    top: number;
    left: number;
    clientId: string;
  }) => void;
};

type TextEffects = {
  bold: boolean;
  italicize: boolean;
  underline: boolean;
};

const TooltipEditor = ({
  clients,
  value,
  onValueChange,
  hasKeyDownTimeoutReached,
  updateLastKeyPress,
  broadcastPosition,
}: TooltipEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [textEffects, setTextEffects] = useState<TextEffects>({
    bold: false,
    italicize: false,
    underline: false,
  });
  const { user } = useUser();

  const getCaretCoordinates = useCallback((textarea: HTMLTextAreaElement) => {
    const selectionStart = textarea.selectionStart ?? 0;
    const mirrorDiv = document.createElement("div");
    const computed = window.getComputedStyle(textarea);

    const properties = [
      "fontFamily",
      "fontSize",
      "fontWeight",
      "fontStyle",
      "letterSpacing",
      "textTransform",
      "textAlign",
      "width",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
      "borderTopWidth",
      "borderRightWidth",
      "borderBottomWidth",
      "borderLeftWidth",
      "boxSizing",
      "lineHeight",
      "whiteSpace",
    ];

    mirrorDiv.style.position = "absolute";
    mirrorDiv.style.visibility = "hidden";
    mirrorDiv.style.whiteSpace = "pre-wrap";
    mirrorDiv.style.wordBreak = "break-word";

    properties.forEach((prop) => {
      mirrorDiv.style.setProperty(prop, computed.getPropertyValue(prop));
    });

    mirrorDiv.textContent = textarea.value.substring(0, selectionStart);

    const marker = document.createElement("span");
    marker.textContent = "\u200b";
    mirrorDiv.appendChild(marker);
    document.body.appendChild(mirrorDiv);

    const top = marker.offsetTop - textarea.scrollTop + 20;
    const left = marker.offsetLeft - textarea.scrollLeft + 33;

    document.body.removeChild(mirrorDiv);

    return { top, left };
  }, []);

  const updateTooltipPosition = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const caret = getCaretCoordinates(textarea);
    broadcastPosition({
      top: textarea.offsetTop + caret.top,
      left: textarea.offsetLeft + caret.left,
      clientId: user?.id || "",
    });
  }, [broadcastPosition, getCaretCoordinates]);

  useEffect(() => {
    updateTooltipPosition();
  }, [updateTooltipPosition, value]);

  const handleSetTextEffect = (type: "bold" | "italicize" | "underline") => {
    setTextEffects((prev) => {
      return {
        ...prev,
        [type]: !prev[type]
      };
    });
  };

  return (
    <div className="tooltip-wrapper">
      {clients.map((client) => (
        <Cursor
          key={client.id}
          hasKeyDownTimeoutReached={hasKeyDownTimeoutReached}
          position={client.position}
          name={`${client.id}`}
        />
      ))}
      <div className="rounded-md shadow-md p-4 flex flex-row space-x-3 mb-4">
        <button
          className={`hover:cursor-pointer font-semibold rounded-md shadow-md px-3 py-1 transition-colors duration-200 ${
            textEffects["bold"] ? "text-blue-500" : "text-black"
          }`}
          onClick={() => handleSetTextEffect("bold")}
        >
          B
        </button>
        <button
          className={`hover:cursor-pointer italic rounded-md shadow-md px-3 py-1 transition-colors duration-200 ${
            textEffects["italicize"] ? "text-blue-500" : "text-black"
          }`}
          onClick={() => handleSetTextEffect("italicize")}
        >
          I
        </button>
        <button
          className={`hover:cursor-pointer underline rounded-md shadow-md px-3 py-1 transition-colors duration-200 ${
            textEffects["underline"] ? "text-blue-500" : "text-black"
          }`}
          onClick={() => handleSetTextEffect("underline")}
        >
          U
        </button>
      </div>
      <textarea
        ref={textareaRef}
        className="p-8 focus:outline-none border border-gray-200 shadow-md resize-none rounded-md"
        cols={100}
        rows={20}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onSelect={updateTooltipPosition}
        onKeyUp={() => {
          updateLastKeyPress();
          updateTooltipPosition();
        }}
        onKeyDown={updateLastKeyPress}
        onClick={updateTooltipPosition}
        onMouseUp={updateTooltipPosition}
        onScroll={updateTooltipPosition}
      />
    </div>
  );
};

type CursorProps = {
  name: string;
  position: CursorPosition;
  hasKeyDownTimeoutReached: boolean;
};

const Cursor = ({ name, position, hasKeyDownTimeoutReached }: CursorProps) => (
  <span
    className={`tooltip-text ${!hasKeyDownTimeoutReached ? "visible" : ""}`}
    style={{
      top: position.top,
      left: position.left,
    }}
  >
    {name}
  </span>
);

export default TooltipEditor;
