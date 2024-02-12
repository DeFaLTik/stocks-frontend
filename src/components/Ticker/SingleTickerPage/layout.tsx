"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { IBorders, ICandles, ICharType, ISecurities } from "@/models";
import { AnimatePresence, motion as m } from "framer-motion";
import Charts from "./Charts";
import LinearChartIcon from "@/components/Ticker/SingleTickerPage/ChartsIcons/LinearChartIcon";
import CandleStickChartIcon from "@/components/Ticker/SingleTickerPage/ChartsIcons/CandleStickChartIcon";
import News from "./News";
import ChartBorders from "@/components/Ticker/SingleTickerPage/ChartBorders";

export default function SingleTickerPage({
  secId,
  isStartPage,
  parentCallback,
  showTicker,
}: {
  secId: string;
  isStartPage: boolean;
  parentCallback: CallableFunction;
  showTicker: boolean;
}) {
  const [isBoardersFetched, setIsBoardersFetched] = useState(false);
  const [candleBordersData, setCandleBordersData] = useState<IBorders[]>([]);
  const [currentBorders, setCurrentBorders] = useState<string>("1");
  const [chartType, setChartType] = useState<"line" | "candlestick">("line");
  const [securityData, setSecurityData] = useState<ISecurities>();

  function saveChartType(chart: "line" | "candlestick") {
    setChartType(chart);
    localStorage.setItem("chartType", chart);
  }

  function saveCurrentBorders(borders: string) {
    setCurrentBorders(borders);
    localStorage.setItem("currentBorders", borders);
  }

  useEffect(() => {
    const storedChartType = localStorage.getItem("chartType") as
      | null
      | "line"
      | "candlestick";
    const storedBorder = localStorage.getItem("currentBorders");
    if (storedBorder && storedChartType) {
      console.log("borders restored!");
      setCurrentBorders(storedBorder);
      setChartType(storedChartType);
    }
  }, []);

  const chartTypes: ICharType[] = [
    {
      name: "line",
      icon: <LinearChartIcon />,
    },
    {
      name: "candlestick",
      icon: <CandleStickChartIcon />,
    },
  ];
  const fetchBordersData = useCallback(async () => {
    try {
      const {
        data: { candle_borders },
      } = await axios.get(
        `${process.env.API_URL}/securities/${secId}/candleborders`
      );
      return candle_borders;
    } catch (e) {}
  }, [secId]);

  const fetchSecurityData = useCallback(async () => {
    try {
      if (secId !== "__news") {
        const {
          data: { security },
        } = await axios.get(`${process.env.API_URL}/securities/${secId}`);
        return security;
      }
    } catch (e) {}
  }, [secId]);

  useEffect(() => {
    console.log("fetching borders...");
    // if (secId !== "__news") {
    fetchBordersData()
      .then((candle_borders: IBorders[]) => {
        setCandleBordersData(candle_borders);
      })
      .then(() => fetchSecurityData())
      .then((security: ISecurities) => {
        setSecurityData(security);
        setIsBoardersFetched(true);
        console.log("Boarders Fetched: ");
      });

    const i = setInterval(() => {
      fetchSecurityData();
    }, parseInt(process.env.INTERVAL || "5000"));
    return () => {
      clearInterval(i);
    };
    // }
  }, [fetchBordersData, fetchSecurityData, secId]);

  const defaultAnimtaion = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const anotherAnimation = {
    hidden: {
      y: -100,
    },
    visible: {
      y: 0,
      transition: {
        duration: 0.2,
        type: "spring",
        ease: [0.36, 0, 0.66, -0.56],
        bounce: 1,
        stiffness: 100,
        mass: 0.5,
        restSpeed: 1,
      },
    },
  };

  return (
    <m.div
      layout
      className="w-full h-full overflow-x-hidden overflow-y-scroll flex flex-wrap px-4 dark:bg-black bg-white z-10"
    >
      {isBoardersFetched ? (
        <m.div
          key="another"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          // exit={{ opacity: 0 }}
          className="w-full h-full "
        >
          <div className="flex h-16 w-full">
            <div className="flex justify-center items-center z-10">
              <m.button
                onClick={() => {
                  parentCallback();
                }}
                className={`sm:hidden dark:fill-white h-12 w-7 flex z-10 justify-start items-center rounded-full`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
                </svg>
              </m.button>
            </div>

            {isBoardersFetched ? (
              <AnimatePresence mode="wait">
                <m.div
                  layout
                  className="w-full h-full grid grid-cols-2 px-1 z-10 dark:bg-black bg-white"
                  key={secId}
                >
                  {isStartPage ? (
                    ""
                  ) : (
                    <m.div
                      initial="hidden"
                      animate={showTicker ? "visible" : "hidden"}
                      transition={{
                        staggerChildren: 0.1,
                      }}
                      className="flex justify-start h-full items-center gap-3"
                    >
                      <div className="">
                        <m.p
                          key={1}
                          className={`font-bold text-xl`}
                          aria-hidden
                        >
                          {securityData &&
                            Intl.NumberFormat("ru-RU", {
                              style: "currency",
                              currency: "RUB",
                            })
                              .format(securityData.offer)
                              .split("")
                              .map((v, i) =>
                                v !== String.fromCharCode(0x00a0) ? (
                                  <m.span
                                    className="inline-block"
                                    variants={defaultAnimtaion}
                                    exit={{ opacity: 0 }}
                                    key={`${v}+${i}`}
                                  >
                                    {v}
                                  </m.span>
                                ) : (
                                  <span className="" key={`${v}+${i}`}>
                                    {v}
                                  </span>
                                )
                              )}
                        </m.p>
                      </div>
                      {securityData && (
                        <m.p
                          variants={anotherAnimation}
                          exit={{ opacity: 0 }}
                          key={securityData.last_to_prev_price}
                          className={`${
                            securityData.last_to_prev_price > 0
                              ? "text-just-green"
                              : "text-red-500"
                          }`}
                        >
                          {(securityData.last_to_prev_price > 0 ? "+" : "") +
                            securityData.last_to_prev_price
                              .toFixed(2)
                              .toString()
                              .replace(".", ",")}
                        </m.p>
                      )}
                    </m.div>
                  )}

                  <div className="col-start-2 flex justify-end w-full h-full">
                    <m.div
                      initial={{ x: "150%" }}
                      animate={{ x: showTicker ? 0 : "150%" }}
                      exit={{ x: "150%" }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                        type: "tween",
                      }}
                      className="
                    flex w-fit justify-center text-4xl font-bold h-full items-center
                    "
                    >
                      {secId.replace("__", "").toUpperCase()}
                    </m.div>
                  </div>
                </m.div>
              </AnimatePresence>
            ) : (
              <div className="flex w-full justify-end text-4xl font-bold h-[60px] items-center"></div>
            )}
          </div>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, type: "tween" }}
            className={`w-full h-full gap-4 grid grid-cols-1 relative z-10`}
          >
            <AnimatePresence mode="popLayout" initial={true}>
              {!isStartPage && (
                <ChartBorders
                  key="borders"
                  candleBordersData={candleBordersData}
                  chartTypes={chartTypes}
                  currentBorders={currentBorders}
                  chartType={chartType}
                  setChartType={(val: "line" | "candlestick") => {
                    saveChartType(val);
                  }}
                  setCurrentBorders={(val: string) => {
                    saveCurrentBorders(val);
                  }}
                />
              )}
              {!isStartPage && (
                <Charts
                  kew="charts"
                  secId={secId}
                  borders={currentBorders}
                  chartType={chartType}
                />
              )}

              <News key="news" secId={secId} />
            </AnimatePresence>
          </m.div>
        </m.div>
      ) : (
        <div className="bg-white dark:bg-black w-full h-full"></div>
      )}
    </m.div>
  );
}
