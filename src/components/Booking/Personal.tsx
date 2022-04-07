import React, { useState, useEffect, useContext } from "react";
import Spinner from "../Spinner/Spinner";
import { UserContext } from "../App/App";

function PersonalBooking() {
  const apiUser = useContext(UserContext);
  console.log(apiUser);

  const [periods, setPeriods] = useState([
    { periodID: -1, periodName: "", startDate: "", endDate: "" },
  ]);
  const [periodsLoading, setPeriodsLoading] = useState(true);
  const [periodsError, setPeriodsError] = useState(false);

  const [weekdaySelect, setWeekdaySelect] = useState(0);
  const [periodSelect, setPeriodSelect] = useState([] as Array<string>);

  function getPeriodDate(periodID: string) {
    let theMFID = parseInt(periodID, 10);
    const period: any = periods.find(
      (period: any) => period.periodID === theMFID
    );
    if (period === undefined) {
      return null;
    }
    console.log(period.startDate, period.endDate);
    return [period.startDate, period.endDate];
  }

  function postBooking(dates: Array<string>, servingID: number) {
    const url = process.env.REACT_APP_API_SERVER + "booking/postBooking.php";
    console.log(dates);
    const data = {
      startDate: dates[0],
      endDate: dates[1],
      groupID: 1,
      employeeID: apiUser.employeeID,
      count: 1,
      diet: apiUser.diet,
      servingID: servingID,
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      mode: "cors",
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
      await fetch(url)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw response.json();
          }
        })
        .then((data) => {
          setPeriods(data);
          setPeriodsLoading(false);
        })
        .catch((error) => {
          setPeriodsLoading(false);
          return error;
        })
        .then((data) => {
          setPeriodsError(data);
        });
    };
    fetchPeriods();
    if (periodSelect.length === 0) {
      setPeriodSelect(getPeriodDate(periods[0].periodID.toString()) as any);
    }
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
            setPeriodSelect(getPeriodDate(e.target.value as string) as any);
          }}
        >
          {periods[0].periodID !== -1 ? (
            periods.map((period: any) => (
              <option key={period.periodID} value={period.periodID}>
                {period.periodName}
              </option>
            ))
          ) : (
            <option value="null">Inga perioder</option>
          )}
        </select>
        <label htmlFor="serving" className="m-1 my-2">
          Servering:{" "}
        </label>
        <select name="serving" id="servingSelect" className="m-1 my-2">
          <option value="0">Alla</option>
        </select>
        <button
          className="bg-blue-100 p-1 rounded"
          onClick={() => {
            postBooking(periodSelect, 1);
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
