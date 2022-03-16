import React, { useEffect, useState } from "react";
import { unmountComponentAtNode } from "react-dom";

function Overview_popup(props: any) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const url = "http://hjorten:8080/api/booking/getBooking.php";
    const body = "{id: 2}";
    fetch(url, {
      body: body,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (await response.ok) {
          console.log(response.ok);
          return response.json();
        } else {
          console.log(response.json());
          throw { status: response.status, message: response.json() };
        }
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [props.datetime]);
  if (loading)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div>
        <p>Error!</p>
      </div>
    );
  return (
    <>
      <div
        className={"bg-blue-200 absolute p-1 z-20"}
        style={{ left: props.x, top: props.y }}
      >
        <div className={"flex"}>
          <p>{props.user.split(".")[0]}</p>
          <p>{data}</p>
        </div>
        <div className={"flex"}></div>
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
