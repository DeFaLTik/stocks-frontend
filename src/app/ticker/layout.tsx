"use client";
import SidePanel from "@/components/ui/Ticker/SidePane";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import { motion as m, useAnimationControls } from "framer-motion";
import { ISecurities } from "../models";

const API_URL = "http://localhost:8080/api/v1/securities";
const TEST_URL = "https://jsonplaceholder.typicode.com/posts";

export default function TickerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showTicker, setShowTicker] = useState(false);
  const [shotToTopBtn, setShowToTopBtn] = useState(false);
  const controlsList = useAnimationControls();
  const controlsPage = useAnimationControls();

  // const securities = [...new Array(20)].map((v, i: number) => {
  //   return {
  //     sec_id: i.toString(),
  //     short_name: "",
  //     offer: 100,
  //     last_to_prev_price: 1,
  //   };
  // });
  const [data, setData] = useState<ISecurities[]>([]);
  const [mounted, setMounted] = useState(false);
  const variants = {
    open: { x: 0 },
    close: { x: "100%" },
  };
  async function fetchData() {
    const {
      data: { securities },
    } = await axios.get(`${API_URL}`);
    console.log("fetched");
    setData(securities);
  }

  useEffect(() => {
    const storedState = localStorage.getItem("showTicker");
    if (storedState && storedState === "true") {
      setShowTicker(true);
      controlsPage.set({ x: 0, opacity: 1 });
    } else {
      controlsPage.set({ x: "100%", opacity: 1 });
    }

    fetchData().then(() => {
      controlsList.start({ y: 0 });
      setMounted(true);
    });
    // .then(() => setMounted(true));

    const interval = setInterval(() => {
      fetchData();
    }, 50000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-screen justify-center">
      {/* <AnimatePresence initial={false}> */}
      <div
        id="ticker"
        className={`w-full h-[calc(100vh-64px)] overflow-x-hidden relative border-neutral-400/50 transition-all duration-100 rounded-none flex`}
      >
        <m.div
          layoutScroll
          initial={{ y: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            overflowY: "scroll",
            transitionProperty: "width",
            transitionDuration: "400ms",
          }}
          id="scrollable-component"
          animate={controlsList}
          className={`w-full sm:w-1/3 sm:min-w-[30%] ease-in-out`}
          onMouseMove={(e) =>
            setShowToTopBtn(e.clientY + 100 > window.innerHeight)
          }
        >
          <SidePanel
            securities={data}
            parentCallBack={() => {
              setShowTicker(true);
              // setIsStartPage(false);
              console.log(showTicker);
              localStorage.setItem("showTicker", "true");
            }}
            mounted={mounted}
          />
        </m.div>
        <div className="sm:hidden">
          <ScrollToTopButton
            showTicker={!showTicker}
            showOnBottom={shotToTopBtn}
          />
        </div>

        {/* <div className="flex w-1 bg-gray-300 max-sm:hidden items-center"></div> */}
        <m.div
          initial={{ opacity: 0 }}
          animate={!mounted ? controlsPage : showTicker ? "open" : "close"}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          variants={variants}
          className={`w-full max-sm:absolute h-[calc(100vh-64px)] ${
            usePathname() === "/ticker" ? "max-sm:hidden" : ""
          }`}
        >
          <button
            onClick={() => {
              setShowTicker(false);
              localStorage.setItem("showTicker", "false");
            }}
            className={`absolute z-10 sm:hidden dark:text-black`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-auto h-8 m-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
              />
            </svg>
          </button>
          {children}
        </m.div>
      </div>
      {/* </AnimatePresence> */}
    </div>
  );
}
