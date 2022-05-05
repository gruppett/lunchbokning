import React, { useEffect, useState} from "react";
import Spinner from "../components/Spinner/Spinner";
import DataTable, {
  TableColumn,
  Media,
  defaultThemes,
} from "react-data-table-component";

function Logs() {
  const [loaded, setLoaded] = useState(false);
  const [logData, setLogData] = useState({} as any);
  interface DataRow {
    date: string;
    employeeName: string;
    type: string;
    event: string;
    groupName: string;
    count: number;
    servingName: string;
  }
  const [error, setError] = useState(false as any)

  const customStyles = {
    header: {
      style: {
        minHeight: "56px",
      },
    },
    headRow: {
      style: {
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: defaultThemes.default.divider.default,
      },
    },
    headCells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
    cells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
  };

  const columns: TableColumn<DataRow>[] = [
    {
      name: "Log Datum",
      selector: (row: { date: string }) => row.date,
      sortable: true,
      center: true,
      hide: Media.MD,
      maxWidth: "170px",
      //minWidth: "3",
    },
    {
      name: "Användare",
      selector: (row: { employeeName: string }) => row.employeeName,
      sortable: true,
      hide: Media.MD,
    },
    {
      name: "Typ",
      selector: (row: { type: string }) => row.type,
      sortable: true,
      center: true,
      maxWidth: "70px",
    },
    {
      name: "Info",
      selector: (row: { event: string }) => row.event,
      grow: 2,
      sortable: true,
      //minWidth: "250px",
    },
    {
      name: "Grupp",
      selector: (row: { groupName: string }) => row.groupName,
      sortable: true,
      maxWidth: "100px",
    },
    {
      name: "Antal",
      selector: (row: { count: number }) => row.count,
      sortable: true,
      right: true,
      maxWidth: "20px",
    },
    {
      name: "Dukning",
      selector: (row: { servingName: string }) => row.servingName,
      sortable: true,
      maxWidth: "100px",
    },
  ];

  useEffect(() => {
    ( async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_SERVER + "log/getLogs.php", {
          headers: {
            "API-Key": process.env.REACT_APP_API_KEY as string,
          }
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error)
        }
        setLogData(data);
      } catch (error) {
        console.log(error)
      } finally {
        setLoaded(true)
      }
    })()
  }, []);

  if (!loaded) {
    return <Spinner />;
  }

  if (error) {
    console.log(error)
    return (
      <div>
        <h2>{error}</h2>
      </div>
    )
  }


  return (
    <DataTable
      columns={columns}
      data={logData}
      customStyles={customStyles}
      noHeader
      defaultSortFieldId={1}
      defaultSortAsc={false}
      pagination
      highlightOnHover
      dense
    />
  );
}

export default Logs;
