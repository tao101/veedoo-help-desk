import { db } from "@/src/db";
import { testTable } from "@/src/db/schema/testTable";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { validateRequest } from "../actions/auth/validateRequest";
import Logout from "@/src/components/logout";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();
  console.log("user", user);
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex-1 bg-red-300">
      <Button>Click me</Button>
      <p>{JSON.stringify(user)}</p>
      <Logout />
    </main>
  );
}
