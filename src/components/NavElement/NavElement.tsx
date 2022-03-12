import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import React from 'react'

type Props = {
  element: {
    link: string,
    icon: string
  }
}

const NavElement = ({element}: Props) => {
  const location = useLocation()
  if (location.pathname == element.link) {
    return (
      <Link to={element.link} className="">
        <span className="material-icons-outlined text-5xl block p-1 text-gray-400 hover:text-gray-600">
          {element.icon}
        </span>
      </Link>
    )


  }

  return (
    <Link to={element.link} className="">
    <span className="material-icons-outlined text-5xl block p-1 hover:text-gray-600">
      {element.icon}
    </span>
  </Link>
  )
}

export default NavElement