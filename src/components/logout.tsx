"use client";

import { signoutUser } from "@/app/actions/auth/signoutUser";
import { Button } from "@nextui-org/react";

export default function Logout() {
  const onLogout = async () => {
    console.log("onLogout");
    let response = await signoutUser();
    console.log("onLogout", response);
  };

  return (
    <Button className="bg-blue-300" onClick={onLogout}>
      logout
    </Button>
  );
}
