import React, {Key, useEffect, useState, useRef} from 'react'
import moment from 'moment'
import Spinner from '../components/Spinner/Spinner'
import ReactToPrint from "react-to-print";



function formatDate(date: Date) {
  const dateFormat = "YYYY-MM-DD"
  return moment(date).format(dateFormat)
}
function Compilation() {
  const [daysData, setDaysData] = useState({} as any)
  const [isLoading, setIsLoading] = useState(true)
  const [dates, setDates] = useState({
    startDate: formatDate(new Date()),
    endDate: moment(formatDate(new Date())).add(7, 'days').format("YYYY-MM-DD")
  })
  let printRef = useRef(null)

  function handleChange(event: any) {
    setIsLoading(true)
    const {name, value} = event.target
    setDates({...dates, [name]: value})
  }

  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER + "booking/getDays.php", {
      method: "POST",
      body: JSON.stringify(dates),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then(data => {
      setDaysData(data)
      setIsLoading(false)
    })
  }, [dates])

  return (
    <>
      <label htmlFor="startDate">Från</label>
      <input type="date" name='startDate' id='startDate' max={dates.endDate} value={dates.startDate} onChange={handleChange}/>
      <label htmlFor="startDate">Slut</label>
      <input type="date" name='endDate'id='startDate' min={dates.startDate} value={dates.endDate} onChange={handleChange}/>
      <ReactToPrint 
        trigger={() => <button>
            <span className='material-icons-outlined'>
              print
            </span>
          </button>}
        content={() => printRef.current}
      />
      {isLoading ?
        <Spinner />
        :<div ref={printRef}>
          {daysData.error  ?
           daysData.error.map((error: string, key: Key) => <p key={key}>{error}</p>)
          : daysData?.map((i:any, key:Key) => (
            <div key={key}>
              <h2>{i.date}</h2>
              {i.serving.map((j:any, key:Key) => (
                <table key={key}>
                  <thead>
                    <tr>
                      <th colSpan={2}>{j.name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>Normal</th>
                      <td>{j.normal}</td>
                    </tr>
                    <tr>
                      <th>Diet</th>
                      <td>{j.diet}</td>
                    </tr>
                    <tr>
                      <th>Total</th>
                      <td>{j.total}</td>
                    </tr>
                    <tr>
                      <th>Grupper</th>
                      <td>
                        <table>
                          <thead>
                            <tr>
                              <th>Namn</th>
                              <th>Antal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {j.groups.map((k:any, key:Key) => (
                              <tr key={key}>
                                <td>{k.name}</td>
                                <td>{k.total}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ))}
            </div>
          ))}
        </div>
      }
    </>
  )
}

export default Compilation