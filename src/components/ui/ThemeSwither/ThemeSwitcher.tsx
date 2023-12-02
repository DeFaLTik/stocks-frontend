"use client";

import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonIcon } from "./MoonIcon";
import { SunIcon } from "./SunIcon";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  function switchTheme() {
    setTheme(theme == "light" ? "dark" : "light");
  }

  return (
    <Button
      onClick={switchTheme}
      isIconOnly
      className="bg-transparent rounded-full"
    >
      {theme == "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
