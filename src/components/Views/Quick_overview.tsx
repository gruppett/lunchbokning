import React, { useContext, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { GraphContext } from "../App/App";
import "./Calendar/popup";
import Popup from "./Calendar/popup";
import ReactDOM from "react-dom";

function Overview() {
  const [value, onChange] = useState(new Date());
  const { user } = useContext(GraphContext);

  return (
    <main className="h-auto m-3" id="main">
      <Calendar
        onChange={onChange}
        value={value}
        className="!w-full !h-full"
        minDetail="year"
        onClickDay={(value, event) =>
          ReactDOM.render(
            <Popup x={event.clientX} y={event.clientY} />,
            document.getElementById("popup")
          )
        }
        tileContent={({ date, view }) =>
          view === "month" && date.getDay() === 2 ? (
            <p className="bg-blue-500">{user?.givenName}</p>
          ) : null
        }
      />
      <div id="popup"></div>
    </main>
  );
}

export default Overview;
