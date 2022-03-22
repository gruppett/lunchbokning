import React, { useContext, useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { GraphContext } from "../components/App/App";
import "../components/Calendar/popup";
import Popup from "../components/Calendar/popup";
import ReactDOM from "react-dom";
import { unmountPopup } from "../helpers/unmountPopup";
import Spinner from "../components/Spinner/Spinner";
import moment from "moment";

function Overview() {
  const [value, onChange] = useState(new Date());
  const { user } = useContext(GraphContext);
  const [data, setData] = useState(null as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function formatDate(date: Date) {
    let formattedDate =
      date.getFullYear().toString() +
      "-" +
      (date.getMonth() + 1).toString() +
      "-" +
      date.getDate().toString();
    return formattedDate;
  }

  useEffect(() => {
    const url =
      process.env.REACT_APP_API_SERVER + "/api/booking/getBookings.php";
    const body = '{ "employeeEmail": ' + '"admin@mail.com"' + " }";
    fetch(url, {
      body: body,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((response) => {
        if (response.ok) {
          setError(false);
          return response.json();
        } else {
          console.log(response);
          throw new Error(response.json().toString());
        }
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner />;
  }
  console.log(data.bookings);
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
              user={user}
              datetime={value}
            />,
            document.getElementById("popup")
          );
        }}
        //onActiveStartDateChange={() => unmountPopup()}
        tileContent={({ date, view }) => {
          if (
            data.bookings
              .map((booking: any) => {
                return booking.Date;
              })
              .find((x: any) => x === moment(date).format("YYYY-MM-DD"))
          ) {
            return (
              <>
                <p className="bg-blue-300 rounded p-1">{user.givenName}</p>
              </>
            );
          } else {
            return null;
          }
        }}
      />
    </>
  );
}

export default Overview;
