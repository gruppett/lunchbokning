import React, { useState, useEffect, useContext, useCallback } from "react";
import Spinner from "../Spinner/Spinner";
import { UserContext } from "../App/App";
import moment from "moment";

interface iFormKeys {
  [key: string]: {
    [key: string]: string | number | undefined;
  };
}

interface iForm extends iFormKeys {
  bookingDates: {
    group: number;
    weekday: string;
    startDate: string;
    endDate: string;
    period: string;
    serving: string;
    groupName: string;
    groupCount: number;
    groupDiet: number;
  };
}

function formatDate(date: Date) {
  const dateFormat = "YYYY-MM-DD";
  return moment(date).format(dateFormat);
}

function ExternalGroupBooking(props: any) {
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

  const [groups, setGroups] = useState([] as any);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [groupsError, setGroupsError] = useState(false);

  const [newGroup, setNewGroup] = useState(null as any);
  const [updateGroup, setUpdateGroup] = useState(0);

  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const [edit, setEdit] = useState(false);

  const [formData, setFormData] = useState({
    bookingDates: {
      group: 0,
      weekday: "0",
      startDate: formatDate(new Date()),
      endDate: formatDate(new Date()),
      period: "",
      serving: "1",
      groupName: "",
      groupCount: 0,
      groupDiet: 0,
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
    } else if (name === "group") {
      props.setGroup(value);
      formHandleGroupChange(parseInt(value));
    }
  }

  function formHandleGroupChange(groupID: number) {
    const newFormData = formData;
    newFormData.bookingDates.group = groupID;
    props.setGroup(groupID);
    newFormData.bookingDates.groupCount = groups.find(
      (group: any) => group.groupID === groupID
    )?.count;
    if (newFormData.bookingDates.groupCount === undefined) {
      newFormData.bookingDates.groupCount = 0;
    }
    newFormData.bookingDates.groupDiet = groups.find(
      (group: any) => group.groupID === groupID
    )?.diet;
    if (newFormData.bookingDates.groupDiet === undefined) {
      newFormData.bookingDates.groupDiet = 0;
    }
    setFormData({ ...newFormData });
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

  async function postBooking() {
    setUpdateGroup(updateGroup + 1);
    const url =
      process.env.REACT_APP_API_SERVER + "booking/postNewExternal.php";
    const data = {
      startDate: formData.bookingDates.startDate,
      endDate: formData.bookingDates.endDate,
      employeeID: userData.employeeID,
      servingID: formData.bookingDates.serving,
      count: formData.bookingDates.groupCount,
      diet: formData.bookingDates.groupDiet,
    } as any;
    if (formData.bookingDates.weekday !== "0") {
      data.wday = formData.bookingDates.weekday;
    }
    if (formData.bookingDates.groupName.length !== 0) {
      data.name = formData.bookingDates.groupName;
    } else {
      data.groupID = formData.bookingDates.group;
    }
    await fetch(url, {
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
      .then((response) => {
        setNewGroup(response.groupID as number);
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

  function updateBooking(): void {
    const url = process.env.REACT_APP_API_SERVER + "booking/updateBooking.php";
    const data = {
      startDate: formData.bookingDates.startDate,
      endDate: formData.bookingDates.endDate,
      groupID: formData.bookingDates.group,
      employeeID: userData.employeeID,
      count: formData.bookingDates.groupCount,
      diet: formData.bookingDates.groupDiet,
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
      groupID: formData.bookingDates.group,
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
      props.bookings.forEach((booking: any) => {
        if (
          new Date(booking.date).getTime() >= new Date(startDate).getTime() &&
          new Date(booking.date).getTime() <= new Date(endDate).getTime()
        ) {
          setEdit(true);
          return;
        } else {
          setEdit(false);
        }
      });
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
    async function fetchGroups() {
      await fetch(process.env.REACT_APP_API_SERVER + "groups/getGroups.php", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
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
          setGroups(data.filter((group: any) => group.external === 1));
          setGroupsLoading(false);
        })
        .catch((error) => {
          return error;
        })
        .then((data) => {
          setGroupsError(data);
          setGroupsLoading(false);
        });
    }
    fetchGroups();
    if (updateGroup === 0) {
      fetchServings();
    }
  }, [updateGroup]);

  useEffect(() => {
    if (newGroup !== null && newGroup !== undefined) {
      console.log(newGroup);
      formHandleGroupChange(newGroup);
    }
  }, [groups]);

  useEffect(() => {
    hasBooking();
  }, [props.bookings, hasBooking]);

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
            <label htmlFor="groupName" className="m-1 my-2">
              Grupp namn:{" "}
            </label>
            <input
              type="text"
              name="groupName"
              id="groupName"
              className="m-1 my-2 border rounded"
              value={formData.bookingDates.groupName}
              onChange={formHandleChangeInput}
            />
            eller
            <select
              name="group"
              id="group"
              className="m-1 my-2"
              value={formData.bookingDates.group}
              onChange={formHandleChangeSelect}
            >
              <option value="0">Välj grupp</option>
              {groups !== undefined
                ? groups.map((group: any) => {
                    return (
                      <option key={group.groupID} value={group.groupID}>
                        {group.name}
                      </option>
                    );
                  })
                : null}
            </select>
          </div>
          <div className="p-1">
            <label htmlFor="groupCount" className="m-1 my-2">
              Antal:{" "}
            </label>
            <input
              type="number"
              name="groupCount"
              id="groupCount"
              min="1"
              max="999"
              style={{ width: "fit-content" }}
              className="rounded m-1 my-2 text-right box-border"
              value={formData.bookingDates.groupCount}
              onChange={formHandleChangeInput}
            />
            <label htmlFor="groupDiet" className="m-1 my-2">
              Diet:{" "}
            </label>
            <input
              type="number"
              name="groupDiet"
              id="groupDiet"
              min="0"
              max="999"
              style={{ width: "fit-content" }}
              className="rounded m-1 my-2 text-right box-border"
              value={formData.bookingDates.groupDiet}
              onChange={formHandleChangeInput}
            />
          </div>
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
      </div>
    </>
  );
}

export default ExternalGroupBooking;
