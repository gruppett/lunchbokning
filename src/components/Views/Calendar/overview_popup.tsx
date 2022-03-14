import React from "react";

function Overview_popup(pos: any) {
  console.log(pos);
  return (
    <div
      className={"bg-red-500 absolute p-1 hover:"}
      style={{ left: pos.x, top: pos.y }}
    >
      <button>Click Me!</button>
    </div>
  );
}

export default Overview_popup;
