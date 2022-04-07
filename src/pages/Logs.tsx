import React, {useEffect, useState, useCallback, Key} from 'react'
import Spinner from '../components/Spinner/Spinner'

function Logs() {
  const [loadStatus, setLoadStatus] = useState([0, 1])
  const [isLoaded, setIsLoaded] = useState(false)
  const [logData, setLogData] = useState({} as any)


  const sectionLoaded = useCallback(() => {
    let status = loadStatus
    status[0] ++
    if (status[0] === status[1]) {
      setIsLoaded(true)
    }
    setLoadStatus(status)
  }, [loadStatus])

  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER + "/api/log/getLogs.php", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then((response) => response.json())
      .then(data => {
        setLogData(data)
        sectionLoaded()
      });
  }, [sectionLoaded])
  


  if(!isLoaded) {
    return (
      <Spinner />
      )
    }

  return (
    <table>
      <thead>
        <tr>
          <th>Datum</th>
          <th>Användare</th>
          <th>Händelse</th>
        </tr>
      </thead>
      <tbody>
          {logData.map((i:any, key:Key) => (
        <tr key={key}>
          
            <td>{i.date}</td>
            <td>{i.employeeName}</td>
            <td>{i.event}</td>
        </tr>
          ))}
      </tbody>
    </table>
  )
}

export default Logs