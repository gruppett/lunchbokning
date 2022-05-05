import React, {useState, useEffect, Key} from 'react'
import Spinner from '../../components/Spinner/Spinner'
import moment from 'moment'
import iStringKeys from '../../interfaces/iStringKeys'
import Alert from '../../components/Alert/Alert'


interface iForm extends iStringKeys {
  period: {
    name: string,
    endDate: string,
    startDate: string,
  },
  excluded: {
    name: string,
    date: string,
  },
  serving: {
    name: string,
    time: string,
  }
}

interface iSelected{
  period: number,
  excluded: number,
  serving: number
}

interface iFetched {
  serving: any,
  excluded: any,
  period: any
}

interface iFetchHelp {
  name: keyof iFetched,
  url: string
}

const fetchHelp = [
  {
    name: 'period',
    url: 'period/getPeriods.php',
  } as iFetchHelp,
  {
    name: 'excluded',
    url: 'date/getExcludes.php',
  } as iFetchHelp,
  {
    name: 'serving',
    url: 'serving/getServings.php',
  } as iFetchHelp
]

function formatDate(date: Date) {
  const dateFormat = "YYYY-MM-DD"
  return moment(date).format(dateFormat)
}
function formatTime(date: Date){
  const timeFormat = "HH:mm:ss"
  return moment(date).startOf("minute").format(timeFormat)
}
function formatTimeToLocaleString(time: string){   
  let newDate: any = moment(time, "HH:mm:SS")
  newDate = new Date(newDate)
  const newDateArray = newDate.toLocaleTimeString("fi-FI").split(".")
  newDateArray.pop()
  return newDateArray.join(".")
}
function formatDateToLocaleString(date: string) {
  const newDate = new Date(date)
  return newDate.toLocaleDateString("fi-FI")
}

