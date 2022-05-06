import React, { useState, useEffect, useContext, useCallback } from "react";
import Spinner from "../Spinner/Spinner";
import { UserContext } from "../App/App";
import moment from "moment";
import { Link } from "react-router-dom";

interface iFormKeys {
  [key: string]: {
    [key: string]: string | undefined;
  };
}

interface iForm extends iFormKeys {
  bookingDates: {
    weekday: string;
    startDate: string;
    endDate: string;
    period: string;
    serving: string;
  };
}

function formatDate(date: Date) {
  const dateFormat = "YYYY-MM-DD";
  return moment(date).format(dateFormat);
}

function PersonalBooking(props: any) {
  const { userData } = useContext(UserContext);

  const [periods, setPeriods] = useState([
    { periodID: -1, periodName: "", startDate: "", endDate: "" },
  ]);
  const [periodsLoading, setPeriodsLoading] = useState(true);
  const [periodsError, setPeriodsError] = useState(false);

  const [servings, setServings] = useState([
    {
      servingID: -1,
      servingName: "",
      time: "",
    },
  ]);
  const [servingsLoading, setServingsLoading] = useState(true);
  const [servingsError, setServingsError] = useState(false);

  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const [edit, setEdit] = useState(false);

  const [formData, setFormData] = useState({
    bookingDates: {
      weekday: "0",
      startDate: formatDate(new Date()),
      endDate: formatDate(new Date()),
      period: "",
      serving: "1",
    },
  } as iForm);

  function formHandleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const form = e.target.parentElement?.parentElement?.attributes.getNamedItem(
      "name"
    )?.value as string;
    const target = e.target;
    const value = target.value;
    const name = target.name;
    const newFormData = formData;
    newFormData[form][name] = value;
    setFormData({ ...newFormData });
    if (name === "startDate") {
      setDates([value, endDate]);
    } else if (name === "endDate") {
      setDates([startDate, value]);
    }
  }

  function formHandleChangeSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const form = e.target.parentElement?.parentElement?.attributes.getNamedItem(
      "name"
    )?.value as string;
    const target = e.target;
    const value = target.value;
    const name = target.name;
    const newFormData = formData;
    newFormData[form][name] = value;
    setFormData({ ...newFormData });
    if (name === "period") {
      setDates(getPeriodDate(value) as any);
    }
  }

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

  const setDates = useCallback(
    ([startDateF, endDateF]: Array<string>): void => {
      if (new Date(startDateF).getTime() < new Date().getTime()) {
        startDateF = moment(new Date()).format("YYYY-MM-DD");
        setStartDate(moment(new Date()).format("YYYY-MM-DD"));
      } else {
        setStartDate(startDateF);
      }
      setEndDate(endDateF);
      const newForm = formData;
      const dates = [startDateF, endDateF];
      newForm.bookingDates.startDate = dates[0];
      newForm.bookingDates.endDate = dates[1];
      setFormData({ ...newForm });
    },
    [formData]
  );

  function postBooking(): void {
    const url = process.env.REACT_APP_API_SERVER + "booking/postBooking.php";
    const data = {
      startDate: formData.bookingDates.startDate,
      endDate: formData.bookingDates.endDate,
      groupID: 1,
      employeeID: userData.employeeID,
      count: 1,
      diet: userData.diet,
      servingID: formData.bookingDates.serving,
    } as any;
    if (formData.bookingDates.weekday !== "0") {
      data.wday = formData.bookingDates.weekday;
    }
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": process.env.REACT_APP_API_KEY as string,
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
      .catch((error) => {
        return error;
      })
      .then((error) => {
        if (error) console.log(error.error);
      })
      .finally(() => {
        props.setBooking({ ...data });
      });
    console.log(data);
  }

  function updateBooking(): void {
    const url = process.env.REACT_APP_API_SERVER + "booking/updateBooking.php";
    const data = {
      startDate: formData.bookingDates.startDate,
      endDate: formData.bookingDates.endDate,
      groupID: 1,
      employeeID: userData.employeeID,
      count: 1,
      diet: userData.diet,
      servingID: formData.bookingDates.serving,
    } as any;
    if (formData.bookingDates.weekday !== "0") {
      data.wday = formData.bookingDates.weekday;
    }
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": process.env.REACT_APP_API_KEY as string,
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
      .catch((error) => {
        return error;
      })
      .then((error) => {
        if (error) console.log(error.error);
      })
      .finally(() => {
        props.setBooking({ ...data });
      });
  }

  function deleteBooking(): void {
    const url = process.env.REACT_APP_API_SERVER + "booking/deleteBooking.php";
    let data = {
      startDate: formData.bookingDates.startDate,
      endDate: formData.bookingDates.endDate,
      groupID: 1,
      employeeID: userData.employeeID,
    } as any;
    if (formData.bookingDates.weekday !== "0") {
      data.wday = formData.bookingDates.weekday;
    }
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": process.env.REACT_APP_API_KEY as string,
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
      .catch((error) => {
        return error;
      })
      .then((error) => {
        if (error) console.log(error);
      })
      .finally(() => {
        props.setBooking({ ...data });
      });
  }

  const hasBooking = useCallback(() => {
    if (props.bookings !== null) {
      props.bookings.find(
        (booking: any) => booking.date >= startDate && booking.date <= endDate
      ) !== undefined
        ? setEdit(true)
        : setEdit(false);
    } else {
      setEdit(false);
    }
  }, [endDate, props.bookings, startDate]);

  useEffect(() => {
    async function fetchPeriods() {
      const url = process.env.REACT_APP_API_SERVER + "period/getPeriods.php";
      await fetch(url, {
        method: "GET",
        headers: {
          "API-Key": process.env.REACT_APP_API_KEY as string,
        },
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
  }, [periods, setDates]);

  useEffect(() => {
    async function fetchServings() {
      const url = process.env.REACT_APP_API_SERVER + "serving/getServings.php";
      await fetch(url, {
        method: "GET",
        headers: {
          "API-Key": process.env.REACT_APP_API_KEY as string,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw response.json();
          }
        })
        .then((data) => {
          setServings(data);
          setServingsLoading(false);
        })
        .catch((error) => {
          return error;
        })
        .then((data) => {
          setServingsError(data);
          setServingsLoading(false);
        });
    }
    fetchServings();
  }, []);

  useEffect(() => {
    hasBooking();
  }, [props.bookings, hasBooking, startDate, endDate]);

  if (periodsLoading || servingsLoading) {
    return <Spinner />;
  }

  if (periodsError || servingsError) {
    console.log(periodsError);
    console.log(servingsError);
  }

  return (
    <>
      <div className="flex">
        <form
          name="bookingDates"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="p-1">
            <label htmlFor="weekday" className="m-1 my-2">
              Veckodag:{" "}
            </label>
            <select
              name="weekday"
              id="weekdaySelect"
              className="m-1 my-2"
              value={formData.bookingDates.weekday}
              onChange={formHandleChangeSelect}
            >
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
              value={formData.bookingDates.period}
              onChange={formHandleChangeSelect}
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
            <select
              name="serving"
              id="servingSelect"
              className="m-1 my-2"
              value={formData.bookingDates.serving}
              onChange={formHandleChangeSelect}
            >
              {servings[0].servingID !== -1 ? (
                servings.map((serving: any) => (
                  <option key={serving.servingID} value={serving.servingID}>
                    {serving.servingName}
                  </option>
                ))
              ) : (
                <option value="null">Inga serveringar</option>
              )}
            </select>
          </div>
          <div className="p-1">
            <input
              type="date"
              name="startDate"
              id="startDate"
              className="mx-1"
              value={formData.bookingDates.startDate.toString()}
              onChange={formHandleChangeInput}
            />
            <input
              type="date"
              name="endDate"
              id="endDate"
              className="mx-1"
              value={formData.bookingDates.endDate.toString()}
              onChange={formHandleChangeInput}
            />
          </div>
          <div className="p-1">
            <button
              className="bg-blue-200 hover:bg-blue-400 p-1 rounded mx-1"
              onClick={postBooking}
              disabled={startDate === null || endDate === null ? true : false}
            >
              Boka
            </button>
            {edit ? (
              <button
                className="bg-yellow-200 hover:bg-yellow-400 p-1 rounded mx-1"
                onClick={updateBooking}
              >
                {" "}
                Ändra
              </button>
            ) : (
              <></>
            )}
            <button
              className="bg-red-200 hover:bg-red-400 p-1 rounded mx-1"
              onClick={deleteBooking}
              disabled={startDate === null || endDate === null ? true : false}
            >
              Avboka
            </button>
          </div>
        </form>
        <Link to="installningar">
          <span className="material-icons-outlined right-0 absolute -translate-x-1/2">
            settings
          </span>
        </Link>
      </div>
    </>
  );
}

export default PersonalBooking;
