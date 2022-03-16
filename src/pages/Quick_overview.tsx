import React, { useContext, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { GraphContext } from "../components/App/App";
import "../components/Calendar/popup";
import Popup from "../components/Calendar/popup";
import ReactDOM, { unmountComponentAtNode } from "react-dom";

function Overview() {
  const [value, onChange] = useState(new Date());
  const { user } = useContext(GraphContext);

  return (
    <main className="h-full m-3" id="main">
      <Calendar
        onChange={onChange}
        value={value}
        className="!w-full !h-full z-10 relative"
        minDetail="month"
        onClickDay={(value, event) =>
          ReactDOM.render(
            <Popup
              x={event.clientX}
              y={event.clientY}
              user={user.mail}
              datetime={value}
            />,
            document.getElementById("popup")
          )
        }
        onActiveStartDateChange={() =>
          unmountComponentAtNode(document.getElementById("popup") as Element)
        }
        tileContent={({ date, view }) =>
          view === "month" && date.getDay() === 2 ? (
            <p className="bg-blue-500 rounded">{user?.givenName}</p>
          ) : null
        }
      />
      <div id="popup"></div>
    </main>
  );
}

export default Overview;
