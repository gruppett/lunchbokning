import React, { useContext, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { GraphContext } from "../components/App/App";
import "../components/Calendar/popup";
import Popup from "../components/Calendar/popup";
import ReactDOM, { unmountComponentAtNode } from "react-dom";
import { unmountPopup } from "../helpers/unmountPopup";

function Overview() {
  const [value, onChange] = useState(new Date());
  const { user } = useContext(GraphContext);

  return (
    <>
      <Calendar
        onChange={onChange}
        value={value}
        className="!w-full !h-full z-0 relative"
        minDetail="month"
        onClickDay={(value, event) => {
          let popupDiv = document.createElement("div");
          popupDiv.id = "popup";
          popupDiv.classList.add(
            "flex",
            "w-full",
            "h-full",
            "absolute",
            "top-0",
            "left-0",
            "justify-center",
            "items-center"
          );
          document.getElementById("root")?.appendChild(popupDiv);
          ReactDOM.render(
            <Popup
              x={event.clientX}
              y={event.clientY}
              user={user.mail}
              datetime={value}
            />,
            document.getElementById("popup")
          );
        }}
        onActiveStartDateChange={() => unmountPopup()}
        tileContent={({ date, view }) =>
          view === "month" && date.getDay() === 2 ? (
            <>
              <p className="bg-blue-400 rounded m-1 p-0.5">{user?.givenName}</p>
              <p className="bg-red-400 rounded m-1 p-0.5">{user?.givenName}</p>
            </>
          ) : null
        }
      />
    </>
  );
}

export default Overview;
