import React from "react";
import { unmountComponentAtNode } from "react-dom";

const header = "Content-type: application/json";
function Overview_popup(props: any) {
  const url = "http://hjorten:8080/api/booking/getBookings.php";
  const booking = fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "no-cors",
    body: JSON.stringify({
      id: 1,
    }),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw { status: response.status, message: response.json() };
      }
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
    });

  return (
    <>
      <div
        className={"bg-blue-200 absolute p-1 z-20"}
        style={{ left: props.x, top: props.y }}
      >
        <div className={"flex"}>
          <p>{props.user.split(".")[0]}</p>
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
