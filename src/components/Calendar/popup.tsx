import React, { useEffect, useState } from "react";
import { unmountPopup } from "../../helpers/unmountPopup";
import Spinner from "../Spinner/Spinner";
import { tileHasBooking } from "../../helpers/tileHasBooking";
import { getIdFromProp } from "../../helpers/getBookingIdFromProp";
import moment from "moment";

interface iFormKeys {
  [key: string]: {
    [key: string]: string | number | undefined;
  };
}

interface iForm extends iFormKeys {
  personalBooking: {
    serving: number;
  };
  groupBooking: {
    count: number;
    serving: number;
  };
}

function Overview_popup(props: any) {
  const [personalData, setPersonalData] = useState(null as any);
  const [personalLoading, setPersonalLoading] = useState(true);
  const [personalError, setPersonalError] = useState(false);

  const [groupBookingData, setGroupBookingData] = useState(null as any);
  const [groupBookingLoading, setGroupBookingLoading] = useState(true);
  const [groupBookingError, setGroupBookingError] = useState(false);

  const [servings, setServings] = useState([
    {
      servingID: -1,
      servingName: "",
      time: "",
    },
  ]);
  const [servingsLoading, setServingsLoading] = useState(true);
  const [servingsError, setServingsError] = useState(false);

  const [formData, setFormData] = useState({
    personalBooking: {
      serving:
        props.appUser !== null
          ? props.appUser.servingID !== 0
            ? props.appUser.servingID
            : 1
          : 1,
    },
    groupBooking: {
      count:
        props.group !== null && props.group !== undefined
          ? props.group.count
          : 0,
      serving:
        props.group !== null && props.group !== undefined
          ? props.group.servingID === 0
            ? 1
            : props.group.servingID
          : 1,
    },
  } as iForm);

  const [editBooking, setEditBooking] = useState(false);
  const [editBookingGroup, setEditBookingGroup] = useState(false);

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
    const value = parseInt(target.value);
    const name = target.name;
    const newFormData = formData;
    newFormData[form][name] = value;
    setFormData({ ...newFormData });
  }

  function postBooking(
    date: String,
    servingID: Number,
    employeeID: Number,
    groupID: Number = 1,
    count: Number = 1,
    diet: Number = 0
  ) {
    const body = {
      date: date,
      groupID: groupID,
      count: count,
      diet: diet,
      employeeID: employeeID,
      servingID: servingID,
    };
    const url = process.env.REACT_APP_API_SERVER + "booking/postBooking.php";
    fetch(url, {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        props.setBooking(data);
      })
      .catch((error) => {
        return error;
      })
      .then((error) => {
        if (error) console.log(error);
      });
  }

  function updateBooking(
    bookingID: Number,
    date: String,
    servingID: Number,
    employeeID: Number,
    groupID: Number = 1,
    count: Number = 1,
    diet: Number = 0
  ) {
    const body = {
      bookingID: bookingID,
      date: date,
      groupID: groupID,
      count: count,
      diet: diet,
      employeeID: employeeID,
      servingID: servingID,
    };
    const url = process.env.REACT_APP_API_SERVER + "booking/updateBooking.php";
    fetch(url, {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        props.setBooking(data);
      })
      .catch((error) => {
        return error;
      })
      .then((error) => {
        if (error) console.log(error);
      });
  }

  function deleteBooking(bookingID: Number) {
    const body = {
      bookingID: bookingID,
      employeeID: props.appUser.id,
    };
    const url = process.env.REACT_APP_API_SERVER + "booking/deleteBooking.php";
    fetch(url, {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        props.setBooking(data);
      })
      .catch((error) => {
        return error;
      })
      .then((error) => {
        if (error) console.log(error);
      });
  }

  useEffect(() => {
    if (props.view === "Overview" || props.view === "Personal") {
      if (tileHasBooking(props.booking)) {
        if (typeof getIdFromProp(props.booking).personal !== "object") {
          const url =
            process.env.REACT_APP_API_SERVER + "booking/getBooking.php";
          const body =
            '{ "id": ' +
            (getIdFromProp(props.booking).personal as Number) +
            " }";
          fetch(url, {
            body: body,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "API-Key": process.env.REACT_APP_API_KEY as string,
            },
            mode: "cors",
          })
            .then((response) => {
              if (response.ok) {
                setPersonalError(false);
                return response.json();
              } else {
                console.log(response);
                throw response.json();
              }
            })
            .then((data) => {
              setPersonalData(data);
              const newFormData = formData;

              newFormData.personalBooking.serving = data.servingID;
              setFormData({ ...newFormData });
            })
            .catch((error) => {
              return error;
            })
            .then((error) => {
              setPersonalError(error);
            })
            .finally(() => {
              setPersonalLoading(false);
            });
        } else {
          setPersonalLoading(false);
        }
      } else {
        setPersonalLoading(false);
      }
    } else {
      setPersonalLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.view === "Overview" || props.view === "Groups") {
      if (tileHasBooking(props.booking)) {
        if (typeof getIdFromProp(props.booking).group !== "object") {
          const url =
            process.env.REACT_APP_API_SERVER + "booking/getBooking.php";
          const body =
            '{ "id": ' + (getIdFromProp(props.booking).group as Number) + " }";
          fetch(url, {
            body: body,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "API-Key": process.env.REACT_APP_API_KEY as string,
            },
            mode: "cors",
          })
            .then((response) => {
              if (response.ok) {
                setGroupBookingError(false);
                return response.json();
              } else {
                console.log(response);
                throw response.json();
              }
            })
            .then((data) => {
              setGroupBookingData(data);
              const newFormData = formData;
              newFormData.groupBooking.serving = data.servingID;
              newFormData.groupBooking.count = data.count;
              setFormData({ ...newFormData });
            })
            .catch((error) => {
              return error;
            })
            .then((error) => {
              setGroupBookingError(error);
            })
            .finally(() => {
              setGroupBookingLoading(false);
            });
        } else {
          setGroupBookingLoading(false);
        }
      } else {
        setGroupBookingLoading(false);
      }
    } else {
      setGroupBookingLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchServings = () => {
      const url = process.env.REACT_APP_API_SERVER + "serving/getServings.php";
      fetch(url, {
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
        .then((error) => {
          setServingsError(error);
        });
    };
    fetchServings();
  }, []);

  const errors = [personalError, groupBookingError, servingsError];

  errors.forEach((error) => {
    if (error) {
      console.log(error);
    }
  });

  if (
    personalLoading ||
    personalError ||
    groupBookingLoading ||
    groupBookingError ||
    servingsLoading ||
    servingsError
  ) {
    return (
      <div
        className={
          "bg-gradient-to-b from-blue-200 to-blue-300 absolute p-1 z-50 border border-blue-500 rounded flex cursor-pointer"
        }
        onClick={unmountPopup}
      >
        {personalLoading || groupBookingLoading || servingsLoading ? (
          <Spinner />
        ) : (
          <p className="text-lg text-red-700">Error</p>
        )}
      </div>
    );
  }

  return (
    <>
      <div
        className={
          "bg-gradient-to-b from-blue-200 to-blue-300 absolute p-1 z-50 border border-blue-500 rounded flex items-start"
        }
      >
        <div className="flex flex-col m-3 w-40">
          {props.view === "Overview" || props.view === "Personal" ? (
            <form
              className={"flex p-0.5"}
              name="personalBooking"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <p className="p-0.5 m-1">{props.user.mail.split(".")[0]}:</p>
              <div className="flex flex-col w-full">
                <select
                  id="servingPersonal"
                  name="serving"
                  className="p-0.5 m-1 bg-white rounded text-right"
                  value={formData.personalBooking.serving as any}
                  onChange={(e) => {
                    if (personalData !== null) {
                      setEditBooking(
                        (e.target.value as any) !==
                          formData.personalBooking.serving
                          ? true
                          : false
                      );
                    }
                    formHandleChangeSelect(e);
                  }}
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
                <button
                  className="p-0.5 m-1 bg-white rounded"
                  onClick={() => {
                    if (editBooking) {
                      updateBooking(
                        getIdFromProp(props.booking).personal as Number,
                        moment(props.datetime).format("YYYY-MM-DD"),
                        formData.personalBooking.serving as any,
                        props.appUser.id
                      );
                    } else if (personalData === null) {
                      postBooking(
                        moment(props.datetime).format("YYYY-MM-DD"),
                        formData.personalBooking.serving as any,
                        props.appUser.id
                      );
                    } else if (personalData) {
                      deleteBooking(
                        getIdFromProp(props.booking).personal as Number
                      );
                    }
                    unmountPopup();
                  }}
                >
                  {editBooking
                    ? "Ändra"
                    : personalData === null
                    ? "Boka"
                    : !personalData
                    ? "Boka"
                    : "Avboka"}
                </button>
              </div>
            </form>
          ) : (
            <></>
          )}
          {(props.view === "Overview" || props.view === "Groups") &&
          props.group !== undefined &&
          props.group !== null ? (
            !props.group.hasOwnProperty("message") ? (
              <form
                className={"flex p-0.5"}
                name="groupBooking"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <p className="m-1">{props.group.name}:</p>
                <div className="flex flex-col">
                  <input
                    type="number"
                    id="groupCount"
                    name="count"
                    min="1"
                    max="999"
                    style={{ maxWidth: "-webkit-fill-available" }}
                    className="p-0.5 rounded m-1 text-right w-full box-border"
                    value={formData.groupBooking.count}
                    onChange={(e) => {
                      if (e.target.value.length > 3) {
                        e.target.value = e.target.value.slice(0, 3);
                        alert("Max antal personer är 999");
                      }
                      if (groupBookingData !== null) {
                        setEditBookingGroup(
                          (e.target.value as any) !==
                            formData.groupBooking.count
                            ? true
                            : false
                        );
                      }
                      formHandleChangeInput(e);
                    }}
                  />
                  <select
                    id="servingSelectGroup"
                    name="serving"
                    className="p-0.5 m-1 bg-white rounded text-right"
                    onChange={(e) => {
                      if (groupBookingData !== null) {
                        setEditBookingGroup(
                          (e.target.value as any) !==
                            formData.groupBooking.serving
                            ? true
                            : false
                        );
                      }
                      formHandleChangeSelect(e);
                    }}
                    value={formData.groupBooking.serving as any}
                  >
                    {servings[0].servingID !== -1 ? (
                      servings.map((serving: any) => (
                        <option
                          key={serving.servingID}
                          value={serving.servingID}
                        >
                          {serving.servingName}
                        </option>
                      ))
                    ) : (
                      <option value="null">Inga serveringar</option>
                    )}
                  </select>
                  <button
                    className=" p-0.5 m-1 bg-white rounded"
                    onClick={() => {
                      if (editBookingGroup) {
                        updateBooking(
                          getIdFromProp(props.booking).group as Number,
                          moment(props.datetime).format("YYYY-MM-DD"),
                          formData.groupBooking.serving as any,
                          props.appUser.id,
                          props.group.id,
                          formData.groupBooking.count as any,
                          props.group.diet
                        );
                      } else if (groupBookingData === null) {
                        postBooking(
                          moment(props.datetime).format("YYYY-MM-DD"),
                          formData.groupBooking.serving as any,
                          props.appUser.id,
                          props.group.id,
                          formData.groupBooking.count as any,
                          props.group.diet
                        );
                      } else if (groupBookingData) {
                        deleteBooking(
                          getIdFromProp(props.booking).group as Number
                        );
                      }
                      unmountPopup();
                    }}
                  >
                    {editBookingGroup
                      ? "Ändra"
                      : groupBookingData === null
                      ? "Boka"
                      : !groupBookingData
                      ? "Boka"
                      : "Avboka"}
                  </button>
                </div>
              </form>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </div>
        <span
          className="material-icons-outlined text-sm p-1 cursor-pointer"
          onClick={unmountPopup}
        >
          close
        </span>
      </div>
      <div
        className="fixed !min-w-full !min-h-full top-0 z-40 bg-gray-400 bg-opacity-50 filter blur-lg"
        onClick={() => unmountPopup()}
      ></div>
    </>
  );
}

export default Overview_popup;
