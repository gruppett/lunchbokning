import React, { useState, useEffect } from "react";
import { responsesAreSame } from "workbox-broadcast-update";
import Spinner from "../Spinner/Spinner";

function PersonalBooking() {
  const [periods, setPeriods] = useState([]);
  const [periodsLoading, setPeriodsLoading] = useState(true);
  const [periodsError, setPeriodsError] = useState(false);

  const [weekdaySelect, setWeekdaySelect] = useState(0);
  const [periodSelect, setPeriodSelect] = useState(null);

  function getPeriodDate(periodID: number) {
    let theMFID: number = periodID as number;
    console.log(periodID);
    const period: any = periods.find(
      (period: any) => console.log(typeof theMFID) //period.periodID == (periodID as number)
    );
    if (period === undefined) {
      return null;
    }
    return period.startDate + " - " + period.endDate;
  }

  function postBooking() {
    const url = process.env.REACT_APP_API_SERVER + "booking/postBooking.php";
    const data = {
      startDate: null,
      endDate: null,
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          response.json();
        } else {
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
        <select
          name="period"
          id="periodSelect"
          className="m-1 my-2"
          onChange={(e) => {
            setPeriodSelect(
              getPeriodDate(e.target.value.toString() as any) as any
            );
          }}
        >
          {periods.map((period: any) => (
            <option key={period.periodID} value={period.periodID}>
              {period.periodName}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-100 p-1 rounded"
          onClick={() => {
            postBooking();
          }}
          disabled={periodSelect === null ? true : false}
        >
          Boka/Avboka
        </button>
      </div>
      <hr />
    </>
  );
}

export default PersonalBooking;
