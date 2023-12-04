"use client";

import { Button, Divider } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import SwitherIcon from "./SwitcherIcon";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [onBoot, setOnBoot] = useState(true);
  useEffect(() => {
    setMounted(true);
  }, []);
  function switchTheme() {
    setTheme(theme == "light" ? "dark" : "light");
    setOnBoot(false);
  }

  return (
    <div>
      <Button
        onClick={switchTheme}
        isIconOnly
        className="bg-transparent w-[60px] h-[40px] rounded-lg flex items-center"
      >
        <Divider
          orientation="vertical"
          className={`hidden min-[500px]:flex transition h-4 ${
            mounted ? "scale-100" : "scale-0"
          }`}
        />
        {mounted && theme ? (
          theme == "light" ? (
            <SwitherIcon show={"moon"} onBoot={onBoot} />
          ) : (
            <SwitherIcon show={"sun"} onBoot={onBoot} />
          )
        ) : (
          ""
        )}
        <Divider
          orientation="vertical"
          className={`transition h-4 ${mounted ? "scale-100" : "scale-0"}`}
        />
      </Button>
    </div>
  );
}
