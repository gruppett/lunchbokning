import React, { useEffect, useState } from "react";
import { unmountPopup } from "../../helpers/unmountPopup";

function Overview_popup(props: any) {
  const [data, setData] = useState(null as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function tileHasBooking(prop: any) {
    if (
      prop.path
        .find((x: any) => x.tagName === "BUTTON")
        .classList.value.split(" ")
        .map((x: any) => {
          if (x.includes("booking_nr")) {
            return x;
          } else {
            return null;
          }
        })
        .filter((x: any) => {
          if (x !== null) {
            return x;
          }
        })[0] !== undefined
    ) {
      return true;
    }
  }

  function getIdFromProp(prop: any) {
    if (tileHasBooking(prop)) {
      return prop.path
        .find((x: any) => x.tagName === "BUTTON")
        .classList.value.split(" ")
        .map((x: any) => {
          if (x.includes("booking_nr")) {
            return x;
          } else {
            return null;
          }
        })
        .filter((x: any) => {
          if (x !== null) {
            return x;
          }
        })[0]
        .split("booking_nr")[1];
    }
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
    }
  }, [props.datetime]);

  if (loading || error) {
    return (
      <div
        className={
          "bg-gradient-to-b from-blue-200 to-blue-300 absolute p-1 z-50 border border-blue-500 rounded flex cursor-pointer"
        }
        onClick={() => unmountPopup()}
      >
        <p className="text-lg text-red-700">
          {loading ? "Loading..." : "Error"}
        </p>
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
        <div className="flex m-3">
          <div className={"flex flex-col p-0.5"}>
            <p className="p-0.5 m-1">{props.user.mail.split(".")[0]}:</p>
            <p className="m-1">{data.groupName}:</p>
          </div>
          <div
            className={"flex flex-col p-0.5 w-auto"}
            style={{ width: "7rem" }}
          >
            <button className=" p-0.5 m-1 bg-white rounded">
              {data.Active ? "Boka" : "Avboka"}
            </button>
            <input
              type="number"
              name=""
              id=""
              className=" rounded m-1 text-right"
            />
            <button className=" p-0.5 m-1 bg-white rounded">
              {data.Active ? "Boka" : "Avboka"}
            </button>
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
