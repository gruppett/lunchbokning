import React, { useEffect, useState } from "react";
import { unmountPopup } from "../../helpers/unmountPopup";
import Spinner from "../Spinner/Spinner";
import { tileHasBooking } from "../../helpers/tileHasBooking";
import { getIdFromProp } from "../../helpers/getBookingIdFromProp";
import moment from "moment";

function Overview_popup(props: any) {
  const [personalData, setPersonalData] = useState(null as any);
  const [personalLoading, setPersonalLoading] = useState(true);
  const [personalError, setPersonalError] = useState(false);

  const [groupData, setGroupData] = useState(null as any);
  const [groupLoading, setGroupLoading] = useState(true);
  const [groupError, setGroupError] = useState(false);

  const [servingSelect, setServingSelect] = useState(1);

  function postBooking(
    date: String,
    servingID: Number,
    employeeID: Number,
    groupID: Number = 1,
    count: Number = 1,
    diet: Number = 0
  ) {
    const body = {
      date: date,
      groupID: groupID,
      count: count,
      diet: diet,
      employeeID: employeeID,
      servingID: servingID,
    };
    const url =
      process.env.REACT_APP_API_SERVER + "/api/booking/postBooking.php";
    fetch(url, {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log(response);
          throw response.json();
        }
      })
      .then((data) => {
        props.setBooking(data);
      })
      .catch((error) => {
        return error;
      })
      .then((error) => {
        if (error) console.log(error);
      });
  }

  useEffect(() => {
    if (tileHasBooking(props.booking)) {
      if (typeof getIdFromProp(props.booking).personal !== "object") {
        const url =
          process.env.REACT_APP_API_SERVER + "/api/booking/getBooking.php";
        const body =
          '{ "id": ' + (getIdFromProp(props.booking).personal as Number) + " }";
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
      } else {
        setPersonalLoading(false);
      }
    }
  }, [props.datetime, props.booking]);

  useEffect(() => {
    if (tileHasBooking(props.booking)) {
      if (typeof getIdFromProp(props.booking).group !== "object") {
        const url =
          process.env.REACT_APP_API_SERVER + "/api/booking/getBooking.php";
        const body =
          '{ "id": ' + (getIdFromProp(props.booking).group as Number) + " }";
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
              setGroupError(false);
              return response.json();
            } else {
              console.log(response);
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
  }, [props.datetime, props.booking]);
  const errors = [personalError, groupError];
  console.log(errors);
  if (personalLoading || personalError || groupLoading || groupError) {
    return (
      <div
        className={
          "bg-gradient-to-b from-blue-200 to-blue-300 absolute p-1 z-50 border border-blue-500 rounded flex cursor-pointer"
        }
        onClick={unmountPopup}
      >
        {personalLoading || groupLoading ? (
          <Spinner />
        ) : (
          <p className="text-lg text-red-700">Error</p>
        )}
      </div>
    );
  }

  return (
    <>
      <div
        className={
          "bg-gradient-to-b from-blue-200 to-blue-300 absolute p-1 z-50 border border-blue-500 rounded flex items-start"
        }
      >
        <div className="flex flex-col m-3 w-40">
          {personalData !== null ? (
            <div className={"flex p-0.5"}>
              <p className="p-0.5 m-1">{props.user.mail.split(".")[0]}:</p>
              <div className="flex flex-col w-full">
                <select
                  id="servingSelect"
                  className="p-0.5 m-1 bg-white rounded text-right"
                  onChange={(e) => {
                    setServingSelect(e.target.value as any);
                  }}
                  defaultValue="2"
                >
                  <option value="1">10:45</option>
                  <option value="2">11:40</option>
                </select>
                <button
                  className="p-0.5 m-1 bg-white rounded"
                  onClick={() => {
                    if (!personalData.active) {
                      postBooking(
                        moment(props.datetime).format("YYYY-MM-DD"),
                        servingSelect,
                        props.appUser.id
                      );
                    }
                    unmountPopup();
                  }}
                >
                  {personalData.active ? "Avboka" : "Boka"}
                </button>
              </div>
            </div>
          ) : null}
          {groupData !== null ? (
            <div className={"flex p-0.5"}>
              <p className="m-1">{props.group.groupName}:</p>
              <div className="flex flex-col">
                <input
                  type="number"
                  id="groupCount"
                  style={{ maxWidth: "-webkit-fill-available" }}
                  className="p-0.5 rounded m-1 text-right w-full box-border"
                  defaultValue={groupData.count}
                />
                <button className=" p-0.5 m-1 bg-white rounded">
                  {groupData.active ? "Avboka" : "Boka"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <span
          className="material-icons-outlined text-sm p-1 cursor-pointer"
          onClick={unmountPopup}
        >
          close
        </span>
      </div>
      <div
        className="absolute !min-w-full !min-h-full top-0 left-0 z-40 bg-gray-400 bg-opacity-50 filter blur-lg"
        onClick={() => unmountPopup()}
      ></div>
    </>
  );
}

export default Overview_popup;
