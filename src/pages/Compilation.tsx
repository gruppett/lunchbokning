import React, {Key, useEffect, useState, useRef, useContext} from 'react'
import moment from 'moment'
import Spinner from '../components/Spinner/Spinner'
import ReactToPrint from "react-to-print"
import { UserContext } from '../components/App/App'


function formatDate(date: Date) {
  const dateFormat = "YYYY-MM-DD"
  return moment(date).format(dateFormat)
}
function dateToLocaleString(date: Date) {
  const newDate = new Date(date)
  return newDate.toLocaleDateString("fi-FI")
}

function Compilation() {
  const [daysData, setDaysData] = useState({} as any)
  const [error, setError] = useState(false as any)
  const [loading, setLoading] = useState(true)
  const [dates, setDates] = useState({
    startDate: formatDate(new Date()),
    endDate: moment(formatDate(new Date())).add(6, 'days').format("YYYY-MM-DD")
  })
  const { userData } = useContext(UserContext);
  let printRef = useRef(null)

  function handleChange(event: any) {
    // updates dates
    setLoading(true)
    const {name, value} = event.target
    setDates({...dates, [name]: value})
  }

  useEffect(() => {
    (async () => {
      try {
        // fetches data from server with dates
        setLoading(true)
        const result = await fetch(process.env.REACT_APP_API_SERVER + "booking/getDays.php", {
          method: "POST",
          body: JSON.stringify(dates),
          headers: {
            "Content-Type": "application/json",
            "API-Key": process.env.REACT_APP_API_KEY as string,
          }
        })
        const data = await result.json()
        if (!result.ok) {
          setError(data.error)
          setLoading(false)
        } 
        console.log(data)
        setDaysData(data)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [dates])

  return (
    <>
    <div className="flex gap-2 flex-col">
      <div className="flex gap-1 items-center">

      <label htmlFor="startDate">Från</label>
      <input type="date" name='startDate' id='startDate' className='p-1 border' max={dates.endDate} value={dates.startDate} onChange={handleChange}/>
      <label htmlFor="startDate">Till</label>
      <input type="date" name='endDate'id='startDate' className='p-1 border' min={dates.startDate} value={dates.endDate} onChange={handleChange}/>
      <ReactToPrint 
        trigger={() => <button className='flex'>
            <span className='material-icons-outlined'>
              print
            </span>
          </button>}
        content={() => printRef.current}
        bodyClass={"m-4"}
        />
      </div>
      <div className=""  ref={printRef}>
        <div className="flex gap-3 flex-col">
          <div>Hämtat {new Date().toLocaleDateString("fi-FI")} av {userData.employeeEmail}</div>
          <div className='flex gap-3'>
            <div>T: Total</div>
            <div>D: Diet</div>
          </div>
        </div>
        {error ? error.map((error: string, key: Key) => 
          <p className='text-red-500' key={key}>{error}</p>
        ): 
        loading ?
          <Spinner />
          : <div className="flex flex-wrap items-start -mx-1">
            {daysData.map((i: any, iKey: Key) =>(
              <div className="w-full w-1/6 my-1 px-1 min-w-min" key={iKey}>
                <table className="text-left border-collapse border-4 ">
                  <tbody>
                    <tr className='border-b-4'>
                      <th colSpan={2} className="border p-1 text-lg">{dateToLocaleString(i.date)}</th>
                      <th className="border p-1">T</th>
                      <th className="border p-1">D</th>
                    </tr>
                    {i.serving.map((j:any, jKey: Key) => {
                      return j.groups.map((k:any, kKey: Key) => (
                        (<tr key={kKey} className="even:bg-slate-100">
                          {kKey === 0 ? <th className="border p-1 bg-white" rowSpan={j.groups.length}>{j.name}</th> : <></>}
                          <td className="border p-1">{k.name}</td>
                          <td className="border p-1">{k.total}</td>
                          <td className="border p-1">{k.diet}</td>
                        </tr>)
                        ))
                      })}
                      {i.serving.map((j:any, jKey: Key) => (
                        <tr key={jKey} className={jKey === 0 ? "border-t-4 even:bg-slate-100" : "even:bg-slate-100"}>
                          {jKey === 0 ? <th rowSpan={i.serving.length} className="border p-1 bg-white">Subtotal</th> : <></>}
                          <th className="border p-1">{j.name}</th>
                          <td className="border p-1">{j.total}</td>
                          <td className="border p-1">{j.diet}</td>
                        </tr>
                      ))}
                      <tr className='border-t-4'>
                        <th colSpan={2} className="border p-1">Totalt</th>
                        <td className="border p-1">{i.total}</td>
                        <td className="border p-1">{i.diet}</td>
                      </tr>
                  </tbody>
                </table>
                </div>
            ))}
          </div>
        }
      </div>
    </div>
    </>
  )
}

export default Compilation