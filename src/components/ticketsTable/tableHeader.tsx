"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function TableHeader() {
  const router = useRouter();
  return (
    <div className="flex flex-row items-center justify-between">
      <h1 className=" text-neutral-700 text-[33px] font-semibold ">Tickets</h1>
      <Button
        className=" bg-primary-700 text-white text-[16px] lg:px-[24px]"
        variant="shadow"
        onClick={() => {
          router.push("/new-task");
        }}
      >
        New Request
      </Button>
    </div>
  );
}
