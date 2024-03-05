import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Input,
} from "@nextui-org/react";
import LinkedinSvg from "./LinkedinSvg";
import { SearchIcon } from "./SearchIcon";
import { NavLink } from "react-router-dom";
import AvatarDropdown from "./AvatarDropdown";
import {
  pendingRequests,
  pendingRequests2,
  useAuthStatus,
} from "../Firebase/FirebaseFunctions";
import { auth } from "../Firebase/FirebaseConfig";

export default function MyNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pendingConnectionRequest, setpendingConnectionRequest] = useState([]);
  const [pendingConnectionRequest2, setpendingConnectionRequest2] = useState(
    []
  );
  useEffect(() => {
    pendingRequests(auth.currentUser.uid).then((e) =>
      setpendingConnectionRequest(e)
    );
    pendingRequests2(auth.currentUser.uid).then((e) =>
      setpendingConnectionRequest2(e)
    );
  }, []);
  const pending =
    pendingConnectionRequest.length + pendingConnectionRequest2.length;
  const { user } = useAuthStatus();
  const menuItems = [
    "Home",
    "Messages",
    "Connections",
    "FindUsers",
    "YourPosts",
  ];

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-10" justify="center">
        <NavbarBrand>
          <LinkedinSvg />
        </NavbarBrand>
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
        />
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-12" justify="center">
        <NavbarBrand>
          <LinkedinSvg />
        </NavbarBrand>
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
        />
        <NavbarItem>
          <NavLink to="/feed">Home</NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink to="/connections">
            Connections
            {pending > 0 ? (
              <>
                <span>({pending})</span>
              </>
            ) : (
              <></>
            )}
          </NavLink>
        </NavbarItem>
        <NavbarItem isActive>
          <NavLink to="/messages">Messages</NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink to="/findusers">FindUser</NavLink>
        </NavbarItem>
        <NavbarItem>
          <AvatarDropdown />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="md:hidden flex">
          <AvatarDropdown />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <NavLink
              className="w-full"
              to={
                item.toLowerCase() === "home"
                  ? "/feed"
                  : item.toLowerCase() === "yourposts"
                  ? `/yourposts/${user?.uid}`
                  : `/${item.toLowerCase()}`
              }
              color={
                index === 2
                  ? "warning"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              size="lg"
            >
              {item}
            </NavLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
