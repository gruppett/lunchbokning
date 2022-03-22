import React from 'react'
import {
  Link,
  Outlet
} from "react-router-dom"

function Settings() {

  return (
    <>
    <div className='flex gap-3 p-3'>
      <Link to="grupper" className='flex gap-1'>
        <span className="material-icons-outlined">
          groups
        </span>
        <span>
          Grupper
        </span>
      </Link>
      <Link to="anvandare" className='flex gap-1'>
        <span className="material-icons-outlined">
          people
        </span>
        <span>
          Användare
        </span>
      </Link>
      <Link to="perioder" className='flex gap-1'>
        <span className="material-icons-outlined">
          date_range
        </span>
        <span>
          Perioder
        </span>
      </Link>
    </div>
    <Outlet />
    </>
  )
}

export default Settings

