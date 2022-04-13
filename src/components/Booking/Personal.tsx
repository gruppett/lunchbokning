import React, { useState, useEffect, useContext } from "react";
import Spinner from "../Spinner/Spinner";
import { UserContext } from "../App/App";

function PersonalBooking() {
  const apiUser = useContext(UserContext);

  const [periods, setPeriods] = useState([
    { periodID: -1, periodName: "", startDate: "", endDate: "" },
  ]);
  const [periodsLoading, setPeriodsLoading] = useState(true);
  const [periodsError, setPeriodsError] = useState(false);

  const [startDate, setStartDate] = useState(
    document.getElementById("startDate")?.nodeValue
  );
  const [endDate, setEndDate] = useState(
    document.getElementById("endDate")?.nodeValue
  );

  const [weekdaySelect, setWeekdaySelect] = useState(0);

  function getPeriodDate(periodID: string): Array<string> | null {
    let theMFID = parseInt(periodID, 10);
    const period: any = periods.find(
      (period: any) => period.periodID === theMFID
    );
    if (period === undefined) {
      return null;
    }
    return [period.startDate, period.endDate];
  }

  function setDates([startDate, endDate]: Array<string>): void {
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");
    console.log(startDate, endDate);
    setStartDate(startDate);
    if (startDateInput !== null) {
      startDateInput.outerText = startDate;
    }
    setEndDate(endDate);
    if (endDateInput !== null) {
      endDateInput.outerText = endDate;
    }
  }

  function postBooking(servingID: number): void {
    const url = process.env.REACT_APP_API_SERVER + "booking/postBooking.php";
    const data = {
      startDate: startDate,
      endDate: endDate,
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

  function deleteBooking(): void {
    const url = process.env.REACT_APP_API_SERVER + "booking/deleteBooking.php";
    const data = {
      startDate: startDate,
      endDate: endDate,
      groupID: 1,
      employeeID: apiUser.employeeID,
    };
    console.log(data);
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
          return response.json();
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
    function fetchPeriods() {
      const url = process.env.REACT_APP_API_SERVER + "period/getPeriods.php";
      fetch(url)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw response.json();
          }
        })
        .then((data) => {
          setPeriods(data);
          setDates([data[0].startDate, data[0].endDate]);
          setPeriodsLoading(false);
        })
        .catch((error) => {
          return error;
        })
        .then((data) => {
          setPeriodsError(data);
          setPeriodsLoading(false);
        });
    }
    if (periods[0].periodID === -1) {
      fetchPeriods();
    }
  }, [periods]);

  if (periodsLoading || periodsError) {
    return periodsLoading ? <Spinner /> : <script>alert(periodsError)</script>;
  }

  return (
    <>
      <div>
        <div className="p-1">
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
              setDates(getPeriodDate(e.target.value as string) as any);
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
        </div>
        <div className="p-1">
          <input type="date" name="startDate" id="startDate" className="mx-1" />
          <input type="date" name="endDate" id="endDate" className="mx-1" />
        </div>
        <div className="p-1">
          <button
            className="bg-blue-200 p-1 rounded mx-1"
            onClick={() => {
              postBooking(1);
            }}
            disabled={startDate === null || endDate === null ? true : false}
          >
            Boka
          </button>
          <button
            className="bg-red-200 p-1 rounded mx-1"
            onClick={() => {
              deleteBooking();
            }}
            disabled={startDate === null || endDate === null ? true : false}
          >
            Avboka
          </button>
        </div>
      </div>
      <hr />
    </>
  );
}

export default PersonalBooking;
