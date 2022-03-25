import React, { MouseEvent } from "react";
import { useMsal } from "@azure/msal-react";

function handleLogout(instance: any, e: MouseEvent) {
  e.preventDefault();
  instance.logoutRedirect().catch((e: any) => {
    console.error(e);
  });
}

interface props {
  className?: string;
  withIcon?: boolean;
}

function SignOutButton({ className }: props) {
  const { instance } = useMsal();
  return (
    <button className={className} onClick={(e) => handleLogout(instance, e)}>
      Logga ut
    </button>
  );
}

export default SignOutButton;
