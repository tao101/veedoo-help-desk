import { db } from "@/src/db";
import { testTable } from "@/src/db/schema/testTable";
import { Button, Card, CardBody } from "@nextui-org/react";
import Image from "next/image";
import { validateRequest } from "../../actions/auth/validateRequest";
import Logout from "@/src/components/logout";
import { redirect } from "next/navigation";
import TableHeader from "@/src/components/ticketsTable/tableHeader";

export default async function Home() {
  const { user } = await validateRequest();
  console.log("user", user);
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex-1 px-2.5 py-[24px] lg:py-[64px] bg-neutral-100 ">
      <Card className="max-w-[1246px] p-6 mx-auto ">
        <CardBody className="flex flex-col gap-8">
          <TableHeader />
        </CardBody>
      </Card>
    </main>
  );
}
