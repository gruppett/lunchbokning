import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner/Spinner";

const fetchHelp = [
  {
    name: "groups",
    url: "groups/getExternals.php",
    method: "POST",
  },
  {
    name: "servings",
    url: "serving/getServings.php",
    method: "GET",
  },
];

// class FormData {
//   group: { name: string; count: number; diet: number; servingID: number; groupID?: number };
//   constructor () {
//     this.group = {
//       name: "",
//       count: 1,
//       diet: 0,
//       servingID: 0,
//     }
//   }
//   [key: string]: { [key: string]: any; };
// }

class Data {
  groups: Array<any>;
  servings: Array<any>;
  constructor() {
    this.groups = [{}];
    this.servings = [{}];
  }
  [key: string]: { [key: string]: any };
}

// interface iSelected {
//   group: number;
// }

function ExternalGroups() {
  const [loading, setLoading] = useState(false);
  // const [reload, setReload] = useState(0)
  // const [error, setError] = useState(false as any)
  // const [formData, setFormData] = useState(new FormData())
  const [fetched, setFetched] = useState(new Data());
  // const [selected, setSelected] = useState({} as iSelected)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const responses = await Promise.all(
          fetchHelp.map((i) => {
            return fetch(process.env.REACT_APP_API_SERVER + i.url, {
              method: i.method,
              mode: "cors",
              headers: {
                "API-Key": process.env.REACT_APP_API_KEY as string,
              }
            });
          })
        );
        const data = await Promise.all(
          responses.map((i) => {
            if (i.ok) {
              return i.json();
            }
            return null;
          })
        );
        const newFetched = fetched;
        data.map((i, key) => (newFetched[fetchHelp[key].name] = i));
        setFetched({ ...newFetched });
      } catch (error) {
        console.log(error);
        //setError(error)
      } finally {
        setLoading(false);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // function select<K extends keyof typeof selected>(key: K, id: number) {
  //   const newSelected = selected
  //   newSelected[key] = id
  //   const newFormData = formData
  //   const selectedData = getSelected(key)
  //   console.log(selectedData)
  //   const data = newFormData[key]
  //   switch (key) {
  //     case "group":
  //       data.name = selectedData.name
  //       data.servingID = selectedData.servingID
  //       data.diet = selectedData.diet
  //       data.count = selectedData.count
  //       break
  //     default:
  //       break
  //   }
  //   setFormData({...newFormData})
  //   setSelected({...newSelected})
  // }

  // function deselect<K extends keyof typeof selected>(key: K) {
  //   const newSelected = selected
  //   newSelected[key] = 0
  //   const newFormData = formData
  //   switch (key) {
  //     case "group":
  //       newFormData.group.name = ""
  //       newFormData.group.servingID = 0
  //       newFormData.group.diet = 0
  //       newFormData.group.count = 1
  //       break
  //     default:
  //       break
  //   }
  //   setFormData({...newFormData})
  //   setSelected({...newSelected})
  // }

  // function getSelected (key: keyof iSelected) {
  //   switch (key) {
  //     case "group":
  //       return fetched.groups.find(i => i.groupID === selected.group)
  //       break;

  //     default:
  //       break;
  //   }
  // }

  // function formHandleChange (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
  //   const target = e.target
  //   const value = target.value
  //   const [form, name] = target.name.split("-")
  //   const newFormData = formData
  //   console.log(form, name, newFormData[form][name])
  //   newFormData[form][name] = value
  //   setFormData({...newFormData})
  // }

  // function isSelected (key: keyof iSelected) {
  //   return selected[key] !== 0
  // }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex gap-3 flex-col">
      {/* <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap">
        <div>
          <table>
            <thead>
              <tr>
                <th>Grupp</th>
                <th>Antal</th>
                <th>Diet</th>
                <th>Dukning</th>  
              </tr>  
            </thead>
            <tbody>
              {fetched.groups?.map((group: any, i: Key) => (
                <tr key={i} onClick={() => select("group", group.groupID)}>
                  <td>{group.name}</td>
                  <td>{group.count}</td>
                  <td>{group.diet}</td>
                  <td>{fetched.servings.find((x) => x.servingID === group.servingID)?.servingName}</td>
                </tr>
              ))}
            </tbody>
          </table>          
        </div>
      </div> */}
    </div>
  );
}

export default ExternalGroups;
