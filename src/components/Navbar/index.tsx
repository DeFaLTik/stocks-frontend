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
  Button,
} from "@nextui-org/react";
import { ThemeSwitcher } from "../CustomUI/ThemeSwither/ThemeSwitcher";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./navigation.module.css";
import CustomToolTip from "../CustomUI/CustomToolTip";
import { signIn, signOut } from "next-auth/react";

export default function CustomNavbar({
  user,
  isValidating,
}: {
  user: any;
  isValidating: boolean;
}) {
  const links = {
    "/ticker": "Ticker",
    "/about": "About",
  };

  const pathname = usePathname();

  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    if (pathname) {
      setActivePage("/" + pathname.split("/")[1]);
    }
  }, [pathname]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const ChangeColor = (pageNumber: string) => {
    setActivePage(pageNumber);
  };
  return (
    <Navbar
      maxWidth="full"
      height={"64px"}
      className="antialiased z-20"
      position="static"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      isBlurred={false}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="min-[500px]:hidden"
        />
        <CustomToolTip content="Home">
          <Link
            href="/"
            className="font-bold text-inherit h-[40px]"
            onPress={() => {
              setActivePage("/home");
            }}
          >
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
        <Dropdown placement="bottom-end" className="">
          <DropdownTrigger className="ml-4">
            <Avatar
              isBordered
              as="button"
              className="transition-transform text-white"
              color="secondary"
              size="sm"
              showFallback
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            variant="faded"
            className="w-full h-full"
          >
            {user ? (
              <DropdownItem
                key="profile"
                textValue="profile"
                as={Link}
                href="/profile"
                className="w-full h-full text-black dark:text-foreground
                text-sm font-normal"
                onPress={() => setActivePage("/profile")}
              >
                Signed as
                <br />
                {user.email}
              </DropdownItem>
            ) : (
              <DropdownItem
                as={Button}
                className="w-full h-full bg-transparent"
                onClick={() =>
                  signIn("zitadel", {
                    callbackUrl: pathname,
                  })
                }
              >
                Sign in
              </DropdownItem>
            )}

            <DropdownItem
              key="logout"
              color="danger"
              textValue="logout"
              as={Button}
              className="w-full h-full bg-transparent"
              onClick={() => {
                console.log("signed out");
                signOut();
              }}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarMenu className="z-10">
        {Object.entries(links).map(([link, title], index) => (
          <NavbarMenuItem key={index.toString()}>
            <Link
              href={link}
              color={link == activePage ? "secondary" : "foreground"}
              onPress={() => {
                ChangeColor(link);
                setIsMenuOpen(!isMenuOpen);
              }}
              key={index.toString()}
            >
              {title}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
