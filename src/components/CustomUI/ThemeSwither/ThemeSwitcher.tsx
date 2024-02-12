"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import { SunIcon } from "./Icons/SunIcon";
import { MoonIcon } from "./Icons/MoonIcon";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);
  function switchTheme() {
    setTheme(theme == "light" ? "dark" : "light");
  }

  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.3,
      y: "-150%",
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.4, type: "spring" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, type: "spring", ease: "easeInOut" },
    },
  };

  return (
    <button
      onClick={switchTheme}
      className="bg-transparent w-[40px] h-[40px] rounded-lg flex items-center justify-center"
    >
      <AnimatePresence mode="popLayout">
        {mounted && theme ? (
          theme == "light" ? (
            <m.div
              key="sunIcon"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              className="w-5 h-5"
            >
              <SunIcon />
            </m.div>
          ) : (
            <m.div
              key="moonIcon"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              className="w-5 h-5"
            >
              <MoonIcon />
            </m.div>
          )
        ) : (
          <div className="w-5 h-5"></div>
        )}
      </AnimatePresence>
    </button>
  );
}
