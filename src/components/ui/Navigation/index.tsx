"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { ThemeSwitcher } from "../ThemeSwither/ThemeSwitcher";
import { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./navigataion.module.css";

const Navigation = () => {
  const pathname = usePathname();
  const links = {
    "/ticker": "Ticker",
    "/": "Home",
    "/about": "About",
  };
  const [activePage, setActivePage] = useState(pathname);

  const ChangeColor = (pageNumber: string) => {
    setActivePage(pageNumber);
  };
  const middleElement = Math.floor(Object.keys(links).length / 2);
  return (
    <Navbar maxWidth="full">
      <div className="grid grid-cols-6 w-full">
        <NavbarBrand>
          <p className="font-bold text-inherit">Stocks</p>
        </NavbarBrand>

        <NavbarContent className="col-start-2 col-end-6 hidden sm:flex gap-4">
          {Object.entries(links).map(([link, title], index) => (
            <NavbarItem
              key={index.toString()}
              className={
                index == middleElement
                  ? "mx-auto"
                  : index < middleElement
                  ? "mr-auto flex flex-1 justify-end"
                  : "ml-auto flex flex-1 justify-start"
              }
            >
              <Link
                href={link}
                color={link == activePage ? "secondary" : "foreground"}
                onPress={() => ChangeColor(link)}
                key={index.toString()}
              >
                {title}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent as="div" justify="end" className="flex col-start-6">
          <NavbarItem>
            <ThemeSwitcher></ThemeSwitcher>
          </NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="faded">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">zoey@example.com</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </div>
    </Navbar>
  );
};

export default Navigation;
