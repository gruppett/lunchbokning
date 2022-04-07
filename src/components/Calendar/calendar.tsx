import React, { useContext, useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { GraphContext } from "../App/App";
import Popup from "./popup";
import ReactDOM from "react-dom";
import Spinner from "../Spinner/Spinner";
import { tile_Matchesdate } from "../../helpers/tileMatchesDate";
import { BookingClassNames } from "../../helpers/tileClassNameBooking";

function HjortenCalendar(props: any) {
  const [value, onChange] = useState(new Date());
  const { user } = useContext(GraphContext);

  const [excludeDates, setExcludeDates] = useState(null as any);
  const [excludeDatesLoading, setExcludeDatesLoading] = useState(true);
  const [excludeDatesError, setExcludeDatesError] = useState(false as any);

  const [personalData, setPersonalData] = useState(null as any);
  const [personalLoading, setPersonalLoading] = useState(true);
  const [personalError, setPersonalError] = useState(false as any);

  const [appUser, setAppUser] = useState(null as any);
  const [appUserLoading, setAppUserLoading] = useState(null as any);
  const [appUserError, setAppUserError] = useState(null as any);
  const [appUserDone, setAppUserDone] = useState(false as any);

  const [bookingID, setBookingID] = useState(null as any);

  const [groupData, setGroupData] = useState(null as any);
  const [groupLoading, setGroupLoading] = useState(true);
  const [groupError, setGroupError] = useState(false);

  const [groupBookingData, setGroupBookingData] = useState(null as any);
  const [groupBookingLoading, setGroupBookingLoading] = useState(true);
  const [groupBookingError, setGroupBookingError] = useState(false);

  useEffect(() => {
    const fetchPersonal = async () => {
      let url =
        process.env.REACT_APP_API_SERVER + "booking/getBookings.php";
      let body = '{ "employeeEmail": "' + user.mail + '"}';

      await fetch(url, {
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
            throw response.json();
          }
        })
        .then((data) => {
          setPersonalData(data);
        })
        .catch((error) => {
          return error;
        })
        .then((error) => {
          setPersonalError(error);
        })
        .finally(() => {
          setPersonalLoading(false);
        });

      url = process.env.REACT_APP_API_SERVER + "user/getUser.php";
      body = '{ "email": "' + user.mail + '" }';

      await fetch(url, {
        body: body,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      })
        .then((response) => {
          if (response.ok) {
            setAppUserError(false);
            return response.json();
          } else {
            throw response.json();
          }
        })
        .then((data) => {
          setAppUser(data);
        })
        .catch((error) => {
          return error;
        })
        .then((error) => {
          setAppUserError(error);
        })
        .finally(() => {
          setAppUserLoading(false);
          setAppUserDone(true);
        });
    };

    const fetchExcludes = async () => {
      const url =
        process.env.REACT_APP_API_SERVER + "date/getExcludes.php";
      await fetch(url, {
        method: "GET",
        mode: "cors",
      })
        .then((response) => {
          if (response.ok) {
            setExcludeDatesError(false);
            return response.json();
          } else {
            console.log(response);
            throw response.json();
          }
        })
        .then((data) => {
          setExcludeDates(data);
        })
        .catch((error) => {
          return error;
        })
        .then((error) => {
          setExcludeDatesError(error);
        })
        .finally(() => {
          setExcludeDatesLoading(false);
        });
    };

    const fetchAll = async () => {
      await fetchPersonal();
      await fetchExcludes();
    };
    fetchAll();
  }, [user.mail, bookingID]);

  useEffect(() => {
    const fetchGroup = async () => {
      const url =
        process.env.REACT_APP_API_SERVER + "user/getPrimGroups.php";
      const body = '{ "employeeEmail": "' + user.mail + '"}';
      if (appUser !== null) {
        if (appUser.roles.includes(4)) {
          await fetch(url, {
            body: body,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "cors",
          })
            .then((response) => {
              if (response.ok) {
                setGroupError(false);
                return response.json();
              } else {
                throw response.json();
              }
            })
            .then((data) => {
              setGroupData(data);
            })
            .catch((error) => {
              return error;
            })
            .then((error) => {
              setGroupError(error);
            })
            .finally(() => {
              setGroupLoading(false);
            });
        } else {
          setGroupLoading(false);
        }
      }
    };
    fetchGroup();
  }, [appUserDone, appUser, user.mail]);

  useEffect(() => {
    if (groupData !== null) {
      if (!groupData.hasOwnProperty("message")) {
        const url =
          process.env.REACT_APP_API_SERVER + "booking/getBookings.php";
        const body = '{ "groupID": "' + groupData.groupID + '"}';
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
              setGroupBookingError(false);
              return response.json();
            } else {
              throw response.json();
            }
          })
          .then((data) => {
            setGroupBookingData(data);
          })
          .catch((error) => {
            return error;
          })
          .then((error) => {
            setGroupBookingError(error);
          })
          .finally(() => {
            setGroupBookingLoading(false);
          });
      }
    } else {
      setGroupBookingLoading(false);
    }
  }, [groupData, user.mail]);

  if (
    personalLoading ||
    excludeDatesLoading ||
    appUserLoading ||
    groupLoading ||
    groupBookingLoading
  ) {
    return <Spinner />;
  }

  const errors = [
    personalError,
    appUserError,
    excludeDatesError,
    groupError,
    groupBookingError,
  ];
  errors.forEach((x, index) => {
    let processingError;
    switch (index) {
      case 0:
        processingError = "Personal bookings error";
        break;
      case 1:
        processingError = "Personal information error";
        break;
      case 2:
        processingError = "Exclude dates error";
        break;
      case 3:
        processingError = "Group error";
        break;
      case 4:
        processingError = "Group booking error";
        break;
    }
    if (x !== undefined && x !== false) console.log(processingError + ": " + x);
  });

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
              setBooking={setBookingID}
              group={groupData}
              view={props.view}
            />,
            document.getElementById("popup")
          );
          console.log(event.nativeEvent);
        }}
        tileContent={({ date, view }) => {
          return (
            <>
              {tile_Matchesdate(date, personalData, view) ? (
                <p className="bg-gradient-to-tr from-blue-400 to-blue-200 rounded p-1">
                  {user.givenName}
                </p>
              ) : (
                <></>
              )}
              {tile_Matchesdate(date, groupBookingData, view) ? (
                <p className="bg-gradient-to-tr from-red-400 to-red-200 rounded p-1">
                  {groupData.groupName}
                </p>
              ) : (
                <></>
              )}
            </>
          );
        }}
        tileClassName={({ date, view }) => {
          return BookingClassNames(date, view, personalData, groupBookingData);
        }}
        tileDisabled={({ date, view }) => {
          if (
            tile_Matchesdate(date, excludeDates, view) ||
            date.getDay() === 0 ||
            date.getDay() === 6
          ) {
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
