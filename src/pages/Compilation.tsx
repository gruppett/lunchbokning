import React, {Key, useEffect, useState, useRef} from 'react'
import moment from 'moment'
import Spinner from '../components/Spinner/Spinner'
import ReactToPrint from "react-to-print";

const tableGuide = [
  {
    title: 'Normal',
    data: 'normal'
  },
  {
    title: 'Diet',
    data: 'diet'
  },
  {
    title: 'Total',
    data: 'total'
  }
]

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

  console.log(daysData)

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
      {isLoading ?
        <Spinner />
        :<div ref={printRef} className="grid grid-cols-5 grid-rows-auto gap-2">
          {daysData.error  ?
           daysData.error.map((error: string, key: Key) => <p key={key}>{error}</p>)
           : daysData?.map((i:any, key:Key) => (
             <table key={key}>
               <tbody>
                <tr>
                  <th>
                    {i.date}
                  </th>
                </tr>
                {i.serving.map((j:any, key:Key) => (
                  <>
                  <tr key={key}>
                    <th>
                      {j.name}
                    </th>
                  </tr>
                  {tableGuide.map((k:any, key:Key) => (
                    <tr key={key}>
                      <th>
                        {k.title}
                      </th>
                      <td>
                        {j[k.data]}
                      </td>
                    </tr>
                  ))}
                  </>
                ))}
               </tbody>
             </table>
          ))}
        </div>
      }
      </div>
    </>
  )
}

export default Compilation