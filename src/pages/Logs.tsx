import React, { useEffect, useState, useCallback, Key } from "react";
import Spinner from "../components/Spinner/Spinner";
import DataTable from "react-data-table-component";

function Logs() {
  const [loadStatus, setLoadStatus] = useState([0, 1]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [logData, setLogData] = useState({} as any);

  const sectionLoaded = useCallback(() => {
    let status = loadStatus;
    status[0]++;
    if (status[0] === status[1]) {
      setIsLoaded(true);
    }
    setLoadStatus(status);
  }, [loadStatus]);

  const columns = [
    {
      name: "Log Datum",
      selector: (row: { date: string; }) => row.date,
      sortable: true
    },
    {
      name: "Användare",
      selector: (row: { employeeName: string; }) => row.employeeName,
      sortable: true
    },
    {
      name: "Typ",
      selector: (row: { type: string; }) => row.type,
      sortable: true
    },
    {
      name: "Info",
      selector: (row: { event: string; }) => row.event,

      sortable: true
    },
    {
      name: "Grupp",
      selector: (row: { groupName: string; }) => row.groupName,

      sortable: true
    },
    {
      name: "Antal",
      selector: (row: { count: number; }) => row.count,
      sortable: true
    },
    {
      name: "Dukning",
      selector: (row: { servingName: string; }) => row.servingName,
      sortable: true
    },
  ];

  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER + "log/getLogs.php", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLogData(data);
        sectionLoaded();
      });
  }, [sectionLoaded]);

  if (!isLoaded) {
    return <Spinner />;
  }

  //   return (
  //     <table>
  //       <thead>
  //         <tr>
  //           <th>Log Datum</th>
  //           <th>Användare</th>
  //           <th>Typ</th>
  //           <th>Händelse</th>
  //           <th>Grupp</th>
  //           <th>Antal</th>
  //           <th>Dukning</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {logData.map((i: any, key: Key) => (
  //           <tr key={key}>
  //             <td>{i.date}</td>
  //             <td>{i.employeeName}</td>
  //             <td>{i.type}</td>
  //             <td>{i.event}</td>
  //             <td>{i.groupName}</td>
  //             <td>{i.count}</td>
  //             <td>{i.servingName}</td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   );
  //return <DataTable columns={columns} data={logData} />;
  return (
    
      <DataTable
        // @ts-ignore
        columns={columns}
        data={logData}
        noHeader
        defaultSortField="date"
        defaultSortAsc={false}
        pagination
        highlightOnHover
      />
   
  );
}

export default Logs;
