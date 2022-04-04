import React, { useState, useEffect } from "react";
import Spinner from "../Spinner/Spinner";

function PersonalBooking() {
  const [periods, setPeriods] = useState([]);
  const [periodsLoading, setPeriodsLoading] = useState(true);
  const [periodsError, setPeriodsError] = useState(false);

  useEffect(() => {
    const fetchPeriods = async () => {
      const url = process.env.REACT_APP_API_SERVER + "period/getPeriods.php";
      try {
        const response = await fetch(url);
        const data = await response.json();
        setPeriods(data);
        setPeriodsLoading(false);
      } catch (error: any) {
        setPeriodsError(error.error);
      }
    };
    fetchPeriods();
  }, []);

  if (periodsLoading || periodsError) {
    periodsLoading ? <Spinner /> : <script>alert(periodsError)</script>;
  }

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
        <select name="period" id="periodSelect" className="m-1 my-2">
          {periods.map((period: any) => (
            <option key={period.periodID} value={period.periodID}>
              {period.periodName}
            </option>
          ))}
        </select>
        <button>{}</button>
      </div>
      <hr />
    </>
  );
}

export default PersonalBooking;
