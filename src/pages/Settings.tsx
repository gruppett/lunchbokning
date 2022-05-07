import React from 'react'
import {
  Link,
  Location,
  Outlet,
  useLocation
} from "react-router-dom"
import nav from "../nav.json"

function cleanLocation(location: Location, index: number) {
  return location.pathname.split("/")[index]
}

function Settings() {
  const activeLink = cleanLocation(useLocation(), 2)

  return (
    <>
    <div className='flex gap-5'>
      {nav.settings.map((d, i) => (
        <Link to={d.to} key={i} className={`flex items-center p-3 justify-center flex-grow sm:flex-grow-0 ${activeLink === d.to || (activeLink===undefined && d.to === "grupper") ? "text-blue-400" : ""}`}>
          <span className='material-icons-outlined'>
            {d.icon}
          </span>
          <span className='hidden sm:inline-block'>
          {d.text}
          </span>
        </Link>
      ))}
    </div>
    {/* Outlet renders the inner element specified by page */}
    <Outlet />
    </>
  )
}

export default Settings

