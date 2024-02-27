import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

import { useAuthStatus, logout } from "../Firebase/FirebaseFunctions";
export default function AvatarDropdown() {
  const navigate = useNavigate();
  async function loggingOut() {
    await logout(); // Wait for logout operation to complete
    navigate("/");
    console.log("logging out successfully");
  }
  const { user, isLoggedin } = useAuthStatus();

  
  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar isBordered as="button" className="transition-transform" />
        </DropdownTrigger>
        {isLoggedin && (
          <>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user?.email}</p>
              </DropdownItem>

              <DropdownItem key="logout" color="danger" onClick={loggingOut}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </>
        )}
      </Dropdown>
    </div>
  );
}
