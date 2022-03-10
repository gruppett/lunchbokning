import React,{ Context, useContext } from 'react'
import SignOutButton from '../SignOutButton/SignOutButton';
import { GraphContext } from "../App/App"

type Props = {}

function Header({}: Props) {
  const {mail} = useContext(GraphContext)
  return (
      <header>
        <p>Inloggad som {mail}</p>
        <SignOutButton />
      </header>
  )
}

export default Header