import React from "react";
import { unmountComponentAtNode } from "react-dom";

function Overview_popup(pos: any) {
  return (
    <>
      <div
        className={"bg-red-500 absolute p-1 z-20"}
        style={{ left: pos.x, top: pos.y }}
      >
        <button>Click Me!</button>
      </div>
      <div
        className="absolute !min-w-full !min-h-full top-0 left-0 z-0"
        onClick={() =>
          unmountComponentAtNode(document.getElementById("popup") as Element)
        }
      ></div>
    </>
  );
}

export default Overview_popup;
