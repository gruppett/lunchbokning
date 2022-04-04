import React, {useState, useEffect, Key, useCallback} from 'react'
import Spinner from '../../components/Spinner/Spinner'
import { mailToName } from '../../helpers/mailToName'

function SettingsGroups() {
  const [selectedGroup, setSelectedGroup] = useState(-1)
  const [isGroupSelected, setIsGroupSelected] = useState(false)
  const [groupData, setGroupData] = useState([{} as any])
  const [userData, setUserData] = useState([{} as any])
  const [loadStatus, setLoadStatus] = useState([0, 2])
  const [isLoaded, setIsLoaded] = useState(false)
  const [groupForm, setGroupForm] = useState({} as any)
  const [reload, setReload] = useState(0)

  function selectGroup (id: number) {
    setSelectedGroup(id)
    setIsGroupSelected(true)
  }

  const sectionLoaded = useCallback(() => {
  
    let status = loadStatus
    status[0] ++
    if (status[0] === status[1]) {
      setIsLoaded(true)
    }
    setLoadStatus(status)
  }, [loadStatus])

  useEffect(() => {
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
        setGroupData(data)
        sectionLoaded()
      });
    }, [reload]);

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
        setUserData(data)
        sectionLoaded()
      });
    }, [reload])

  function groupHandleChange (event: { target: any }) {
    const target = event.target
    const value = target.value
    const name = target.name
    const form = groupForm
    form[name] = value
    setGroupForm(form)
  }

  async function groupHandleSubmit (event: any) {
    const data = {
      name: groupForm.groupName,
      count: groupForm.groupCount,
      diet: groupForm.groupDiet,
    }
    event.preventDefault()
    const response = await fetch(process.env.REACT_APP_API_SERVER + "/api/groups/postGroup.php", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data)
    })
    console.log(await response)
    setReload(reload+1)
  }
  
  if (!isLoaded) {
    return <Spinner></Spinner>
  }

  console.log(groupData)
/*
  TODO: Remove entries in userData if they are in groupData.handlers

  console.log(groupData)
  console.log(userData)
*/
  return (
    <div className='flex gap-3 flex-col p-3 bg-slate-50 sm:w-max'>
    <div className="flex gap-3 items-start sm:flex-wrap flex-col sm:flex-row">
      <div>
        <h2>Grupper</h2>
      <table className='table-auto text-left border-collapse bg-white'>
        <thead>
          <tr>
            <th className='border p-1'>Grupp</th>
            <th className='border p-1'>Antal</th>
            <th className='border p-1'>Diet</th>
            <th className='border p-1'>Handledare</th>
          </tr>
        </thead>
        <tbody> 
        {groupData?.map((i: any, key:Key) => (
          <tr key={key} onClick={() => selectGroup(key as number)} className='cursor-pointer hover:bg-slate-100 even:bg-slate-50'>
            <td className='border p-1'>{i.name}</td>
            <td className='border p-1'>{i.count}</td>
            <td className='border p-1'>{i.diet}</td>
            <td className='border p-1'>{i.primaryHandler}</td>
          </tr> 
        ))}
        </tbody>
      </table>
      
        </div>
      <form className='flex flex-col gap-1' onSubmit={groupHandleSubmit}>
        <h2>Lägg till / Ändra</h2>
        <label htmlFor="groupName">Namn</label>
        <input type="text" name="groupName" id="groupName" className='bg-white p-1' onChange={groupHandleChange} required/>
        <label htmlFor="groupCount">Antal</label>
        <input type="number" name="groupCount" id="groupCount" className='bg-white p-1' min={1} onChange={groupHandleChange} required/>
        <label htmlFor="groupDiet">Diet</label>
        <input type="number" name="groupDiet" id="groupDiet" className='bg-white p-1'min={0} onChange={groupHandleChange} required/>
        <label htmlFor="groupHandler">Handledare</label>
        <select name="groupHandler" id="groupHandler" className='bg-white p-1' onChange={groupHandleChange} required>
          <option value="">Välj primär handledare</option>
          {userData.map((i:any, key:any) => (
            <option value={i.id} key={key}>{mailToName(i.email)}</option>
          ))}
        </select>
        <input type="submit" className='px-3 py-1 w-min bg-blue-300' value="Spara"></input>
      </form>
    </div>
      {isGroupSelected
      ?<div className='flex gap-3 items-start'>
        <table className="table-auto text-left border-collapse">
          <thead>
            <tr className='border bg-white'>
              <th colSpan={2}> Handledare för {groupData[selectedGroup].name}</th>
            </tr>
          </thead>
          <tbody>
            {groupData[selectedGroup].handlers?.map((i:any, key:Key) => (
              <tr key={key} className='bg-white even:bg-slate-50'>
                <td className={`border p-1 ${groupData[selectedGroup].primaryHandler === i ? " font-bold" : ""}`} >{mailToName(i)}</td>
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
            <option value="">Välj handledare</option>
              {userData?.map((i:any, key: Key) => (
                <option key={key} value={i.id}>{mailToName(i.email)}</option>
              ))}
          </select>
          <button className='px-3 py-1 w-min whitespace-nowrap bg-blue-300'>Lägg till</button>
        </div>
      </div>
      :<p>Välj grupp ifrån tablellen för att hantera handledare.</p>
      }
      {isGroupSelected
      ?<div className='min-content'>
        <button className='px-3 py-1 bg-red-500 hover:bg-opacity-60'>Radera grupp</button>
      </div>
      :<></>}
    </div>
  )
}

export default SettingsGroups