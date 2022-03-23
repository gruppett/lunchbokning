import React, {useState} from 'react'
import { mailToName } from '../../helpers/mailToName'

const dummyGroupData = [
  {
    name: "IT32",
    count: 16,
    primaryHandler: "Jimmy.Jansson@gymnasium.ax",
    handlers: [
      "Jimmy.Jansson@gymnasium.ax"
    ]
  },
  {
    name: "SERV32",
    count: 16,
    primaryHandler: "Simmy.Sansson@gymnasium.ax",
    handlers: [
      "Simmy.Sansson@gymnasium.ax",
      "Mimmy.Mansson@gymnasium.ax"
    ]
  },
  {
    name: "MERK32",
    count: 16,
    primaryHandler: "Mimmy.Mansson@gymnasium.ax",
    handlers: [
      "Mimmy.Mansson@gymnasium.ax",
      "Simmy.Sansson@gymnasium.ax",
      "Iimmy.Iansson@gymnasium.ax",
      "Kimmy.Kansson@gymnasium.ax",
    ]
  }
]

const dummyHandlerData = [
  {
    name: "Jimmy.Jansson@gymnasium.ax",
    id: 0
  },
  {
    name: "Simmy.Sansson@gymnasium.ax",
    id: 1
  },
  {
    name: "Mimmy.Mansson@gymnasium.ax",
    id: 2
  },
]



function SettingsGroups() {
  const [selectedGroup, setSelectedGroup] = useState(-1)
  const [isGroupSelected, setIsGroupSelected] = useState(false)
  function selectGroup (id: number) {
    setSelectedGroup(id)
    setIsGroupSelected(true)
  }


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
            <th className='border p-1'>Handledare</th>
          </tr>
        </thead>
        <tbody> 
        {dummyGroupData.map((d, i) => (
          <tr key={i} onClick={() => selectGroup(i)} className='cursor-pointer hover:bg-slate-100 even:bg-slate-50'>
            <td className='border p-1'>{d.name}</td>
            <td className='border p-1'>{d.count}</td>
            <td className='border p-1'>{mailToName(d.primaryHandler)}</td>
          </tr> 
        ))}
        </tbody>
      </table>
      
        </div>
      <div className='flex flex-col gap-1'>
        <h2>Lägg till / Ändra</h2>
        <label htmlFor="groupName">Namn</label>
        <input type="text" name="groupName" id="groupName" className='bg-white p-1'/>
        <label htmlFor="groupCount">Antal</label>
        <input type="number" name="groupCount" id="groupCount" className='bg-white p-1'/>
        <label htmlFor="groupHandler">Handledare</label>
        <select name="groupHandler" id="groupHandler" className='bg-white p-1'>
          <option value="">Välj primär handledare</option>
          {dummyHandlerData.map((d, i) => (
            <option value={d.id} key={i}>{mailToName(d.name)}</option>
          ))}
        </select>
        <button className='px-3 py-1 w-min bg-blue-300'>Spara</button>
      </div>
    </div>
      {isGroupSelected
      ?<div className='flex gap-3 items-start'>
        <table className="table-auto text-left border-collapse">
          <thead>
            <tr className='border bg-white'>
              <th colSpan={2}> Handledare för {dummyGroupData[selectedGroup].name}</th>
            </tr>
          </thead>
          <tbody>
            {dummyGroupData[selectedGroup].handlers.map((d, i) => (
              <tr key={i} className='bg-white even:bg-slate-50'>
                <td className={`border p-1 ${dummyGroupData[selectedGroup].primaryHandler === d ? " font-bold" : ""}`} >{mailToName(d)}</td>
                {dummyGroupData[selectedGroup].primaryHandler !== d
                ?
                <td className="border p-1">
                  <span className='material-icons-outlined flex items-center justify-center text-red-500 cursor-pointer hover:text-opacity-60'>highlight_off</span>
                </td>
                :<></>}
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex flex-col gap-1'>
          <h2>Lägg till</h2>
          <select id='handlerName' name='handerName' className="bg-white p-1">
            <option value="">Välj handledare</option>
              {dummyHandlerData.map((d, i) => (
                <option key={i} value={d.name}>{mailToName(d.name)}</option>
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