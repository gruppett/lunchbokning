import React from 'react'
import {
  Link,
  Outlet
} from "react-router-dom"

function Settings() {

  return (
    <>
    <div>
      <Link to="grupper">Grupper</Link>
      <Link to="anvandare">Användare</Link>
      <Link to="perioder">Perioder</Link>
    </div>
    <Outlet />
    </>
  )
}

export default Settings

