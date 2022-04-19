import React, {useState, useEffect, Key, useCallback} from 'react'
import Spinner from '../../components/Spinner/Spinner'
import moment from 'moment'
import iStringKeys from '../../interfaces/iStringKeys'


interface iForm extends iStringKeys {
  period: {
    name: string,
    endDate: string,
    startDate: string,
  },
  excluded: {
    name: string,
    date: string,
  }
}

function formatDate(date: Date) {
  const dateFormat = "YYYY-MM-DD"
  return moment(date).format(dateFormat)
}

function SettingsDates() {
  const [periodData, setPeriodData] = useState([{} as any] as any)
  const [excludedData, setExcludedData] = useState([{} as any] as any)
  const [selectedPeriod, setSelectedPeriod] = useState(-1)
  const [loadStatus, setLoadStatus] = useState([1, 2])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPeriodSelected, setIsPeriodSelected] = useState(false)
  const [selectedExcluded, setSelectedExcluded] = useState(-1)
  const [isExcludedSelected, setIsExcludedSelected] = useState(false)
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
  } as iForm)
  const [reload, setReload] = useState(0)

  function selectPeriod (id: number) {
    const newForm  = formData
    const period = periodData.find((x: { periodID: number }) => x.periodID === id)
    newForm.period.name = period.periodName
    newForm.period.startDate = period.startDate
    newForm.period.endDate = period.endDate
    setFormData(newForm)
    setSelectedPeriod(id)
    setIsPeriodSelected(true)
  }
  function getSelectedPeriod () {
    return periodData.find((x: { periodID: number }) => x.periodID === selectedPeriod)
  }
  function getSelectedExcluded () {
    return excludedData.find((x: { id: number }) => x.id === selectedExcluded)
  }

  function selectExcluded (id: number) {
    const newForm  = formData
    const excluded = excludedData.find((x: { id: number }) => x.id === id)
    newForm.excluded.name = excluded.name
    newForm.excluded.date = excluded.date
    setFormData(newForm)
    setSelectedExcluded(id)
    setIsExcludedSelected(true)
  }

  function reloadData () {
    setReload(reload + 1)
  }

  const sectionLoaded = useCallback(() => {
  
    let status = loadStatus
    status[0] ++
    if (status[0] === status[1]) {
      setIsLoaded(true)
    }
    setLoadStatus(status)
  }, [loadStatus])

  function formHandleChange (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const form = e.target.parentElement?.attributes.getNamedItem('name')?.value as string
    const target = e.target
    const value = target.value
    const name = target.name
    const newFormData = formData
    newFormData[form][name] = value
    setFormData(newFormData)
    reloadData()
  }

  async function periodHandleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = {
      name: formData.period.name,
      endDate: formData.period.endDate,
      startDate: formData.period.startDate,
    }

    if (selectedPeriod === -1) {
      const response = await fetch(process.env.REACT_APP_API_SERVER + "period/postPeriod.php", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }})
      console.log(response)
      reloadData()
      return
    }
    const editData = {
      name: formData.period.name,
      endDate: formData.period.endDate,
      startDate: formData.period.startDate,
      periodID: selectedPeriod
    }
    const response = await fetch(process.env.REACT_APP_API_SERVER + "period/updatePeriod.php", {
      method: "POST",
      body: JSON.stringify(editData),
      headers: {
        "Content-Type": "application/json"
      }})
    console.log(response)
    reloadData()
  }

  async function excludedHandleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = {
      name: formData.excluded.name,
      date: formData.excluded.date,
    }
    if (selectedExcluded === -1) {
    const response = await fetch(process.env.REACT_APP_API_SERVER + "date/postExclude.php", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }})
    console.log(response)
    reloadData()
    return
    }
    const editData = {
      name: formData.excluded.name,
      date: formData.excluded.date,
      id: selectedExcluded
    }
    const response = await fetch(process.env.REACT_APP_API_SERVER + "period/updatePeriod.php", {
      method: "POST",
      body: JSON.stringify(editData),
      headers: {
        "Content-Type": "application/json"
      }})
    console.log(response)
    reloadData()
  }

  function deleteExcluded () {
    const data = {
      id: selectedExcluded
    }
    const response = fetch(process.env.REACT_APP_API_SERVER + "date/deleteExclude.php", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }})
    console.log(response)
    deselectExcluded()
    reloadData()
  }
  function deletePeriod () {
    const data = {
      periodID: selectedPeriod
    }
    const response = fetch(process.env.REACT_APP_API_SERVER + "period/deletePeriod.php", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }})
    console.log(response)
    deselectPeriod()
    reloadData()
  }

  function deselectExcluded () {
    const newForm = formData
    newForm.excluded.name = ''
    newForm.excluded.date = ''
    setFormData(newForm)
    setSelectedExcluded(-1)
    setIsExcludedSelected(false)
  }

  function deselectPeriod () {
    const newForm = formData
    newForm.period.name = ''
    newForm.period.startDate = ''
    newForm.period.endDate = ''
    setFormData(newForm)
    setSelectedPeriod(-1)
    setIsPeriodSelected(false)
  }

  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER + "period/getPeriods.php", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.")
        }
        return response.json()
      })
      .then(data => {
        setPeriodData(data)
        sectionLoaded()
      })
      .catch((Error) => {
        console.log(Error)
        setPeriodData(false)
        sectionLoaded()
      })
  }, [sectionLoaded, reload])

  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER + "date/getExcludes.php", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.")
        }
        return response.json()
      })
      .then(data => {
        setExcludedData(data)
        sectionLoaded()
      })
      .catch((Error) => {
        console.log(Error)
        setExcludedData(undefined)
        sectionLoaded()
      })
  }, [sectionLoaded, reload])
  
  if (!isLoaded) {
    return <Spinner />
  }

  return (
    <div className="flex gap-3 p-3 bg-slate-50 sm:w-max flex-col">
      <div className=''>
        <div className="flex gap-3 items-start sm:flex-wrap flex-col sm:flex-row">
          <div>
            <h2>Perioder</h2>
            <table className='table-auto text-left border-collapse'>
              <thead>
                <tr className='bg-white'>
                  <th className='p-1 border'>Namn</th>
                  <th className='p-1 border'>Från</th>
                  <th className='p-1 border'>Till</th>
                </tr>
              </thead>
              <tbody>
                {periodData ? periodData.map((i: any, key: Key) => (
                  <tr className="bg-white even:bg-slate-50 cursor-pointer hover:bg-slate-100" onClick={() => selectPeriod(i.periodID as number)} key={key}>
                    <td className='p-1 border'>{i.periodName}</td>
                    <td className='p-1 border'>{i.startDate}</td>
                    <td className='p-1 border'>{i.endDate}</td>
                  </tr>
                )): <></>}
              </tbody>
            </table>
          </div>
          <form className='flex flex-col gap-1' name="period" onSubmit={periodHandleSubmit}>
            <h2>{!isPeriodSelected ? "Lägg till" : `Ändra ${getSelectedPeriod().periodName}`}</h2>
            <label htmlFor="periodName">Namn</label>
            <input type="text" name="name" id="periodName" className='bg-white p-1'value={formData.period.name} onChange={formHandleChange} required/>
            <label htmlFor="periodFrom">Från</label>
            <input type="date" name="startDate" id="periodFrom" className='bg-white p-1'value={formData.period.startDate.toString()} onChange={formHandleChange} required/>
            <label htmlFor="periodTo">Till</label>
            <input type="date" name="endDate" id="periodTo" className='bg-white p-1'value={formData.period.endDate.toString()} onChange={formHandleChange} required/>
            <input type="submit" className='px-3 py-1 w-min whitespace-nowrap bg-blue-300' value="Spara" />
            <button type="button" className='px-3 py-1 w-min whitespace-nowrap bg-red-300' onClick={deselectPeriod}>Ångra</button>
          </form>
        </div>
        {isPeriodSelected
        ? <div className='min-content'>
        <button className='px-3 py-1 bg-red-500 hover:bg-opacity-60' onClick={deletePeriod}>Radera {getSelectedPeriod().periodName}</button>
      </div>
        :<p>Välj en period för att radera den.</p>}
      </div>
      <div className="flex gap-3 items-start sm:flex-wrap flex-col sm:flex-row">
        <div className=''>

        <h2>Exkluderade datum</h2>
          <table className='table-auto text-left border-collapse'>
              <thead>
                <tr className='bg-white'>
                  <th className='p-1 border'>Namn</th>
                  <th className='p-1 border'>Datum</th>
                </tr>
              </thead>
              <tbody>
                {excludedData ? excludedData.map((i: any, key: Key) => (
                  <tr className="bg-white even:bg-slate-50 cursor-pointer hover:bg-slate-100" onClick={() => selectExcluded(i.id)} key={key}>
                    <td className='p-1 border'>{i.name}</td>
                    <td className='p-1 border'>{i.date}</td>
                  </tr>
                )) : <></>}
              </tbody>
            </table>
              </div>
              <form className='flex flex-col gap-1' name='excluded' onSubmit={excludedHandleSubmit}>
              <h2>{!isExcludedSelected ? "Lägg till" : `Ändra ${getSelectedExcluded().name}`}</h2>
            <label htmlFor="excludedName">Namn</label>
            <input type="text" name="name" id="excludedName" className='bg-white p-1'value={formData.excluded.name} onChange={formHandleChange}/>
            <label htmlFor="excludedDate">Datum</label>
            <input type="date" name="date" id="excludedDate" className='bg-white p-1'value={formData.excluded.date.toString()} onChange={formHandleChange}/>
            <input type="submit" className='px-3 py-1 w-min whitespace-nowrap bg-blue-300' value="Spara"/>
            <button type="button" className='px-3 py-1 w-min whitespace-nowrap bg-red-300' onClick={deselectExcluded}>Ångra</button>
          </form>
        </div>
          {isExcludedSelected
          ? <div className='min-content'>
          <button type="button" className='px-3 py-1 bg-red-500 hover:bg-opacity-60' onClick={deleteExcluded}>Radera {getSelectedExcluded().name}</button>
        </div>
        :<>Välj ett exkluderad datum för att radera den.</>}
      </div>
  )
}

export default SettingsDates