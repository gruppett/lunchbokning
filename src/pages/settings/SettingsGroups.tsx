import React, { useState, useEffect, Key, useCallback } from "react";
import Spinner from "../../components/Spinner/Spinner";
import Alert from "../../components/Alert/Alert"
import mailToShort from "../../helpers/mailToShort";

interface groupFormInterfaceKeys {
  [key: string]: string | boolean | undefined;
}

interface groupFormInterface extends groupFormInterfaceKeys {
  groupName: string;
  groupCount: string;
  groupDiet: string;
  groupHandler: string;
  groupServing: string;
  groupExternal: boolean;
}
interface groupFormSubmitInterface extends groupFormInterfaceKeys {
  name?: string;
  count?: string;
  diet?: string;
  employeeID?: string;
  groupID?: string;
  groupServing?: string;
  groupExternal?: string;
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
    groupServing: "0",
    groupExternal: false,
  } as groupFormInterface);
  const [handlerForm, setHandlerForm] = useState("");
  const [reload, setReload] = useState(0);
  const [error, setError] = useState(false as any);

  function selectGroup(id: number) {
    const group = groupData.find((x) => x.groupID === id);
    const data = {
      groupName: group.name,
      groupCount: group.count,
      groupDiet: group.diet,
      groupHandler: group.primaryHandler.id || "",
      groupID: group.groupID,
      groupServing: group.servingID,
      groupExternal: group.external === 1 ? true : false,
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
      groupServing: "0",
      groupExternal: false,
    };
    setGroupForm({...data});
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
        "API-Key": process.env.REACT_APP_API_KEY as string,
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
        "API-Key": process.env.REACT_APP_API_KEY as string,
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
        "API-Key": process.env.REACT_APP_API_KEY as string,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setServingData(data);
        sectionLoaded();
      });
  }, [reload, sectionLoaded]);

  function getAvailableUsers () {
    if (!getSelectedGroup()?.handlers) {
      return userData
    }
    let availableUsers: any = []

    getOnlyHandlers().forEach((user) => {
      if (!getSelectedGroup()?.handlers.some((x: { id: number }) => x.id === user.id)) {
        availableUsers.push(user)
      }
    });
    return availableUsers
  }

  function getOnlyHandlers() {
    return userData.filter((x) => x.roles.includes(4));
  }

  function getAvailablePriamryUsers () {
    let availableUsers: any = []
    getOnlyHandlers().forEach((user) => {
      if (getSelectedGroup()?.primaryHandler.id === user.id) {
        availableUsers.push(user)
        return
      }
      if (user.groups?.some((x: { primary: number }) => x.primary === 1)) {
        return 
      } else {
        availableUsers.push(user)
      }
    })
    return availableUsers
  }

  function groupHandleChange(event: { target: any }) {
    const target = event.target;
    let value = target.value;
    if (target.name === "groupExternal") {
      value = target.checked ? true : false;
    }
    console.log(target.checked)
    const name = target.name;
    const form = groupForm;
    form[name] = value;
    setGroupForm({...form});
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
      external: groupForm.groupExternal ? 1 : 0,
    } as unknown as groupFormSubmitInterface;
    if (data.employeeID === "") {  
      delete data.employeeID;
    }
    if (!isGroupSelected) {
      resetSelectedGroup()
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
      if (!response.ok) {
        const data = await response.json();
        console.log(data)
        setError(data.error);
      }
      reloadData();
      return;
    }
    let updateData = data;
    updateData.groupID = selectedGroup.toString();
    resetSelectedGroup()
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
    if (!response.ok) {
      const data = await response.json();
      console.log(data)
      setError(data.error);
    }
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
    if (!response.ok) {
      const data = await response.json();
      console.log(data)
      setError(data.error);
    }
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
    if (!response.ok) {
      const data = await response.json();
      console.log(data)
      setError(data.error);
    }
    console.log(await response);
    reloadData();
    return;
  }

  if (!isLoaded) {
    return <Spinner></Spinner>;
  }

  console.log(groupForm)

  return (
    <div className="flex gap-3 flex-col p-3l">
    {error ? <Alert error={error} setError={setError}></Alert> : <></>}
      <div className="flex gap-6 items-start sm:flex-wrap flex-col sm:flex-row">
        <div className="min-w-min">
          <h2 className="text-xl">Grupper</h2>
          <table className="table-auto text-left border-collapse bg-white hidden sm:table">
            <thead>
              <tr>
                <th className="border p-1">Grupp</th>
                <th className="border p-1">Antal</th>
                <th className="border p-1">Diet</th>
                <th className="border p-1">Primär handledare</th>
                <th className="border p-1">Dukning</th>
                <th className="border p-1">Extern</th>
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
                  <td className="border p-1">{i.primaryHandler.email && mailToShort(i.primaryHandler.email)}</td>
                  <td className="border p-1">{servingData.find((x) => x.servingID === i.servingID)?.servingName}</td>
                  <td className="border p-1 text-center">
                    {i.external ?
                      <span className="material-icons-outlined">
                        done
                      </span>
                      : <></>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="table-auto text-left border-collapse bg-white sm:hidden table">
            {groupData?.map((i: any, key: Key) => (
              <tbody key={key} className="even:bg-slate-50">
                <tr className="border p-1 border-t-4">
                  <th className="border p-1">Grupp</th>
                  <td className="border p-1">{i.name}</td>
                </tr>
                <tr>
                  <th className="border p-1">Antal</th>
                  <td className="border p-1">{i.count}</td>
                </tr>
                <tr>
                  <th className="border p-1">Diet</th>
                  <td className="border p-1">{i.diet}</td>
                </tr>
                <tr>
                  <th className="border p-1">Primär handledare</th>
                  <td className="border p-1">{i.primaryHandler.email && mailToShort(i.primaryHandler.email)}</td>
                </tr>
                <tr>
                  <th className="border p-1">Dukning</th>
                  <td className="border p-1">{servingData.find((x) => x.servingID === i.servingID)?.servingName}</td>
                </tr>
                <tr>
                  <th className="border p-1">Extern</th>
                  <td className="border p-1 text-center">
                    {i.external ?
                      <span className="material-icons-outlined">
                        done
                      </span>
                      : <></>
                    }
                  </td>
                </tr>
                <tr>
                  <td className="border border-b-4" colSpan={2}>
                    <button className="bg-blue-300 w-full" onClick={() => selectGroup(i.groupID as number)}>
                      Redigera
                    </button>
                  </td>
                </tr>
            </tbody>
              ))}
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
            className="p-1 bg-slate-50 border"
            onChange={groupHandleChange}
            required
            value={groupForm.groupName}
            pattern="[a-zA-ZåäöÅÄÖ0-9 ]+"
          />
          <label htmlFor="groupCount">Antal</label>
          <input
            type="number"
            name="groupCount"
            id="groupCount"
            className="bg-slate-50 border p-1"
            min={1}
            onChange={groupHandleChange}
            required
            value={groupForm.groupCount}
            pattern="[0-9]+"
          />
          <label htmlFor="groupDiet">Diet</label>
          <input
            type="number"
            name="groupDiet"
            id="groupDiet"
            className="bg-slate-50 border p-1"
            min={0}
            onChange={groupHandleChange}
            required
            value={groupForm.groupDiet}
            pattern="[0-9]+"
          />
          <label htmlFor="groupHandler">Primär handledare</label>
          <select
            name="groupHandler"
            id="groupHandler"
            className="bg-slate-50 border p-1"
            onChange={groupHandleChange}
            value={groupForm.groupHandler}
          >
            <option value="">Ingen primär</option>
            {getAvailablePriamryUsers().map((i: any, key: any) => (
              <option value={i.id} key={key}>
                {mailToShort(i.email)}
              </option>
            ))}
          </select>
          Servering
          <select
            name="groupServing"
            id="groupServing"
            className="bg-slate-50 border p-1"
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
          <div className="flex gap-1 items-center">
            <input type="checkbox" name="groupExternal" id="groupExternal" checked={groupForm.groupExternal} onChange={groupHandleChange}/>
            <label htmlFor="groupExternal">Extern</label>
          </div>
          <input
            type="submit"
            className="px-3 py-1 w-min bg-blue-300"
            value="Spara"
          ></input>
          <input
            type="button"
            className="px-3 py-1 w-min bg-red-300"
            value="Rensa"
            onClick={resetSelectedGroup}
          ></input>
        </form>
      </div>
      {isGroupSelected ? (
        <div className="flex gap-6 items-start">
          <table className="table-auto text-left border-collapse">
            <thead>
              <tr className="border bg-white">
                <th colSpan={2} className="p-1 border" >Handledare för {getSelectedGroup().name}</th>
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
                    {mailToShort(i.email)}
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
              className="bg-slate-50 border p-1"
              onChange={handlerHandleChange}
              value={handlerForm}
            >
              <option value="">Välj handledare</option>
              {getAvailableUsers().map((i: any, key: Key) => (
                <option key={key} value={i.id}>
                  {mailToShort(i.email)}
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
