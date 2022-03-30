import React, {useState, useEffect, Key} from 'react'
import Spinner from '../../components/Spinner/Spinner'



function SettingsPeriods() {
  const [periodData, setPeriodData] = useState([{} as any])
  const [selectedPeriod, setSelectedPeriod] = useState(-1)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPeriodSelected, setIsPeriodSelected] = useState(false)

  function selectPeriod (id: number) {
    setSelectedPeriod(id)
    setIsPeriodSelected(true)
  }


  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER + "/api/period/getPeriods.php", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then((response) => response.json())
      .then(data => {
        setPeriodData(data)
        setIsLoaded(true)
      });
  }, [])
  
  if (!isLoaded) {
    return <Spinner />
  }

  return (
    <div className='flex gap-3 p-3 bg-slate-50 sm:w-max flex-col'>
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
              {periodData.map((i: any, key: Key) => (
                <tr className="bg-white even:bg-slate-50 cursor-pointer hover:bg-slate-100" onClick={() => selectPeriod(key as number)} key={key}>
                  <td className='p-1 border'>{i.periodName}</td>
                  <td className='p-1 border'>{i.startDate}</td>
                  <td className='p-1 border'>{i.endDate}</td>
                </tr>
              ))}
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
  )
}

export default SettingsPeriods