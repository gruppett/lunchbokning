import React from "react";

function PersonalBooking() {
  //function fillPeriodSelect() {}

  return (
    <>
      <div>
        <label htmlFor="weekday" className="m-1 my-2">
          Veckodag:{" "}
        </label>
        <select name="weekday" id="weekdaySelect" className="m-1 my-2">
          <option value="0">Alla</option>
          <option value="1">Måndag</option>
          <option value="2">Tisdag</option>
          <option value="3">Onsdag</option>
          <option value="4">Torsdag</option>
          <option value="5">Fredag</option>
        </select>
        <label htmlFor="period" className="m-1 my-2">
          Period:{" "}
        </label>
        <select name="period" id="periodSelect" className="m-1 my-2"></select>
        <button>{}</button>
      </div>
      <hr />
    </>
  );
}

export default PersonalBooking;
