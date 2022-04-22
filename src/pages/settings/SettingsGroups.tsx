import React, { useState, useEffect, Key, useCallback } from "react";
import Spinner from "../../components/Spinner/Spinner";

interface groupFormInterfaceKeys {
  [key: string]: string | undefined;
}

interface groupFormInterface extends groupFormInterfaceKeys {
  groupName: string;
  groupCount: string;
  groupDiet: string;
  groupHandler: string;
  groupServing: string;
}
interface groupFormSubmitInterface extends groupFormInterfaceKeys {
  name?: string;
  count?: string;
  diet?: string;
  employeeID?: string;
  groupID?: string;
  groupServing?: string;
}

function SettingsGroups() {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [isGroupSelected, setIsGroupSelected] = useState(false);
  const [groupData, setGroupData] = useState([{} as any]);
  const [userData, setUserData] = useState([{} as any]);
  const [servingData, setServingData] = useState([{} as any]);
  const [loadStatus, setLoadStatus] = useState([0, 3]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [groupForm, setGroupForm] = useState({
    groupName: "",
    groupCount: "1",
    groupDiet: "0",
    groupHandler: "",
    groupServing: "",
  } as groupFormInterface);
  const [handlerForm, setHandlerForm] = useState("");
  const [reload, setReload] = useState(0);

  function selectGroup(id: number) {
    const group = groupData.find((x) => x.groupID === id);
    const data = {
      groupName: group.name,
      groupCount: group.count,
      groupDiet: group.diet,
      groupHandler: group.primaryHandler.id || "",
      groupID: group.groupID,
      groupServing: group.servingID,
    };
    setGroupForm(data);
    setSelectedGroup(group.groupID);
    setIsGroupSelected(true);
  }

  function getSelectedGroup() {
    return groupData.find((x) => x.groupID === selectedGroup);
  }

  function resetSelectedGroup() {
    const data = {
      groupName: "",
      groupCount: "1",
      groupDiet: "0",
      groupHandler: "",
      groupID: "",
      groupServing: "",
    };
    setGroupForm(data);
    setSelectedGroup(0);
    setIsGroupSelected(false);
  }

  function reloadData() {
    setReload(reload + 1);
  }

  const sectionLoaded = useCallback(() => {
    let status = loadStatus;
    status[0]++;
    if (status[0] === status[1]) {
      setIsLoaded(true);
    }
    setLoadStatus(status);
  }, [loadStatus]);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER + "groups/getGroups.php", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setGroupData(data);
        sectionLoaded();
      });
  }, [reload, sectionLoaded]);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER + "user/getUsers.php", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        sectionLoaded();
      });
  }, [reload, sectionLoaded]);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER + "serving/getServings.php", {
      method: "Get", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setServingData(data);
        sectionLoaded();
      });
  }, [reload, sectionLoaded]);

  function groupHandleChange(event: { target: any }) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    const form = groupForm;
    form[name] = value;
    setGroupForm(form);
    reloadData();
  }
  function handlerHandleChange(event: { target: any }) {
    const target = event.target;
    const value = target.value;
    setHandlerForm(value);
    reloadData();
  }

  async function groupHandleSubmit(event: any) {
    event.preventDefault();
    const data = {
      name: groupForm.groupName,
      count: groupForm.groupCount,
      diet: groupForm.groupDiet,
      employeeID: groupForm.groupHandler,
      servingID: groupForm.groupServing,
    } as groupFormSubmitInterface;
    if (data.employeeID === "") {
      delete data.employeeID;
    }
    if (!isGroupSelected) {
      const response = await fetch(
        process.env.REACT_APP_API_SERVER + "groups/postGroup.php",
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(data),
        }
      );
      console.log(await response);
      reloadData();
      return;
    }
    let updateData = data;
    updateData.groupID = selectedGroup.toString();
    console.log(data);
    const response = await fetch(
      process.env.REACT_APP_API_SERVER + "groups/updateGroup.php",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(updateData),
      }
    );
    console.log(await response);
    reloadData();
    return;
  }
  async function handlerHandleSubmit(event: any) {
    event.preventDefault();
    const data = {
      employeeID: handlerForm,
      groupID: selectedGroup,
    };
    const response = await fetch(
      process.env.REACT_APP_API_SERVER + "handler/postHandler.php",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data),
      }
    );
    console.log(await response);
    reloadData();
    return;
  }

  async function handlerDeleteHandleSubmit(event: any) {
    event.preventDefault();
    const data = {
      employeeID: event.target.elements[0].value,
      groupID: selectedGroup,
    };
    const response = await fetch(
      process.env.REACT_APP_API_SERVER + "handler/deleteHandler.php",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data),
      }
    );
    console.log(await response);
    reloadData();
    return;
  }

  async function groupDeleteSubmit(event: any) {
    event.preventDefault();
    const data = {
      groupID: selectedGroup,
    };
    resetSelectedGroup();
    const response = await fetch(
      process.env.REACT_APP_API_SERVER + "groups/deleteGroup.php",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data),
      }
    );
    console.log(await response);
    reloadData();
    return;
  }

  if (!isLoaded) {
    return <Spinner></Spinner>;
  }

  /*
  TODO: Remove entries in userData if they are in groupData.handlers

  console.log(groupData)
  console.log(userData)
*/

  console.log(groupData);
  console.log(servingData);

  return (
    <div className="flex gap-3 flex-col p-3 bg-slate-50 sm:w-max">
      <div className="flex gap-3 items-start sm:flex-wrap flex-col sm:flex-row">
        <div>
          <h2>Grupper</h2>
          <table className="table-auto text-left border-collapse bg-white">
            <thead>
              <tr>
                <th className="border p-1">Grupp</th>
                <th className="border p-1">Antal</th>
                <th className="border p-1">Diet</th>
                <th className="border p-1">Primär handledare</th>
                <th className="border p-1">Dukning</th>
              </tr>
            </thead>
            <tbody>
              {groupData?.map((i: any, key: Key) => (
                <tr
                  key={key}
                  onClick={() => selectGroup(i.groupID as number)}
                  className="cursor-pointer hover:bg-slate-100 even:bg-slate-50"
                >
                  <td className="border p-1">{i.name}</td>
                  <td className="border p-1">{i.count}</td>
                  <td className="border p-1">{i.diet}</td>
                  <td className="border p-1">{i.primaryHandler.email}</td>
                  <td className="border p-1">
                    {
                      servingData.find((x) => x.servingID === i.servingID)
                        ?.servingName
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form className="flex flex-col gap-1" onSubmit={groupHandleSubmit}>
          <h2>
            {isGroupSelected
              ? `Ändra grupp ${getSelectedGroup().name}`
              : "Lägg till ny grupp"}
          </h2>
          <label htmlFor="groupName">Namn</label>
          <input
            type="text"
            name="groupName"
            id="groupName"
            className="bg-white p-1"
            onChange={groupHandleChange}
            required
            value={groupForm.groupName}
          />
          <label htmlFor="groupCount">Antal</label>
          <input
            type="number"
            name="groupCount"
            id="groupCount"
            className="bg-white p-1"
            min={1}
            onChange={groupHandleChange}
            required
            value={groupForm.groupCount}
          />
          <label htmlFor="groupDiet">Diet</label>
          <input
            type="number"
            name="groupDiet"
            id="groupDiet"
            className="bg-white p-1"
            min={0}
            onChange={groupHandleChange}
            required
            value={groupForm.groupDiet}
          />
          <label htmlFor="groupHandler">Primär handledare</label>
          <select
            name="groupHandler"
            id="groupHandler"
            className="bg-white p-1"
            onChange={groupHandleChange}
            value={groupForm.groupHandler}
          >
            <option value="">Ingen primär</option>
            {userData.map((i: any, key: any) => (
              <option value={i.id} key={key}>
                {i.email}
              </option>
            ))}
          </select>
          Servering
          <select
            name="groupServing"
            id="groupServing"
            className="bg-white p-1"
            onChange={groupHandleChange}
            value={groupForm.groupServing}
          >
            <option value="0">Ingen servering</option>
            {servingData.map((i: any, key: any) => (
              <option value={i.servingID} key={key}>
                {i.servingName}
              </option>
            ))}
          </select>
          <input
            type="submit"
            className="px-3 py-1 w-min bg-blue-300"
            value="Spara"
          ></input>
          <input
            type="button"
            className="px-3 py-1 w-min bg-red-300"
            value="Ränsa"
            onClick={resetSelectedGroup}
          ></input>
        </form>
      </div>
      {isGroupSelected ? (
        <div className="flex gap-3 items-start">
          <table className="table-auto text-left border-collapse">
            <thead>
              <tr className="border bg-white">
                <th colSpan={2}> Handledare för {getSelectedGroup().name}</th>
              </tr>
            </thead>
            <tbody>
              {getSelectedGroup().handlers?.map((i: any, key: Key) => (
                <tr key={key} className="bg-white even:bg-slate-50">
                  <td
                    className={`border p-1 ${
                      getSelectedGroup().primaryHandler.email === i.email
                        ? " font-bold"
                        : ""
                    }`}
                  >
                    {i.email}
                  </td>
                  {getSelectedGroup().primaryHandler.email === i.email ? (
                    <></>
                  ) : (
                    <td className="border p-1">
                      <form onSubmit={handlerDeleteHandleSubmit}>
                        <span className="material-icons-outlined flex items-center justify-center text-red-500 hover:text-opacity-60">
                          <input
                            type="hidden"
                            name="groupHandlerDeleteId"
                            id="groupHandlerDeleteId"
                            value={i.id}
                          />
                          <input type="submit" value="highlight_off" />
                        </span>
                      </form>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <form className="flex flex-col gap-1" onSubmit={handlerHandleSubmit}>
            <h2>Lägg till</h2>
            <select
              id="handlerName"
              name="handerName"
              className="bg-white p-1"
              onChange={handlerHandleChange}
              value={handlerForm}
            >
              <option value="">Välj handledare</option>
              {userData?.map((i: any, key: Key) => (
                <option key={key} value={i.id}>
                  {i.email}
                </option>
              ))}
            </select>
            <input
              type="submit"
              className="px-3 py-1 w-min whitespace-nowrap bg-blue-300"
              value="Lägg till"
            ></input>
          </form>
        </div>
      ) : (
        <p>Välj grupp ifrån tablellen för att hantera handledare.</p>
      )}
      {isGroupSelected ? (
        <div className="min-content">
          <button
            className="px-3 py-1 bg-red-500 hover:bg-opacity-60"
            onClick={groupDeleteSubmit}
          >
            Radera {getSelectedGroup().name}
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default SettingsGroups;

// function getSelectedUser() {
//   throw new Error('Function not implemented.')
// }
