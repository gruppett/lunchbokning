import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import hjorten from "../../assets/hjorten.png"
import NavElement from "../NavElement/NavElement"

const nav = [
  {
    icon: "calendar_month",
    link: "/"
  },
  {
    icon: "person",
    link: "/personlig"
  },
  {
    icon: "groups",
    link: "/grupper"
  },
  {
    icon: "supervisor_account",
    link: "/externa-grupper"
  },
  {
    icon: "restaurant",
    link: "/sammanstallning"
  }
]

function Nav() {
  const location = useLocation();
  console.log(location)

  return (
    <nav className='flex flex-col items-center gap-3 p-3'>
      <img className="w-12" src={hjorten}></img>
      {nav.map(ne => (
        <NavElement element={ne}></NavElement>
      ))
      } 
    </nav>
  )
}

export default Nav