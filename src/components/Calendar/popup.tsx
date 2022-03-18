import React, { useEffect, useState } from "react";
import { unmountComponentAtNode } from "react-dom";

function Overview_popup(props: any) {
  const [data, setData] = useState(null as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const url =
      process.env.REACT_APP_API_SERVER + "/api/booking/getBooking.php";
    const body = '{ "id": 2 }';
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
          return response.json();
        } else {
          throw { status: response.status, message: response.json() };
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
  }, [props.datetime]);
  if (loading || error) {
    return (
      <div
        className={"bg-blue-200 absolute p-1 z-20 rounded flex"}
        style={{ left: props.x, top: props.y }}
      >
        <p>{loading ? "Loading..." : "Error"}</p>
      </div>
    );
  }
  return (
    <>
      <div
        className={
          "bg-gradient-to-b from-blue-200 to-blue-300 absolute p-1 z-20 rounded flex"
        }
        style={{ left: props.x, top: props.y }}
      >
        <div className={"flex flex-col p-0.5"}>
          <p className="px-1 m-0.5 underline">{props.user.split(".")[0]}:</p>
          <p className="px-1 m-0.5 underline">{data.Name}:</p>
        </div>
        <div className={"flex flex-col p-0.5 w-auto"} style={{ width: "7rem" }}>
          <button className=" px-1 m-0.5 bg-white rounded">
            {data.Active ? "Boka" : "Avboka"}
          </button>
          <input
            type="number"
            name=""
            id=""
            className=" rounded m-0.5 text-right"
          />
          <button className=" px-1 m-0.5 bg-white rounded">
            {data.Active ? "Boka" : "Avboka"}
          </button>
        </div>
      </div>
      <div
        className="absolute !min-w-full !min-h-full top-0 left-0 z-0"
        onClick={() =>
          unmountComponentAtNode(document.getElementById("popup") as Element)
        }
      ></div>
    </>
  );
}

export default Overview_popup;
