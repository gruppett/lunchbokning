import React,{ useContext } from 'react'
import SignOutButton from '../SignOutButton/SignOutButton';
import { GraphContext } from "../App/App"


function Header() {
  const {user, groups} = useContext(GraphContext)
  return (
      <header className='flex justify-between p-4'>
        <p>Inloggad som {user?.displayName}</p>
        <SignOutButton />
      </header>
  )
}

export default Header