import React, { useState, useEffect } from "react";
import Spinner from "../../components/Spinner/Spinner";
import UserRoles from "../../components/UserRoles/UserRoles";

const roles = [
  {
    id: 1,
    icon: "local_police",
    name: "Administrator",
  },
  {
    id: 2,
    icon: "table_restaurant",
    name: "Salslärare",
  },
  {
    id: 3,
    icon: "table_restaurant",
    name: "Kökslärare",
  },
  {
    id: 4,
    icon: "supervisor_account",
    name: "Handledare",
  },
  {
    id: 5,
    icon: "person",
    name: "Användare",
  },
];

function SettingsUsers() {
  const [selectedUser, setSelectedUser] = useState(-1);
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [usersData, setUsersData] = useState([{} as any] as any);
  const [groupsData, setGroupsData] = useState([{} as any] as any);
  const [isLoaded, setIsLoaded] = useState(false);
  const [reload, setReload] = useState(0);

  function reloadData() {
    setReload(reload + 1);
  }

  async function selectUser(id: number) {
    setSelectedUser(id);
    let rolesBool = [];
    const user = usersData.find((x: { id: number }) => x.id === id);
    for (let i = 0; i < 4; i++) {
      if (user.roles && user.roles.includes(i + 1)) {
        rolesBool.push(true);
      } else {
        rolesBool.push(false);
      }
    }
    setIsUserSelected(true);
  }

  function getSelectedUser() {
    const data = usersData.find((x: { id: number }) => x.id === selectedUser);
    return data;
  }

  function getUnassignedRoles() {
    if (!getSelectedUser().roles) {
      return roles;
    }
    const unassignedRoles = roles.filter(
      (x) => !getSelectedUser().roles.includes(x.id)
    );
    return unassignedRoles;
  }

  async function rolesDeleteHandleSubmit(e: any) {
    e.preventDefault();
    const data = {
      employeeID: selectedUser,
      roleID: e.target[0].value,
    };
    const response = await fetch(
      process.env.REACT_APP_API_SERVER + "role/deleteRole.php",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    reloadData();
  }
  async function rolesAddHandleSubmit(e: any) {
    e.preventDefault();
    const data = {
      employeeID: selectedUser,
      roleID: e.target[0].value,
    };
    const response = await fetch(
      process.env.REACT_APP_API_SERVER + "role/postRole.php",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    reloadData();
  }

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
        setUsersData(data);
      });
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
        setGroupsData(data);
        setIsLoaded(true);
      });
  }, [reload]);

  async function addUserHandleSubmit(event: any) {
    event.preventDefault();
    const data = {
      email: event.target.elements[0].value + "@gymnasium.ax",
    };
    const response = await fetch(
      process.env.REACT_APP_API_SERVER + "user/postUser.php",
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
    console.log(response);
    reloadData();
  }

  function getRole(id: number) {
    const role = roles.find((x: { id: number }) => x.id === id);
    return role;
  }

  if (!isLoaded) {
    return <Spinner />;
  }

  /*

  TODO: Remove entries in groupsData if they are in usersData.groups

  console.log(groupsData)
  console.log(usersData)

  */
  console.log(groupsData);
  return (
    <div className="flex gap-3 flex-col p-3 bg-slate-50 sm:w-max">
      <div className="flex gap-3 items-start sm:flex-wrap flex-col sm:flex-row">
        <div>
          <h2>Användare</h2>
          <table className="text-left border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="p-1 border">E-post</th>
                <th colSpan={5} className="p-1 border">
                  Roller
                </th>
              </tr>
            </thead>
            <tbody>
              {usersData?.map((i: any, key: any) => (
                <tr
                  key={key}
                  className="cursor-pointer bg-white hover:bg-slate-100 even:bg-slate-50"
                  onClick={() => selectUser(i.id)}
                >
                  <td className="p-1 border">{i.email}</td>
                  <UserRoles roles={i.roles}></UserRoles>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form className="flex gap-1 flex-col" onSubmit={addUserHandleSubmit}>
          <h2>Lägg till</h2>

          <label htmlFor="userMail">E-post</label>
          <div className="">
            <input
              type="text"
              name="userMail"
              id="userMail"
              className="p-1"
              required
            />
            <span>@gymnasium.ax</span>
          </div>
          <input
            type="submit"
            className="px-3 py-1 w-min whitespace-nowrap bg-blue-300"
            value="Lägg till"
          ></input>
        </form>
      </div>
      {isUserSelected ? (
        <>
          <div className="flex flex-col gap-1 items-start sm:flex-wrap flex-col sm:flex-row">
            <div>
              <h2>{getSelectedUser().email}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Roll</th>
                  </tr>
                </thead>
                <tbody>
                  {getSelectedUser().roles &&
                    getSelectedUser().roles.map((i: any, key: any) => (
                      <tr key={key}>
                        <td>{getRole(i)?.name}</td>
                        <td>
                          <form onSubmit={rolesDeleteHandleSubmit}>
                            <span className="material-icons-outlined flex items-center justify-center text-red-500 hover:text-opacity-60">
                              <input
                                type="hidden"
                                name="roleId"
                                id="roleId"
                                value={getRole(i)?.id}
                              />
                              <input type="submit" value="highlight_off" />
                            </span>
                          </form>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <form onSubmit={rolesAddHandleSubmit} className="">
              <h2>Lägg till roll</h2>
              <select className="p-1" required>
                <option value="">Välj en roll</option>
                {getUnassignedRoles() &&
                  getUnassignedRoles()?.map((i: any, key: any) => (
                    <option key={key} value={i.id}>
                      {i.name}
                    </option>
                  ))}
              </select>
              <input
                type="submit"
                value="Lägg till Roll"
                className="px-3 py-1 w-min whitespace-nowrap bg-blue-300"
              />
            </form>
          </div>
          <div className="flex gap-3 items-start sm:flex-wrap flex-col sm:flex-row">
            <table className="table-auto text-left border-collapse">
              <thead>
                <tr className="border bg-white">
                  <th colSpan={2}> Handledare över grupper</th>
                </tr>
              </thead>
              <tbody>
                {getSelectedUser().groups &&
                  getSelectedUser().groups.map((i: any, key: any) => (
                    <tr key={key} className="bg-white even:bg-slate-50">
                      <td className="border p-1">{i.name}</td>
                      <td className="border p-1">
                        <span className="material-icons-outlined flex items-center justify-center text-red-500 cursor-pointer hover:text-opacity-60">
                          highlight_off
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="flex flex-col gap-1">
              <h2>Lägg till</h2>
              <select
                id="handlerName"
                name="handerName"
                className="bg-white p-1"
              >
                <option value="">Välj Grupp</option>
                {getSelectedUser().groups &&
                  getSelectedUser().groups.map((i: any, key: any) => (
                    <option key={key} value={i.groupID}>
                      {i.name}
                    </option>
                  ))}
              </select>
              <button className="px-3 py-1 w-min whitespace-nowrap bg-blue-300">
                Lägg till
              </button>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default SettingsUsers;
