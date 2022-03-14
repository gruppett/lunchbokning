import { render } from "@testing-library/react";
import React, { useContext, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { GraphContext } from "../App/App";
import "./Calendar/overview_popup";
import Overview_popup from "./Calendar/overview_popup";

function Overview() {
  const [value, onChange] = useState(new Date());
  const { user } = useContext(GraphContext);

  return (
    <main className="h-auto m-3" id="main">
      <Calendar
        onChange={onChange}
        value={value}
        className="!w-full"
        minDetail="year"
        onClickDay={(value, event) =>
          render(<Overview_popup x={event.clientX} y={event.clientY} />)
        }
        tileContent={({ date, view }) =>
          view === "month" && date.getDay() === 2 ? (
            <p className="bg-blue-500">{user?.givenName}</p>
          ) : null
        }
      />
    </main>
  );
}

export default Overview;
