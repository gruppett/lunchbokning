import React, { useContext, useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { GraphContext } from "../App/App";
import Popup from "./popup";
import ReactDOM from "react-dom";
import Spinner from "../Spinner/Spinner";
import moment from "moment";
import { tile_Matchesdate } from "../../helpers/tileMatchesDate";

function HjortenCalendar(props: any) {
  const [value, onChange] = useState(new Date());
  const { user } = useContext(GraphContext);

  const [excludeDates, setExcludeDates] = useState(null as any);
  const [excludeDatesLoading, setExcludeDatesLoading] = useState(true);
  const [excludeDatesError, setExcludeDatesError] = useState(false);

  const [personalData, setPersonalData] = useState(null as any);
  const [personalLoading, setPersonalLoading] = useState(true);
  const [personalError, setPersonalError] = useState(false);

  const [appUser, setAppUser] = useState(null as any);
  const [appUserLoading, setAppUserLoading] = useState(null as any);
  const [appUserError, setAppUserError] = useState(null as any);

  const [groupData, setGroupData] = useState(null as any);
  const [groupLoading, setGroupLoading] = useState(true);
  const [groupError, setGroupError] = useState(false);

  useEffect(() => {
    const url =
      process.env.REACT_APP_API_SERVER + "/api/booking/getBookings.php";
    const body = '{ "employeeEmail": "' + user.mail + '"}';

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
          setPersonalError(false);
          return response.json();
        } else {
          setPersonalData({ ok: false });
          //console.log(response.json());
          throw response.json();
        }
      })
      .then((data) => {
        setPersonalData(data);
      })
      .catch((error) => {
        setPersonalError(error);
        return error;
      })
      .then((error) => {
        console.error(error.error[0]);
      })
      .finally(() => {
        setPersonalLoading(false);
      });
  }, []);

  /*useEffect(() => {
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
          setPersonalError(false);
          return response.json();
        } else {
          console.log(response);
          throw new Error(response.json().toString());
        }
      })
      .then((data) => {
        setPersonalData(data);
      })
      .catch((error) => {
        setPersonalError(true);
      })
      .finally(() => {
        setPersonalLoading(false);
      });
  }, []);*/

  useEffect(() => {
    const url = process.env.REACT_APP_API_SERVER + "/api/date/getExclude.php";
    fetch(url, {
      method: "GET",
      mode: "cors",
    })
      .then((response) => {
        if (response.ok) {
          setExcludeDatesError(false);
          return response.json();
        } else {
          console.log(response);
          throw new Error(response.json().toString());
        }
      })
      .then((data) => {
        setExcludeDates(data);
      })
      .catch((error) => {
        setExcludeDatesError(true);
      })
      .finally(() => {
        setExcludeDatesLoading(false);
      });
  }, []);

  if (personalLoading || excludeDatesLoading) {
    return <Spinner />;
  }

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
              user={user}
              appUser={appUser}
              datetime={value}
              booking={event.nativeEvent}
            />,
            document.getElementById("popup")
          );
          console.log(event.nativeEvent);
        }}
        tileContent={({ date, view }) => {
          if (tile_Matchesdate(date, personalData, view)) {
            return (
              <>
                <p className="bg-gradient-to-tr from-blue-400 to-blue-200 rounded p-1">
                  {user.givenName}
                </p>
              </>
            );
          } else {
            return null;
          }
        }}
        tileClassName={({ date, view }) => {
          if (tile_Matchesdate(date, personalData, view)) {
            return personalData
              .map((booking: any) => {
                return [booking.date, booking.active];
              })
              .find((x: any) => x[0] === moment(date).format("YYYY-MM-DD"))[1]
              .toString() === "1"
              ? "booking_nr" +
                  personalData
                    .map((booking: any) => {
                      return [booking.date, booking.bookingID];
                    })
                    .find(
                      (x: any) => x[0] === moment(date).format("YYYY-MM-DD")
                    )[1]
              : null;
          } else {
            return null;
          }
        }}
        tileDisabled={({ date, view }) => {
          if (tile_Matchesdate(date, excludeDates, view)) {
            return true;
          } else {
            return false;
          }
        }}
      />
    </>
  );
}

export default HjortenCalendar;
