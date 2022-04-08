import React, {useState, useEffect, Key, useCallback} from 'react'
import Spinner from '../../components/Spinner/Spinner'

function SettingsDates() {
  const [periodData, setPeriodData] = useState([{} as any] as any)
  const [excludedData, setExcludedData] = useState([{} as any] as any)
  const [selectedPeriod, setSelectedPeriod] = useState(-1)
  const [loadStatus, setLoadStatus] = useState([1, 2])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPeriodSelected, setIsPeriodSelected] = useState(false)
  const [selectedExcluded, setSelectedExcluded] = useState(-1)
  const [isExcludedSelected, setIsExcludedSelected] = useState(false)

  function selectPeriod (id: number) {
    setSelectedPeriod(id)
    setIsPeriodSelected(true)
  }

  function selectExcluded (id: number) {
    setSelectedExcluded(id)
    setIsExcludedSelected(true)
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
  }, [sectionLoaded])

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
  }, [sectionLoaded])
  
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
                  <tr className="bg-white even:bg-slate-50 cursor-pointer hover:bg-slate-100" onClick={() => selectPeriod(key as number)} key={key}>
                    <td className='p-1 border'>{i.periodName}</td>
                    <td className='p-1 border'>{i.startDate}</td>
                    <td className='p-1 border'>{i.endDate}</td>
                  </tr>
                )): <></>}
              </tbody>
            </table>
          </div>
          <div className='flex flex-col gap-1'>
            <h2>Lägg till / Ändra</h2>
            <label htmlFor="periodName">Namn</label>
            <input type="text" name="periodName" id="periodName" className='bg-white p-1'/>
            <label htmlFor="periodFrom">Från</label>
            <input type="date" name="periodFrom" id="periodFrom" className='bg-white p-1'/>
            <label htmlFor="periodTo">Till</label>
            <input type="date" name="periodTo" id="periodTo" className='bg-white p-1'/>
            <button className='px-3 py-1 w-min whitespace-nowrap bg-blue-300'>Spara</button>
          </div>
        </div>
        {isPeriodSelected
        ? <div className='min-content'>
        <button className='px-3 py-1 bg-red-500 hover:bg-opacity-60'>Radera {periodData[selectedPeriod].periodName}</button>
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
                  <tr className="bg-white even:bg-slate-50 cursor-pointer hover:bg-slate-100" onClick={() => selectExcluded(key as number)} key={key}>
                    <td className='p-1 border'>{i.name}</td>
                    <td className='p-1 border'>{i.date}</td>
                  </tr>
                )) : <></>}
              </tbody>
            </table>
                </div>
                <div className='flex flex-col gap-1'>
            <h2>Lägg till / Ändra</h2>
            <label htmlFor="excludedName">Namn</label>
            <input type="text" name="excludedName" id="excludedName" className='bg-white p-1'/>
            <label htmlFor="excludedDate">Datum</label>
            <input type="date" name="excludedDate" id="excludedDate" className='bg-white p-1'/>
            <button className='px-3 py-1 w-min whitespace-nowrap bg-blue-300'>Spara</button>
          </div>
        </div>
          {isExcludedSelected
          ? <div className='min-content'>
          <button className='px-3 py-1 bg-red-500 hover:bg-opacity-60'>Radera {excludedData[selectedExcluded].name}</button>
        </div>
        :<>Välj ett exkluderad datum för att radera den.</>}
      </div>
  )
}

export default SettingsDates