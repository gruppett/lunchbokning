import React,{ useContext, useState, useEffect, Suspense, MouseEvent } from 'react'
import SignOutButton from '../SignOutButton/SignOutButton';
import { GraphContext } from "../App/App"
import nav from "../../nav.json"
import { Link, useLocation } from "react-router-dom"

interface props {
  component: string
}

function Page({component}:props) {
  const {user, groups} = useContext(GraphContext)
  const [navState, setNavState] = useState("hidden")
  const location = useLocation()

  useEffect(() => {
    setNavState("hidden")
  }, [location])
  


  function toggleNavState(e:MouseEvent) {
    e.preventDefault()
    if (navState == "")
    setNavState("hidden")
    else {
      setNavState("")
    }
  }

  const Component = React.lazy(() => import(`../../pages/${component}`))


  return (
    <>
    <div className='flex'>
    <nav className={`absolute sm:relative bg-bg flex flex-col ${navState} sm:flex`}>
      <a className='sm:hidden' href='#' onClick={(e) => toggleNavState(e)}>
        <span className="material-icons-outlined">
          close
        </span>
        <span className='sm:hidden'>Stäng</span>
      </a>
      {nav.map((n,i) => (

        <Link to={n.link} key={i}>
        <span className='material-icons-outlined'>
          {n.icon}
        </span>
        <span className='sm:hidden'>{n.text}</span>
        </Link>
      ))}
    </nav>
    <div className="flex-grow">

    <header className='flex items-center justify-between'>
      <a className='sm:hidden' href='#' onClick={toggleNavState}>
      <span className='sm:hidden material-icons-outlined'>menu</span>
      </a>
      <span className='flex-grow self-start'>{user?.mail}</span>
      <SignOutButton className='hidden sm:inline-block'></SignOutButton>
    </header>
    <Suspense fallback={<main>Laddar...</main>}>
      <main>
        <Component />
      </main>
      </Suspense>
    </div>
    </div>
    </>
    
  )
}

export default Page