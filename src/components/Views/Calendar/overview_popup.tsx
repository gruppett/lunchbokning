import React from "react";

function Overview_popup(x: any, y: any) {
  return (
    <div className={"bg-white absolute left-" + x + " top-" + y}>
      <button>Click Me!</button>
    </div>
  );
}

export default Overview_popup;
