import React, {useState, useEffect} from 'react'
import Spinner from '../../components/Spinner/Spinner'
import UserRoles from '../../components/UserRoles/UserRoles'


const roleCheckboxes = [
  {
    id: "userIsAdmin",
    label: "Är adminstratör",
    icon: "local_police"
  },
  {
    id: "userIsHallTeacher",
    label: "Är salslärare",
    icon: "table_restaurant"  
  },
  {
    id: "userIsKitchenTeacher",
    label: "Är kökslärare",
    icon: "soup_kitchen"
  }
]

function SettingsUsers() {
  const [selectedUser, setSelectedUser] = useState(-1)
  const [isUserSelected, setIsUserSelected] = useState(false)
  const [usersData, setUsersData] = useState([{} as any])
  const [groupsData, setGroupsData] = useState([{} as any])
  const [isLoaded, setIsLoaded] = useState(false)
  const [reload, setReload] = useState(0)

  const [inputRoles, setInputRoles] = useState(
    new Array(3).fill(false)
  )

  function reloadData () {
    setReload(reload + 1)
  }

  function handleInputCheckboxesOnChange(position: any) {
    const updatedCheckedState = inputRoles.map((item, index) =>
      index === position ? !item : item
    );
    setInputRoles(updatedCheckedState);
  }

  async function selectUser (id: number) {
    setSelectedUser(id)
    setIsUserSelected(true)
  }

  function getSelectedUser () {
    return usersData.find(x => x.id === selectedUser)
  }



  useEffect(() => {
    let rolesBool = []
    for (let i = 0; i < 4; i++) {
      if (usersData[selectedUser]?.roles.includes(i+1)) {
        rolesBool.push(true)
      } else {
        rolesBool.push(false)
      }
    }
    setInputRoles(rolesBool)
  }, [selectedUser, usersData])
  

  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER + "/api/user/getUsers.php", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then((response) => response.json())
      .then(data => {
        setUsersData(data)
      });
      fetch(process.env.REACT_APP_API_SERVER + "/api/groups/getGroups.php", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        }
      })
        .then((response) => response.json())
        .then(data => {
          setGroupsData(data)
          setIsLoaded(true)
        });
  }, [reload])

  async function addUserHandleSubmit(event:any) {
    event.preventDefault()
    const data = {
      email: event.target.elements[0].value + "@gymnasium.ax"
    }
    console.log(data)
    const response = await fetch(process.env.REACT_APP_API_SERVER + "/api/user/postUser.php", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data)
    })
    console.log(response)
    reloadData()
  }



  if (!isLoaded) {
    return <Spinner />
  }

  /*

  TODO: Remove entries in groupsData if they are in usersData.groups

  console.log(groupsData)
  console.log(usersData)

*/

  return (
    <div className='flex gap-3 flex-col p-3 bg-slate-50 sm:w-max'>
      <div className='flex gap-3 items-start sm:flex-wrap flex-col sm:flex-row'>
      <div>
        <h2>Användare</h2>
        <table className='text-left border-collapse'>
          <thead>
            <tr className='bg-white'>
              <th className='p-1 border'>E-post</th>
              <th colSpan={4} className='p-1 border'>Roller</th>
            </tr>
          </thead>
          <tbody>
            {usersData?.map((i:any, key:any) => (
              <tr key={key} className="cursor-pointer bg-white hover:bg-slate-100 even:bg-slate-50" onClick={() => selectUser(i.id)}>
                <td className='p-1 border'>{i.email}</td>
                <UserRoles roles={i.roles}></UserRoles>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form className='flex gap-1 flex-col' onSubmit={addUserHandleSubmit}>
        <h2>Lägg till</h2>
        
        <label htmlFor="userMail">E-post</label>
        <div className="">
          <input type="text" name="userMail" id="userMail" className='p-1' required/>
          <span>@gymnasium.ax</span>
        </div>
        <input type="submit" className='px-3 py-1 w-min whitespace-nowrap bg-blue-300' value="Lägg till"></input>
      </form>
      </div>
      {isUserSelected
      ?<><div className='flex flex-col gap-1'>
        <h2>{getSelectedUser().email}</h2>
        {roleCheckboxes.map((i, key) => (
          <div className='flex gap-1 items-baseline' key={key}>
          <input type="checkbox" name={i.id} id={i.id} checked={inputRoles[key]} onChange={() => handleInputCheckboxesOnChange(key)}/>
          <label htmlFor={i.id} className='cursor-pointer flex'>{i.label}
            <span className='material-icons-outlined self.center'>
              {i.icon}
            </span>
          </label>  
        </div>
          ))}
        <button className='px-3 py-1 w-min whitespace-nowrap bg-blue-300'>Spara</button>
      </div>
      <div className="flex gap-3 items-start sm:flex-wrap flex-col sm:flex-row">
        <table className="table-auto text-left border-collapse">
          <thead>
            <tr className='border bg-white'>
              <th colSpan={2}> Handledare över grupper</th>
            </tr>
          </thead>
          <tbody>
            {getSelectedUser().groups.map((i:any, key:any) => (
              <tr key={key} className='bg-white even:bg-slate-50'>
                <td className="border p-1">{i}</td>
                <td className="border p-1">
                  <span className='material-icons-outlined flex items-center justify-center text-red-500 cursor-pointer hover:text-opacity-60'>highlight_off</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex flex-col gap-1'>
          <h2>Lägg till</h2>
          <select id='handlerName' name='handerName' className="bg-white p-1">
            <option value="">Välj Grupp</option>
              {getSelectedUser().map((i:any, key:any) => (
                <option key={key} value={i.groupID}>{i.name}</option>
              ))}
          </select>
          <button className='px-3 py-1 w-min whitespace-nowrap bg-blue-300'>Lägg till</button>
        </div>
      </div>
      </>
      :<></>}
    </div>
  )
}

export default SettingsUsers