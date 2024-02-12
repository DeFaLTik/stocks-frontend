import SidePanel from "@/components/Ticker/SidePane";
import axios from "axios";
import React, { useCallback, useEffect, useMemo } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import ScrollToTopButton from "@/components/CustomUI/ScrollToTopButton";
import { motion as m, useAnimationControls } from "framer-motion";
import { ISecurities } from "../../models";
import styles from "@/styles/scroll.module.css";
import CustomInput from "@/components/CustomUI/CustomInput";
import SingleTickerPage from "./SingleTickerPage/layout";

// export const API_URL = "http://localhost:8080/api/v1/securities";
const SIZE_SM = 640;

export default function TickerLayout() {
  const [showTicker, setShowTicker] = useState(false);
  const [showToTopBtn, setShowToTopBtn] = useState(false);
  const [data, setData] = useState<ISecurities[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isWidthSmall, setIsWidthSmall] = useState<boolean | null>(null);
  const [isWidthChanged, setIsWidthChanged] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState("");
  const [isScrollGoingDown, setIsScrollGoingDown] = useState(false);

  const controlsList = useAnimationControls();
  const controlsPage = useAnimationControls();

  const pathname = usePathname();
  const isStartPage = pathname === "/ticker";

  const [secId, setSecId] = useState("__news");

  useEffect(() => {
    if (pathname) {
      setSecId(!isStartPage ? pathname.split("/").slice(-1)[0] : "__news");
    }
  }, [pathname, isStartPage]);

  const variants = {
    open: { x: 0, display: "block" },
    close: { x: "100%", transitionEnd: { display: "none" } },
  };

  const searchedData = useMemo(() => {
    if (data) {
      return data.filter(
        (ticker) =>
          ticker.short_name
            .toLowerCase()
            .includes(searchedQuery.toLowerCase()) ||
          ticker.sec_id.toLowerCase().includes(searchedQuery.toLowerCase())
      );
    } else {
      return data;
    }
  }, [data, searchedQuery]);

  async function fetchData() {
    try {
      const {
        data: { securities },
      } = await axios.get(`${process.env.API_URL}/securities`);
      console.log("securities fetched");
      setData(securities);
    } catch (e) {
      console.log("error", e);
    }
  }

  const handleResize = useCallback(() => {
    if (!isWidthChanged) {
      setIsWidthChanged(isWidthSmall !== window.innerWidth < SIZE_SM);
    }
    setIsWidthSmall(window.innerWidth < SIZE_SM);
  }, [isWidthSmall, isWidthChanged]);

  const saveShowTickerState = (value: boolean) => {
    localStorage.setItem("showTicker", value ? "true" : "false");
    setShowTicker(value);
  };

  useEffect(() => {
    if (isWidthChanged) {
      saveShowTickerState(!isStartPage || !isWidthSmall);
    }
  }, [isWidthChanged, isWidthSmall, isStartPage]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Loading Local Storage Hook

  useEffect(() => {
    if (!mounted) {
      console.log("Loading Local Storage Hook");
      const storedState = localStorage.getItem("showTicker");
      if (
        (storedState && storedState === "true" && !isStartPage) ||
        window.innerWidth > SIZE_SM
      ) {
        saveShowTickerState(true);
        controlsPage.set({ x: 0, opacity: 1 });
      } else {
        saveShowTickerState(false);
        controlsPage.set({ x: "100%", opacity: 1 });
      }
      setIsWidthSmall(window.innerWidth < SIZE_SM);
    }
  }, [mounted, controlsPage, isStartPage]);

  // hook for fetching data

  useEffect(() => {
    console.log("Fetching data Hook");
    console.log(process.env.INTERVAL);
    fetchData().then(() => {
      setMounted(true);
      console.log("mounted");
    });

    const interval = setInterval(() => {
      fetchData();
    }, parseInt(process.env.INTERVAL || "5000"));

    return () => {
      clearInterval(interval);
    };
  }, [controlsList]);

  useEffect(() => {
    if (mounted) {
      controlsList.start({ y: "0" });
    }
  }, [mounted, controlsList]);

  return (
    <m.div
      key="ticker"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, type: "tween" }}
      className="flex w-screen h-full relative border-t-[1px] dark:border-[#444a] border-neutral-300/25 overflow-hidden z-0"
    >
      <div
        style={{
          transitionProperty: "width",
          transitionDuration: "600ms",
          animationTimingFunction: "ease-in-out",
        }}
        className={`relative w-full sm:w-1/3 sm:min-w-[30%] ease-in-out h-full z-0`}
      >
        {mounted ? (
          <CustomInput
            value={searchedQuery}
            name="Search"
            onChange={(e) => {
              setSearchedQuery(e.target.value);
            }}
          />
        ) : (
          ""
        )}

        <m.div
          layoutScroll
          initial={{ y: "100%" }}
          transition={{ duration: 0.6, type: "tween", ease: "easeInOut" }}
          exit={{ y: "100%" }}
          id="scrollable-component"
          animate={controlsList}
          className={`w-full h-full overflow-y-scroll mt-[32px] ${styles.scroller}`}
          onMouseMove={(e) => {
            setShowToTopBtn(e.clientY + 100 > window.innerHeight);
          }}
        >
          <SidePanel
            securities={searchedData}
            parentCallBack={() => {
              saveShowTickerState(true);
            }}
            mounted={mounted}
            isScrollGoingDown={isScrollGoingDown}
          />
        </m.div>
        <div className="w-full z-0">
          <ScrollToTopButton
            showTicker={showTicker}
            showOnBottom={showToTopBtn}
            isScrollGoingDown={(event: boolean) => {
              setIsScrollGoingDown(event);
            }}
          />
        </div>
      </div>

      <m.div
        initial={{ opacity: 0 }}
        animate={!mounted ? controlsPage : showTicker ? "open" : "close"}
        transition={{ duration: 0.6, ease: "easeInOut", type: "spring" }}
        style={{
          transitionProperty: "width",
          transitionDuration: "400ms",
          animationTimingFunction: "ease-in-out",
        }}
        variants={variants}
        className={`w-full sm:w-2/3 right-0 absolute h-full !important z-10`}
      >
        <div
          className={`flex justify-center sm:border-l-[1px] border-neutral-300/25 dark:border-[#444a] 
            w-full h-full dark:text-white`}
        >
          <SingleTickerPage
            secId={secId}
            isStartPage={isStartPage}
            showTicker={showTicker}
            parentCallback={() => {
              saveShowTickerState(false);
            }}
          />
        </div>
      </m.div>
    </m.div>
  );
}
