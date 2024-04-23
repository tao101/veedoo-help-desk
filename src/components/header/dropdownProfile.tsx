"use client";
import {
  Avatar,
  Badge,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

export default function DropdownProfile() {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <button className="mt-1 h-8 w-8 outline-none transition-transform">
          <Avatar
            name="leh.lotfi@gmail.com"
            showFallback
            className="w-[36px] h-[36px] "
          />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">johndoe@example.com</p>
        </DropdownItem>
        <DropdownItem key="settings">My Tickets</DropdownItem>
        <DropdownItem key="team_settings">Change Password</DropdownItem>

        <DropdownItem key="logout" color="danger">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
