import React, {Context} from 'react'
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import hjorten from "./hjorten.png"
import ms from "./ms.svg"


type Props = {}

function handleLogin(instance: any) {
  instance.loginRedirect(loginRequest).catch((e: any) => {
    console.error(e);
});
} 

function SignInButton({}: Props) {
  const { instance } = useMsal();
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-10'>
      <img src={hjorten}></img>

    <button onClick={() => handleLogin(instance)} className='flex items-center bg-[#ffffff] border border-[#8C8C8C] font-semibold text-[15px] gap-3 text-[#5E5E5E] px-3 py-2'>
      <img src={ms}></img>
      Logga in med Microsoft
    </button>
    </div>
  )
}

export default SignInButton