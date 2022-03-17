import React,{ useContext, useState, useEffect, Suspense, MouseEvent } from 'react'
import SignOutButton from '../SignOutButton/SignOutButton';
import { GraphContext } from "../App/App"
import nav from "../../nav.json"
import { Link, useLocation } from "react-router-dom"
import { useMsal } from "@azure/msal-react";
import Spinner from '../Spinner/Spinner';


function handleLogout(instance: any, e: MouseEvent) {
  e.preventDefault()
  instance.logoutRedirect().catch((e: any) => {
    console.error(e);
  });
}

interface props {
  component: string
}

function Page({component}:props) {
  const {user, groups} = useContext(GraphContext)
  const [navState, setNavState] = useState("hidden")
  const location = useLocation()
  const { instance } = useMsal();

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
    <div className='flex h-screen'>
    <nav className={`absolute z-50 animate-in slide-in-from-left-full sm:animate-none w-full h-full sm:w-auto sm:h-auto sm:relative bg-bg flex flex-col ${navState} sm:flex`}>
      <a className='flex sm:hidden items-center p-3 gap-3' href='#' onClick={(e) => toggleNavState(e)}>
        <span className="material-icons-outlined text-2xl">
          close
        </span>
        <span className='sm:hidden text-xl'>Stäng</span>
      </a>
      {nav.map((n,i) => (
        <Link to={n.link} key={i} className='flex items-center p-3 gap-3'>
        <span className='material-icons-outlined text-2xl'>
          {n.icon}
        </span>
        <span className='sm:hidden text-xl'>{n.text}</span>
        </Link>
      ))}
      <a className='flex sm:hidden items-center p-3 gap-3' href="#" onClick={(e) => handleLogout(instance, e)}>
      <span className="material-icons-outlined text-2xl">
          logout
        </span>
        <span className='sm:hidden text-xl'>Logga ut</span>
      </a>

    </nav>
    <div className="flex-grow flex flex-col">

    <header className='flex items-center justify-between p-3 gap-3' >
      <a className='sm:hidden' href='#' onClick={toggleNavState}>
      <span className='block sm:hidden material-icons-outlined text-2xl'>menu</span>
      </a>
      <span className='flex-grow text-right sm:text-left'>{user?.mail}</span>
      <a className='hidden sm:inline-block' href="#" onClick={(e) => handleLogout(instance, e)}>Logga ut</a>
    </header>
    <main className='p-3 h-full'>
    <Suspense fallback={<Spinner />}>
        <Component />
      </Suspense>
      </main>
    </div>
    </div>
    </>
    
  )
}

export default Page