import React, { useEffect, useState } from "react";
import { unmountPopup } from "../../helpers/unmountPopup";
import Spinner from "../Spinner/Spinner";
import { tileHasBooking } from "../../helpers/tileHasBooking";
import { getIdFromProp } from "../../helpers/getBookingIdFromProp";
import moment from "moment";

function Overview_popup(props: any) {
  const [data, setData] = useState(null as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        console.log(data);
      })
      .catch((error) => {
        return error;
      })
      .then((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (tileHasBooking(props.booking)) {
      const url =
        process.env.REACT_APP_API_SERVER + "/api/booking/getBooking.php";
      const body = '{ "id": ' + (getIdFromProp(props.booking) as Number) + " }";
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
    } else {
      setLoading(false);
      setData({ groupName: "DAT19", active: false, count: "13" });
    }
  }, [props.datetime]);

  if (loading || error) {
    return (
      <div
        className={
          "bg-gradient-to-b from-blue-200 to-blue-300 absolute p-1 z-50 border border-blue-500 rounded flex cursor-pointer"
        }
        onClick={unmountPopup}
      >
        {loading ? <Spinner /> : <p className="text-lg text-red-700">Error</p>}
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
          <div className={"flex p-0.5"}>
            <p className="p-0.5 m-1">{props.user.mail.split(".")[0]}:</p>
            <div className="flex flex-col w-full">
              <select
                id="servingSelect"
                className="p-0.5 m-1 bg-white rounded text-right"
                onChange={(e) => {
                  setServingSelect(e.target.value as any);
                  console.log("Hej");
                }}
              >
                <option value="1">10:45</option>
                <option value="2">11:40</option>
              </select>
              <button
                className="p-0.5 m-1 bg-white rounded"
                onClick={() =>
                  postBooking(
                    moment(props.datetime).format("YYYY-MM-DD"),
                    servingSelect,
                    props.appUser.employeeID
                  )
                }
              >
                {data.active ? "Avboka" : "Boka"}
              </button>
            </div>
          </div>
          <div className={"flex p-0.5"}>
            <p className="m-1">{data.groupName}:</p>
            <div className="flex flex-col">
              <input
                type="number"
                id="groupCount"
                style={{ maxWidth: "-webkit-fill-available" }}
                className="p-0.5 rounded m-1 text-right w-full box-border"
                defaultValue={data.count}
              />
              <button className=" p-0.5 m-1 bg-white rounded">
                {data.active ? "Avboka" : "Boka"}
              </button>
            </div>
          </div>
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