function SettingsDates() {
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    period: {
      name: '',
      endDate: formatDate(new Date()),
      startDate: formatDate(new Date()),
    },
    excluded: {
      name: '',
      date: formatDate(new Date()),
    },
    serving: {
      name: '',
      time: formatTime(new Date()),
    }
  } as iForm)
  const [selected, setSelected] = useState({
    period: -1,
    excluded: -1,
    serving: -1
  } as iSelected)
  const [fetchedData, setFetchedData] = useState({} as iFetched)
  const [refetch, setRefetch] = useState(0)
  const [error, seterror] = useState(false as any)

  function triggerRefetch() {
    setRefetch(refetch + 1)
  }

  function isSelected<K extends keyof typeof selected>(key: K) {
    return selected[key] > 0 ? true : false
  }
  function getSelected<K extends keyof typeof fetchedData>(key: K) {
    switch (key) {
      case "period":
        return fetchedData.period.find((x: { periodID: number }) => x.periodID === selected.period)
      case "excluded":
        return fetchedData.excluded.find((x: { id: number }) => x.id === selected.excluded)
      case "serving":
        return fetchedData.serving.find((x: { servingID: number }) => x.servingID === selected.serving)
    }
  }
  function select<K extends keyof typeof selected>(key: K, id: number) {
    const newSelected = selected
    newSelected[key] = id
    const newForm: any = formData
    const selectedData = getSelected(key)
    switch (key) {
      case 'period':
        newForm[key].name = selectedData.periodName
        newForm[key].startDate = selectedData.startDate
        newForm[key].endDate = selectedData.endDate
        break
      case "excluded":
        newForm[key].name = selectedData.name
        newForm[key].date = selectedData.date
        break
      case "serving":
        newForm[key].name = selectedData.servingName
        newForm[key].time = selectedData.time
        break
    }
    setFormData({...newForm})
    setSelected({...newSelected})
  }
  function deselect<K extends keyof typeof selected>(key:K) {
    const newSelected = selected
    newSelected[key] = -1
    const newForm: any = formData
    switch (key) {
      case 'period':
        newForm[key].name = ''
        newForm[key].startDate = formatDate(new Date())
        newForm[key].endDate = formatDate(new Date())
        break
      case "excluded":
        newForm[key].name = ''
        newForm[key].date = formatDate(new Date())
        break
      case "serving":
        newForm[key].name = ''
        newForm[key].time = formatTime(new Date())
        break
    }
    setFormData({...newForm})
    setSelected({...newSelected})
  }

  function formHandleChange (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const form = e.target.parentElement?.attributes.getNamedItem('name')?.value as string
    const target = e.target
    const value = target.value
    const name = target.name
    const newFormData = formData
    newFormData[form][name] = value
    setFormData({...newFormData})
  }

  async function periodHandleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data:any = formData.period

    if (!isSelected('period')) {
      const response = await fetch(process.env.REACT_APP_API_SERVER + "period/postPeriod.php", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "API-Key": process.env.REACT_APP_API_KEY as string,
        }})
      console.log(response)
      const resJson = await response.json()
      if (!response.ok) {
        seterror(resJson.error)
      }
      triggerRefetch()
      return
    }
    data.periodID = selected.period
    const response = await fetch(process.env.REACT_APP_API_SERVER + "period/updatePeriod.php", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "API-Key": process.env.REACT_APP_API_KEY as string,
      }})
    console.log(response)
    const resJson = await response.json()
    if (!response.ok) {
      seterror(resJson.error)
    }
    triggerRefetch()
  }

  async function excludedHandleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data:any = formData.excluded
    if (!isSelected('excluded')) {
      const response = await fetch(process.env.REACT_APP_API_SERVER + "date/postExclude.php", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "API-Key": process.env.REACT_APP_API_KEY as string,
        }})
      console.log(response)
      const resJson = await response.json()
      if (!response.ok) {
        seterror(resJson.error)
      }
      triggerRefetch()
      return
    }
    data.id = selected.excluded
    const response = await fetch(process.env.REACT_APP_API_SERVER + "date/updateExclude.php", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "API-Key": process.env.REACT_APP_API_KEY as string,
      }})
    console.log(response)
    const resJson = await response.json()
    if (!response.ok) {
      seterror(resJson.error)
    }
    triggerRefetch()
  }

  async function servingHandleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data:any = formData.serving
    data.startTime = moment(data.startTime, "HH:mm").format("HH:mm:ss")
    data.endTime = moment(data.endTime, "HH:mm").format("HH:mm:ss")
    if (!isSelected('serving')) {
      const response = await fetch(process.env.REACT_APP_API_SERVER + "serving/postServing.php", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "API-Key": process.env.REACT_APP_API_KEY as string,
        }})
      console.log(response)
      const resJson = await response.json()
      if (!response.ok) {
        seterror(resJson.error)
      }
      triggerRefetch()
      return
    }
    data.id = selected.serving
    const response = await fetch(process.env.REACT_APP_API_SERVER + "serving/updateServing.php", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "API-Key": process.env.REACT_APP_API_KEY as string,
      }})
    console.log(response)
    const resJson = await response.json()
    if (!response.ok) {
      seterror(resJson.error)
    }
    triggerRefetch()
  }

  async function deleteExcluded () {
    const data = {
      id: selected.excluded
    }
    const response = await fetch(process.env.REACT_APP_API_SERVER + "date/deleteExclude.php", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "API-Key": process.env.REACT_APP_API_KEY as string,
      }})
    console.log(response)
    const resJson = await response.json()
    if (!response.ok) {
      seterror(resJson.error)
    }
    deselect('excluded')
    triggerRefetch()
  }

  async function deletePeriod () {
    const data = {
      periodID: selected.period
    }
    try {
    const response = await fetch(process.env.REACT_APP_API_SERVER + "period/deletePeriod.php", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "API-Key": process.env.REACT_APP_API_KEY as string,
      }})
    console.log(response)

    const resJson = await response.json()
    if (!response.ok) {
      seterror(resJson.error)
    }
    } catch (error) {
      console.log(error)
    }
    deselect("period")
    triggerRefetch()
  }

  async function deleteServing () {
    const data = {
      id: selected.serving
    }
    try {
      const response = await fetch(process.env.REACT_APP_API_SERVER + "serving/deleteServing.php", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "API-Key": process.env.REACT_APP_API_KEY as string,
        }})
      console.log(response)
      const resJson = await response.json()
      if (!response.ok) {
        seterror(resJson.error)
      }
      } catch (error) {
        console.log(error)
      }
    deselect("serving")
    triggerRefetch()
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const results = await Promise.all(fetchHelp.map(i => {
          return fetch(process.env.REACT_APP_API_SERVER + i.url, {
            headers: {
              "API-Key": process.env.REACT_APP_API_KEY as string,
            }
          })
        }))
        const data = await Promise.all(results.map((i) => {
          if (i.ok) {
            return i.json()
          }
          return null
        }))
        const newFetchedData = fetchedData
        data.map((i, key) => (

          newFetchedData[fetchHelp[key].name] = i
        ))
        setFetchedData(newFetchedData)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch])
  
  if (loading) {
    return <Spinner />
  }
  
  return (
    <>
    <div className="flex gap-3 p-3 flex-col">
    {error && <Alert setError={seterror} error={error}/>}
      <div className=''>
        <div className="flex gap-6 items-start sm:flex-wrap flex-col sm:flex-row">
          <div>
            <h2 className="text-xl">Perioder</h2>
            <table className='table-auto text-left border-collapse'>
              <thead>
                <tr className='bg-white'>
                  <th className='p-1 border'>Namn</th>
                  <th className='p-1 border'>Från</th>
                  <th className='p-1 border'>Till</th>
                </tr>
              </thead>
              <tbody>
                {fetchedData.period ? fetchedData.period.map((i: any, key: Key) => (
                  <tr className="bg-white even:bg-slate-50 cursor-pointer hover:bg-slate-100" onClick={() => select("period",i.periodID as number)} key={key}>
                    <td className='p-1 border'>{i.periodName}</td>
                    <td className='p-1 border'>{formatDateToLocaleString(i.startDate)}</td>
                    <td className='p-1 border'>{formatDateToLocaleString(i.endDate)}</td>
                  </tr>
                )): <></>}
              </tbody>
            </table>
          </div>
          <form className='flex flex-col gap-1' name="period" onSubmit={periodHandleSubmit}>
            <h2>{!isSelected("period") ? "Lägg till" : `Ändra ${getSelected("period").periodName}`}</h2>
            <label htmlFor="periodName">Namn</label>
            <input type="text" name="name" id="periodName" className='bg-slate-50 border p-1'value={formData.period.name} onChange={formHandleChange} required 
            pattern="[a-zA-ZåäöÅÄÖ0-9 ]+" />
            <label htmlFor="periodFrom">Från</label>
            <input type="date" name="startDate" id="periodFrom" className='bg-slate-50 border p-1'value={formData.period.startDate.toString()} onChange={formHandleChange} required/>
            <label htmlFor="periodTo">Till</label>
            <input type="date" name="endDate" id="periodTo" className='bg-slate-50 border p-1'value={formData.period.endDate.toString()} onChange={formHandleChange} required/>
            <div className="flex gap-1">
              <input type="submit" className='px-3 py-1 w-min whitespace-nowrap bg-blue-300' value="Spara" />
              <button type="button" className='px-3 py-1 w-min whitespace-nowrap bg-red-300' onClick={() => deselect("period")}>Rensa</button>
            </div>
          </form>
        </div>
        {isSelected("period")
        ? <div className='min-content'>
        <button className='px-3 py-1 bg-red-500 hover:bg-opacity-60' onClick={deletePeriod}>Radera {getSelected("period").periodName}</button>
      </div>
        :<p>Välj en period för att hantera den.</p>}
      </div>
      <div className="flex gap-6 items-start sm:flex-wrap flex-col sm:flex-row">
        <div className=''>

        <h2 className="text-xl">Exkluderade datum</h2>
          <table className='table-auto text-left border-collapse'>
              <thead>
                <tr className='bg-white'>
                  <th className='p-1 border'>Namn</th>
                  <th className='p-1 border'>Datum</th>
                </tr>
              </thead>
              <tbody>
                {fetchedData.excluded ? fetchedData.excluded.map((i: any, key: Key) => (
                  <tr className="bg-white even:bg-slate-50 cursor-pointer hover:bg-slate-100" onClick={() => select("excluded",i.id)} key={key}>
                    <td className='p-1 border'>{i.name}</td>
                    <td className='p-1 border'>{formatDateToLocaleString(i.date)}</td>
                  </tr>
                )) : <></>}
              </tbody>
            </table>
              </div>
              <form className='flex flex-col gap-1' name='excluded' onSubmit={excludedHandleSubmit}>
              <h2>{!isSelected("excluded") ? "Lägg till" : `Ändra ${getSelected("excluded").name}`}</h2>
            <label htmlFor="excludedName">Namn</label>
            <input type="text" name="name" id="excludedName" className='bg-slate-50 border p-1'value={formData.excluded.name} onChange={formHandleChange} 
            pattern="[a-zA-ZåäöÅÄÖ0-9 ]+"/>
            <label htmlFor="excludedDate">Datum</label>
            <input type="date" name="date" id="excludedDate" className='bg-slate-50 border p-1'value={formData.excluded.date.toString()} onChange={formHandleChange}/>
            <div className="flex gap-1">
              <input type="submit" className='px-3 py-1 w-min whitespace-nowrap bg-blue-300' value="Spara"/>
              <button type="button" className='px-3 py-1 w-min whitespace-nowrap bg-red-300' onClick={() => deselect("excluded")}>Rensa</button>
            </div>
          </form>
        </div>
          {isSelected("excluded")
          ? <div className='min-content'>
          <button type="button" className='px-3 py-1 bg-red-500 hover:bg-opacity-60' onClick={deleteExcluded}>Radera {getSelected("excluded").name}</button>
        </div>
        :<p>Välj ett exkluderad datum för att hantera den.</p>}
        <div className="flex gap-6 items-start sm:flex-wrap flex-col sm:flex-row">
        <div className=''>
        <h2 className="text-xl">Dukningar</h2>
          <table className='table-auto text-left border-collapse'>
              <thead>
                <tr className='bg-white'>
                  <th className='p-1 border'>Namn</th>
                  <th className='p-1 border'>Tid</th>
                </tr>
              </thead>
              <tbody>
                {fetchedData.serving ? fetchedData.serving.map((i: any, key: Key) => (
                  <tr className="bg-white even:bg-slate-50 cursor-pointer hover:bg-slate-100" key={key} onClick={() => select("serving", i.servingID)}>
                    <td className='p-1 border'>{i.servingName}</td>
                    <td className='p-1 border'>{formatTimeToLocaleString(i.time)}</td>
                  </tr>
                )) : <></>}
              </tbody>
            </table>
              </div>
            <form className='flex flex-col gap-1' name='serving' onSubmit={servingHandleSubmit}>
              <h2>{!isSelected("serving") ? "Lägg till" : `Ändra ${getSelected("serving").servingName}`}</h2>
              <label htmlFor="servingName">Namn</label>
              <input type="text" name="name" id="servingName" className='bg-slate-50 border p-1'value={formData.serving.name} onChange={formHandleChange} 
            pattern="[a-zA-ZåäöÅÄÖ0-9 ]+"/>
              <label htmlFor="servingTime">Tid</label>
              <input type="time" name="time" id="servingTime" className='bg-slate-50 border p-1'value={formData.serving.time} onChange={formHandleChange}/>
              <div className="flex gap-1">
                <input type="submit" className='px-3 py-1 w-min whitespace-nowrap bg-blue-300' value="Spara"/>
                <button type="button" className='px-3 py-1 w-min whitespace-nowrap bg-red-300' onClick={() => deselect("serving")}>Rensa</button>
              </div>
            </form>
          </div>
          {isSelected("serving")
          ? <div className='min-content'>
          <button type="button" className='px-3 py-1 bg-red-500 hover:bg-opacity-60' onClick={deleteServing}>Radera</button>
        </div>
        :<>Välj en servering för att hantera den.</>}
      </div>
    </>
  )
}

export default SettingsDates