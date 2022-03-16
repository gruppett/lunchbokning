import React from 'react'
import { useMsal } from "@azure/msal-react";


function handleLogout(instance: any) {
  instance.logoutRedirect().catch((e: any) => {
    console.error(e);
  });
}

interface props {
  className?: string
}

function SignOutButton({className} : props) {
  const { instance } = useMsal();


  return (
    <button className={className} onClick={() => handleLogout(instance)}>Logga ut</button>
    )
}

export default SignOutButton