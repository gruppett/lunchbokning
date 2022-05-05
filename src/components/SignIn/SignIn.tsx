import React from 'react'
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import hjorten from "../../assets/hjorten.png"
import ms from "../../assets/ms.svg"


function handleLogin(instance: any) {
  instance.loginRedirect(loginRequest).catch((e: any) => {
    console.error(e);
});
} 

function SignInButton() {
  const { instance } = useMsal();
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-10'>
      <img src={hjorten} alt="Övningsrestaurang Hjortens logo"></img>
      <img src={ms} alt="Sign in with microsoft" onClick={() => handleLogin(instance)} className="cursor-pointer"></img>
    </div>
  )
}

export default SignInButton