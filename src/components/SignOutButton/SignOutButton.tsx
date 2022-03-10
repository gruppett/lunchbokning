import React from 'react'
import { useMsal } from "@azure/msal-react";


function handleLogout(instance: any) {
  instance.logoutRedirect().catch((e: any) => {
    console.error(e);
  });
}

type Props = {}

function SignOutButton({}: Props) {
  const { instance } = useMsal();
  return (
    <button onClick={() => handleLogout(instance)}>Logga ut</button>
    )
}

export default SignOutButton