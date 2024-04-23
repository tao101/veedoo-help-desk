import { db } from "@/src/db";
import { testTable } from "@/src/db/schema/testTable";
import { Button } from "@nextui-org/react";
import Image from "next/image";

export default async function Home() {
  const testTables = await db.select().from(testTable);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <pre>{JSON.stringify(testTables, null, 2)}</pre>
      </div>
      <Button>Click me</Button>
    </main>
  );
}
