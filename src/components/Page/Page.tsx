import React,{ useContext, useState, useEffect, MouseEvent } from 'react'
import { GraphContext } from "../App/App"
import nav from "../../nav.json"
import { Link, Location, Route, Routes, useLocation } from "react-router-dom"
import { useMsal } from "@azure/msal-react";
import Overview from '../../pages/Overview';
import Personal from '../../pages/Personal';
import Groups from '../../pages/Groups';
import ExternalGroups from '../../pages/ExternalGroups';
import Compilation from '../../pages/Compilation';
import Settings from '../../pages/Settings';
import FourOhFour from '../../pages/FourOhFour';
import SettingsGroups from '../../pages/settings/SettingsGroups';
import SettingsUsers from '../../pages/settings/SettingsUsers';
import SettingsDates from '../../pages/settings/SettingsDates';


function handleLogout(instance: any, e: MouseEvent) {
  e.preventDefault()
  instance.logoutRedirect().catch((e: any) => {
    console.error(e);
  });
}

function cleanLocation(location: Location, index: number) {
  return location.pathname.split("/")[index]
}

function Page() {
  const {user} = useContext(GraphContext)
  const [navState, setNavState] = useState("hidden")
  const location = useLocation()
  const { instance } = useMsal();

  const activeLink = cleanLocation(location, 1)

  useEffect(() => {
    setNavState("hidden")
  }, [location])
  


  function toggleNavState(e:MouseEvent) {
    e.preventDefault()
    if (navState === "")
    setNavState("hidden")
    else {
      setNavState("")
    }
  }

  return (
    <>
    <div className='flex h-screen'>
    <nav className={`absolute z-50 animate-in slide-in-from-left-full sm:animate-none w-full h-full sm:w-auto sm:h-auto sm:relative bg-white flex flex-col ${navState} sm:flex`}>
      <button className='flex sm:hidden items-center p-3 gap-3' onClick={(e) => toggleNavState(e)}>
        <span className="material-icons-outlined text-2xl">
          close
        </span>
        <span className='sm:hidden text-xl'>Stäng</span>
      </button>
      {nav.main.map((n,i) => (
        <Link to={n.link} key={i} className={`flex items-center p-3 gap-3 ${activeLink === n.link  || (activeLink === "" && n.link === "/") ? "text-blue-400" : ""}`}>
        <span className='material-icons-outlined text-2xl'>
          {n.icon}
        </span>
        <span className='sm:hidden text-xl'>{n.text}</span>
        </Link>
      ))}
      <button className='flex sm:hidden items-center p-3 gap-3' onClick={(e) => handleLogout(instance, e)}> 
      <span className="material-icons-outlined text-2xl">
          logout
        </span>
        <span className='sm:hidden text-xl'>Logga ut</span>
      </button>

    </nav>
    <div className="flex-grow flex flex-col">

    <header className='flex items-center justify-between p-3 gap-3' >
      <button className='sm:hidden' onClick={toggleNavState}>
      <span className='block sm:hidden material-icons-outlined text-2xl'>menu</span>
      </button>
      <span className='flex-grow text-right sm:text-left'>{user?.mail}</span>
      <button className='hidden sm:inline-block' onClick={(e) => handleLogout(instance, e)}>Logga ut</button>
    </header>
    <main className='h-full px-3'>
      <Routes>
        <Route path="/" element={<Overview />}/>
        <Route path="personlig" element={<Personal />}/>
        <Route path="grupper" element={<Groups />}/>
        <Route path="externa-grupper" element={<ExternalGroups />}/>
        <Route path="sammanstallning" element={<Compilation />}/>
        <Route path="installningar" element={<Settings />}>
          <Route index element={<SettingsGroups />} />
          <Route path="grupper" element={<SettingsGroups />} />
          <Route path="anvandare" element={<SettingsUsers />} />
          <Route path="datum" element={<SettingsDates />} />
        </Route>
        <Route path="*" element={<FourOhFour />}/>
        
      </Routes>
      </main>
    </div>
    </div>
    </>
    
  )
}

export default Page