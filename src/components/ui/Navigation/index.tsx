"use client";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { ThemeSwitcher } from "../ThemeSwither/ThemeSwitcher";
import { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./navigation.module.css";
import CustomToolTip from "../CustomToolTip/CustomToolTip";

const Navigation = () => {
  const links = {
    "/ticker": "Ticker",
    "/about": "About",
  };

  const [activePage, setActivePage] = useState(usePathname());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const ChangeColor = (pageNumber: string) => {
    setActivePage(pageNumber);
  };
  return (
    <Navbar
      maxWidth="full"
      className="antialiased"
      onMenuOpenChange={setIsMenuOpen}
      disableAnimation
      isBlurred={false}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="min-[500px]:hidden"
        />
        <CustomToolTip content="Home">
          <Link href="/" className="font-bold text-inherit h-[40px]">
            Stocks
          </Link>
        </CustomToolTip>
      </NavbarContent>
      <NavbarContent justify="end" className="gap-0">
        {Object.entries(links).map(([link, title], index) => (
          <NavbarItem
            key={index.toString()}
            className="hidden min-[500px]:flex m-2"
          >
            <Link
              href={link}
              color={link == activePage ? "secondary" : "foreground"}
              onPress={() => ChangeColor(link)}
              key={index.toString()}
              className={styles.withUnderLine}
            >
              {title}
            </Link>
          </NavbarItem>
        ))}
        <CustomToolTip content="Mode">
          <NavbarItem className="m-2">
            <ThemeSwitcher />
          </NavbarItem>
        </CustomToolTip>
        <Dropdown placement="bottom-end" className="max-w-[120px]">
          <DropdownTrigger className="ml-4">
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              size="sm"
              showFallback
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            variant="faded"
            className="break-all"
          >
            <DropdownItem
              key="profile"
              className="gap-2 text-white hover:opacity-80 font-semibold"
              as={Link}
              href="/profile"
            >
              Signed as
              <br />
              test@example.com
              {/* <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">test@example.com</p> */}
            </DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarMenu>
        {Object.entries(links).map(([link, title], index) => (
          <NavbarMenuItem key={index.toString()}>
            <Link
              href={link}
              color={link == activePage ? "secondary" : "foreground"}
              onPress={() => ChangeColor(link)}
              key={index.toString()}
            >
              {title}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default Navigation;
