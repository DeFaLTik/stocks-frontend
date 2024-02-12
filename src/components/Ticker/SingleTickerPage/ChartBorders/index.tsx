"use client";
import { forwardRef, useState } from "react";
import { motion as m, useAnimate, useAnimationControls } from "framer-motion";
import { IBorders, ICharType, chartName } from "@/models";

const ChartBorders = forwardRef(function ChartBorders(
  {
    candleBordersData,
    chartTypes,
    setCurrentBorders,
    setChartType,
    currentBorders,
    chartType,
  }: {
    candleBordersData: IBorders[];
    chartTypes: ICharType[];
    setCurrentBorders: CallableFunction;
    setChartType: CallableFunction;
    currentBorders: string;
    chartType: chartName;
  },
  ref
) {
  // const [activeButton, setActiveButton] = useState(0);
  // const [activeChartType, setActiveChartType] = useState(0);
  const controlsBorders = useAnimationControls();
  const controlsChartType = useAnimationControls();

  return (
    <m.ul
      ref={ref}
      layoutId="borders"
      key="borders"
      layout
      initial={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut", type: "tween" }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className={`
              z-10
              relative
              lg:grid-rows-1 min-[500px]:grid-rows-2 grid-rows-3
              grid w-full lg:h-[calc(80px*1/3)] h-[80px] min-[500px]:h-[60px] lg:grid-cols-9 grid-cols-3 min-[500px]:grid-cols-5
              overflow-hidden 
              shadow-inner
              border-transparent/5
              border-[1px]
              bg-transparent
              bg-gradient-to-b from-stone-200  to-stone-200/75
              dark:from-neutral-800 dark:to-neutral-800/90
             bg-neutral-200 rounded-xl text-neutral-400`}
    >
      <m.div
        animate={controlsBorders}
        initial={{
          x: `${
            candleBordersData &&
            candleBordersData.findIndex(
              (value) => value.interval.toString() == currentBorders
            ) * 100
          }%`,
        }}
        transition={{
          duration: 0.4,
          type: "spring",
          ease: "backInOut",
        }}
        className="max-lg:hidden absolute h-full w-[calc(100%/9)] z-0 flex items-center px-[2px]"
      >
        <div
          className="w-full shadow-inner h-full bg-stone-100
                   dark:bg-neutral-900 rounded-full"
        ></div>
      </m.div>
      {candleBordersData &&
        candleBordersData.map(({ interval, title }, index) => (
          <li
            key={index}
            value={interval}
            className={`
                    overflow-clip justify-center flex m-[2px] items-center 
                    font-sans font-medium rounded-full cursor-pointer 
                    px-2 capitalize ${
                      interval.toString() === currentBorders
                        ? "max-lg:bg-stone-100 text-black dark:text-stone-50 max-lg:dark:bg-neutral-900"
                        : "bg-transparent hover:text-black/hover dark:hover:text-neutral-200/hover dark:text-neutral-400"
                    }`}
            onClick={(e) => {
              if (interval.toString() !== currentBorders) {
                console.log("clicked");
                controlsBorders.start({
                  x: `${index * 100}%`,
                });
                setCurrentBorders(interval.toString());
              }
            }}
          >
            <p className="line-clamp-1 whitespace-nowrap z-10 font-Roboto">
              {title}
            </p>
          </li>
        ))}
      <ul
        className="
                relative
              col-span-2 grid grid-cols-2  grid-rows-1 border-l-2 border-stone-400/20 rounded-none overflow-hidden"
      >
        <m.div
          animate={controlsChartType}
          initial={{
            x: `${
              chartType &&
              chartTypes.findIndex(
                (value) => value.name.toString() == chartType
              ) * 100
            }%`,
          }}
          transition={{
            duration: 0.4,
            type: "spring",
            ease: "backInOut",
          }}
          className="absolute h-full w-1/2 z-0 flex items-center px-[2px]"
        >
          <div className="w-full h-full bg-stone-100 dark:bg-neutral-900 rounded-full shadow-inner"></div>
        </m.div>
        {chartTypes.map(({ name, icon }, index) => {
          return (
            <li
              key={name}
              className={`
                        overflow-clip justify-center flex my-[2px] items-center z-10
                        font-sans font-medium rounded-full cursor-pointer 
                        px-2 capitalize ${
                          name === chartType
                            ? "bg-transparent fill-black dark:fill-stone-50 dark:bg-transparent"
                            : "bg-transparent hover:fill-black/hover dark:hover:fill-neutral-200/hover dark:fill-neutral-400"
                        }`}
              onClick={(e) => {
                if (name !== chartType) {
                  controlsChartType.start({
                    x: `${index * 100}%`,
                  });
                  setChartType(name);
                }
              }}
            >
              {icon}
            </li>
          );
        })}
      </ul>
    </m.ul>
  );
});

export default ChartBorders;
