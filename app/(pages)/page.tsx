import { db } from "@/src/db";
import { testTable } from "@/src/db/schema/testTable";
import { Button } from "@nextui-org/react";
import Image from "next/image";

export default async function Home() {
  const testTables = await db.select().from(testTable);

  return (
    <main className="flex-1 bg-red-300">
      <Button>Click me</Button>
    </main>
  );
}
