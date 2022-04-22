import React, { useEffect, useState, useCallback } from "react";
import Spinner from "../components/Spinner/Spinner";
import DataTable, { TableColumn } from "react-data-table-component";

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

  interface DataRow {
      date: string;
      employeeName: string;
      type: string;
      event: string;
      groupName: string;
      count: number;
      servingName: string;
  }

  const columns: TableColumn<DataRow>[] = [
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
        grow: 4,
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

  return (
    
      <DataTable
       
        columns={columns}
        data={logData}
        noHeader
        defaultSortFieldId={1}
        defaultSortAsc={false}
        pagination
        highlightOnHover
      />
   
  );
}

export default Logs;
