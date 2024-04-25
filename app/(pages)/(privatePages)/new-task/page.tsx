import { validateRequest } from "@/app/actions/auth/validateRequest";
import { db } from "@/src/db";
import { testTable } from "@/src/db/schema/testTable";
import { Button } from "@nextui-org/react";
import Image from "next/image";

export default async function NewTaskPage() {
  return (
    <main className="flex-1 bg-green-300">
      <h1>NewTaskPage</h1>
    </main>
  );
}
