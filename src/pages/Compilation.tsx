import React, {Key, useEffect, useState} from 'react'
import moment from 'moment'
import Spinner from '../components/Spinner/Spinner'



const dateFormat = "YYYY-MM-DD"
function formatDate(date: Date) {
  return moment(date).format(dateFormat)
}
function Compilation() {
  const [daysData, setDaysData] = useState({} as any)
  const [isLoading, setIsLoading] = useState(true)
  const [dates, setDates] = useState({
    startDate: formatDate(new Date()),
    endDate: moment(formatDate(new Date())).add(7, 'days').format("YYYY-MM-DD")
  })
  const [reload, setReload] = useState(0)

  function reloadData () {
    setReload(reload + 1)
  }

  function handleChange(event: any) {
    setIsLoading(true)
    const {name, value} = event.target
    console.log(name, value)
    setDates({...dates, [name]: value})
    reloadData()
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
  }, [dates, reload])

  console.log(daysData)
  
  return (
    <>
      <label htmlFor="startDate">Från</label>
      <input type="date" name='startDate' id='startDate' max={dates.endDate} value={dates.startDate} onChange={handleChange}/>
      <label htmlFor="startDate">Slut</label>
      
      <input type="date" name='endDate'id='startDate' min={moment(dates.startDate).add(1, 'd').format(dateFormat)} value={dates.endDate} onChange={handleChange}/>
      {isLoading ?
        <Spinner />
        :<div>
          {daysData?.map((i:any, key:Key) => (
            <div key={key}>
              <h2>{i.date}</h2>
              {i.serving.map((j:any, key:Key) => (
                <table key={key}>
                  <thead>
                    <tr>
                      <th>{j.name}</th>
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