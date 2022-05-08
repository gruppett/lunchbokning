import React, {useState, useEffect, useContext} from 'react'
import Spinner from '../components/Spinner/Spinner'
import {UserContext} from "../components/App/App"
import iStringKeys from '../interfaces/iStringKeys'

interface iFetched {
  serving: any,
  user: any
}

interface iFetchHelp {
  name: keyof iFetched,
  url: string,
  method: 'GET' | 'POST'
  data: any
}

interface iForm  extends iStringKeys{
  preferences: {
    serving: number,
    diet: number
  }
}

const fetchHelp = [
  {
    name: 'serving',
    url: 'serving/getServings.php',
    method: 'GET',
    data: null
  } as iFetchHelp,
  {
    name: 'user',
    url: 'user/getUser.php',
    method: 'POST',
    data: {}
  } as iFetchHelp
]



function PersonalSettings() {
  const [loading, setLoading] = useState(false)
  const [fetchedData, setFetchedData] = useState({} as iFetched)
  const { userData, setUserData }= useContext(UserContext);
  const [formData, setFormData] = useState({
    preferences: {
      serving: 0,
      diet: 0
    }
  } as iForm)


  function formHandleChange (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const target = e.target
    // gets value
    const value = target.value
    // gets form and key of input
    const [form, name] = target.name.split("-")
    const newFormData = formData
    // updates form with new key value
    newFormData[form][name] = value
    setFormData({...newFormData})
  }

  async function preferencesHandleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = {
      employeeID: userData.employeeID,
      servingID: formData.preferences.serving,
      diet: formData.preferences.diet
    }
    try {
      const response = await fetch(process.env.REACT_APP_API_SERVER + 'user/updateUser.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "API-Key": process.env.REACT_APP_API_KEY as string,
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      console.log(response)
    } catch (error) {
      console.log(error)
    }
    // updates personal data without having to fetch new data
    const user = {
      employeeID: userData.employeeID,
      employeeEmail: userData.employeeEmail,
      diet: formData.preferences.diet,
      servingID: formData.preferences.serving,
      roles: userData.roles
    }
    setUserData(user)
    alert("Lyckades med att ändra personliga inställningar")
  }



  useEffect(() => {
    // checks if userData has loaded yet
    if (Object.keys(userData).length === 0) {
      return
    }
    (async () => {
      try {
        setLoading(true)
        const fetchHelpWithEmail = fetchHelp
        // specify the email to the fetch
        fetchHelpWithEmail[1].data = {email: userData.employeeEmail}
        // goes trough fetchHelp and fetches data
        // different fetches if there is a body to be included
        const results = await Promise.all(fetchHelpWithEmail.map(i => {
          if (i.method === 'GET') {
            return fetch(process.env.REACT_APP_API_SERVER +  i.url, {
              headers: {
                "API-Key": process.env.REACT_APP_API_KEY as string,
              }
            })
          } else {
            return fetch(process.env.REACT_APP_API_SERVER + i.url, {
              method: i.method,
              headers: {
                'Content-Type': 'application/json',
                "API-Key": process.env.REACT_APP_API_KEY as string,
              },
              body: JSON.stringify(i.data)
            })
          }
        }))
        // prosesses fetched data
        const data = await Promise.all(results.map((i) => {
          if (i.ok) {
            return i.json()
          }
          return null
        }))
        const newFetchedData = fetchedData
        // adds data to fetchedData
        data.map((i, key) => (
          newFetchedData[fetchHelp[key].name] = i
        ))
        setFetchedData({...newFetchedData})
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    })()
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData])


  useEffect(() => {
    // checks if fetchedData has loaded yet
    if (Object.keys(fetchedData).length === 0) {
      return
    }
    // selects from fetchedData
    const newFormData = formData
    newFormData.preferences.diet = userData.diet
    newFormData.preferences.serving = userData.servingID
    setFormData({...newFormData})

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedData])
  

  if (loading) {
    return <Spinner />
  }

  return (
    <>
      <div className="">
        <h1>Personliga inställningar</h1>
        <p>Här kan du ändra din förvalada servring och meddela eventuell diet.</p>
        <form name='preferences' onSubmit={preferencesHandleSubmit} className="flex flex-col gap-1 items-start">
          <label htmlFor="serving">Servering</label>
          <select name="preferences-serving" id="serving" required value={formData.preferences.serving} onChange={formHandleChange} className='bg-slate-100 p-1'>
            <option value="">Välj Servering</option>
            {fetchedData.serving && fetchedData.serving.map((i: any, key: number) => (
              <option value={i.servingID} key={key}>{i.servingName}</option>
              ))}
          </select>
          <div className="flex gap-1 items-center">
            <input type="checkbox" name="preferences-diet" id="diet" checked={formData.preferences.diet > 0 ? true : false} onChange={formHandleChange} value={formData.preferences.diet > 0 ? 0 : 1}></input>
            <label htmlFor="diet">Diet</label>
          </div>
          <input type="submit" value="Spara" className="px-3 py-1 w-min whitespace-nowrap bg-blue-300"/>
        </form>
      </div>
    </>
  )
}

export default PersonalSettings