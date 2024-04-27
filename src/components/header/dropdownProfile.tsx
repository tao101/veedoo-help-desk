"use client";
import { signoutUser } from "@/app/actions/auth/signoutUser";
import {
  Avatar,
  Badge,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { User } from "lucia";
import { useRouter } from "next/navigation";

export default function DropdownProfile({ user }: { user: User | null }) {
  const router = useRouter();

  const onLogout = async () => {
    console.log("onLogout");
    let response = await signoutUser();
    console.log("onLogout", response);
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <button className="mt-1 h-8 w-8 outline-none transition-transform">
          <Avatar
            name={user?.name}
            showFallback
            className="w-[36px] h-[36px] "
          />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{user?.email}</p>
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            router.push("/");
          }}
          key="myTickets"
        >
          My Tickets
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            router.push("/change-password");
          }}
          key="changePassword"
        >
          Change Password
        </DropdownItem>

        <DropdownItem onClick={onLogout} key="logout" color="danger">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
