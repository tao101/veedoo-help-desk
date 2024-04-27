"use client";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import DropdownProfile from "./dropdownProfile";
import NotificationDropDown from "./notificationDropDown";
import { User } from "lucia";
import { useRouter } from "next/navigation";

export default function Header({
  withUser = false,
  user,
}: {
  withUser: boolean;
  user: User | null;
}) {
  const router = useRouter();

  return (
    <header className="px-2.5 lg:px-[32px] bg-white min-h-[80px] flex flex-row items-center justify-between ">
      <Link href="/">
        <Image alt="veedoo logo" src="/veedooLogo.png" width={96} height={40} />
      </Link>
      {withUser && (
        <div className=" flex flex-row items-center gap-2.5 lg:gap-[32px]  ">
          <Button
            className=" bg-primary-700 text-white text-[16px] lg:px-[24px]"
            variant="shadow"
            onClick={() => {
              router.push("/new-task");
            }}
          >
            New Request
          </Button>
          <NotificationDropDown />
          <DropdownProfile user={user} />
        </div>
      )}
    </header>
  );
}
