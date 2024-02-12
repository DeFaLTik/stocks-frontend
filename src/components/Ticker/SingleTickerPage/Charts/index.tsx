"use client";
import { ICandles, ICandlesticks, ILineSeriesData } from "@/models";
import {
  useCallback,
  useEffect,
  useState,
  useDeferredValue,
  useRef,
  forwardRef,
} from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import axios from "axios";
import { format as fmtDate } from "date-fns";

import {
  createChart,
  ColorType,
  CrosshairMode,
  LineStyle,
  Time,
  LineWidth,
} from "lightweight-charts";
import { useTheme } from "next-themes";

const ChartComponent = ({
  lineData,
  candleStickData,
  borders,
  showChart,
  chartType,
  isPriceIncrease,
  secId,
}: {
  lineData: ILineSeriesData[];
  candleStickData: ICandlesticks[];
  borders: string;
  showChart: boolean;
  chartType: "line" | "candlestick";
  isPriceIncrease: boolean;
  secId: string;
}) => {
  const chartContainerRef = useRef();
  const { theme } = useTheme();

  const myTimeFormatter = useCallback(
    (value: number) => {
      switch (borders) {
        case "1":
        case "10":
        case "60":
          return fmtDate(value * 1000, "EEE, LLL d, HH:mm");
        default:
          return fmtDate(value * 1000, "LLL d, yyyy");
      }
    },
    [borders]
  );

  // console.log("chart", showChart);

  useEffect(() => {
    console.log("use effect", showChart);

    console.log(chartType, "chart is rerendering");

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: theme === "light" ? "black" : "white",
      },
      grid: {
        vertLines: {
          color: theme === "dark" ? "#444a" : "#bcbcbc66",
        },
        horzLines: {
          color: theme === "dark" ? "#444a" : "#bcbcbc66",
        },
        localization: {
          dateFormat: "yyyy-mm-dd",
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: 350,
    });

    chart.timeScale().applyOptions({
      borderVisible: false,
    });

    chart.priceScale("right").applyOptions({
      borderVisible: false,
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#33D778ff",
      downColor: "#dc2626cc",
      borderVisible: true,
      borderColor: "black",
      wickUpColor: "#22c55e",
      wickDownColor: "#dc2626",
    });
    const liniSeries = chart.addAreaSeries({
      lineColor: isPriceIncrease ? "#33D778ff" : "#dc2626cc",
      topColor: isPriceIncrease ? "#2edc8766" : "#dc262644",
      bottomColor: isPriceIncrease ? "rgba( 40, 221, 100, 0)" : "#dc262611",
    });

    const myPriceFormatter = Intl.NumberFormat("ru-Ru", {
      style: "currency",
      currency: "RUB", // Currency for data points
    }).format;

    chart.applyOptions({
      crosshair: {
        mode:
          chartType === "line" ? CrosshairMode.Magnet : CrosshairMode.Normal,
        vertLine: {
          width: 4 as LineWidth,
          color: theme === "light" ? "#44444455" : "#99999955",
          style: LineStyle.Solid,
          labelBackgroundColor: "#444444",
        },
        horzLine: {
          color: theme === "light" ? "#444444aa" : "#999999aa",
          labelBackgroundColor: "#444444",
        },
      },
      localization: {
        timeFormatter: myTimeFormatter,
        priceFormatter: myPriceFormatter,
      },
    });

    chart.timeScale().applyOptions({
      fixRightEdge: true,
      fixLeftEdge: true,
      barSpacing: 10,
      timeVisible: true,
      secondsVisible: true,
    });
    if (!showChart) {
      chartType == "candlestick"
        ? candlestickSeries.setData(candleStickData)
        : liniSeries.setData(lineData);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      console.log("return");
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [
    candleStickData,
    theme,
    lineData,
    chartType,
    myTimeFormatter,
    isPriceIncrease,
    showChart,
  ]);

  const variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };

  return (
    <div
      className={`w-full h-fit rounded-xl overflow-hidden
    outline-transparent/25 outline-1 shadow-inner 
    bg-neutral-100 dark:bg-neutral-800
    `}
    >
      <m.div
        initial="hidden"
        animate={showChart ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: [0, 0.55, 0.45, 1] }}
        variants={variants}
        key={secId + borders}
        ref={chartContainerRef}
        className="w-full h-fit"
      />
    </div>
  );
};

const Charts = forwardRef(function Charts(
  {
    borders,
    secId,
    chartType,
  }: { borders: string; secId: string; chartType: "line" | "candlestick" },
  ref
) {
  const [candlestickSeries, setCandlestickSeries] = useState<ICandlesticks[]>(
    []
  );
  const [lineSeriesData, setLineSeriesData] = useState<ILineSeriesData[]>([]);
  const [isPriceIncrease, setIsPriceIncrease] = useState(true);

  const [fetched, setFetched] = useState(false);
  const defferedBorders = useDeferredValue(borders);
  const defferedSecId = useDeferredValue(secId);

  const fetchChartData = useCallback(
    async (interval: string, controller: AbortController) => {
      try {
        console.log("fetching candles on interval", interval);
        const {
          data: { candles },
        } = await axios.get(
          `${process.env.API_URL}/securities/${secId}/candles?` +
            new URLSearchParams({ interval: interval }),
          { signal: controller.signal }
        );
        console.log("candles is fetched");
        return candles;
      } catch (e) {
        console.log("error", e);
      }
    },
    [secId]
  );

  const ConvertData = (candles: ICandles[]) => {
    if (!candles) {
      return;
    }

    console.log("CANDLES:", candles);

    setIsPriceIncrease(
      candles.length > 0 && candles[candles.length - 1].open >= candles[0].open
    );

    setCandlestickSeries(
      candles.map((value) => {
        return {
          time: (Date.parse(value.begin) / 1000) as Time,
          open: value.open,
          high: value.high,
          low: value.low,
          close: value.close,
        };
      })
    );

    setLineSeriesData(
      candles.map((value) => {
        return {
          time: (Date.parse(value.begin) / 1000) as Time,
          value: (value.open + value.close) / 2,
        };
      })
    );
  };

  useEffect(() => {
    if (borders) {
      const controller = new AbortController();
      console.log("call fetch data");
      fetchChartData(borders, controller)
        .then((candles) => {
          setTimeout(() => {}, 2000);
          return candles;
        })
        .then((candles: ICandles[]) => {
          ConvertData(candles);
          setFetched(true);
        });
      const i = setInterval(() => {
        fetchChartData(borders, controller).then((candles) => {
          ConvertData(candles);
        });
      }, parseInt(process.env.INTERVAL || "5000"));
      return () => {
        setFetched(false);
        console.log("abort");
        clearInterval(i);
        controller.abort();
      };
    }
  }, [borders, fetchChartData]);

  return (
    <m.div
      layout
      ref={ref}
      layoutId="charts"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut", type: "tween" }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      // animate={{ scale: 1, opacity: 1 }}
      // exit={{ scale: 0.8, opacity: 0 }}
      key="chart"
      className="w-full h-[350px] flex justify-center items-start relative"
    >
      {candlestickSeries && candlestickSeries.length ? (
        <ChartComponent
          candleStickData={candlestickSeries}
          lineData={lineSeriesData}
          borders={borders}
          secId={secId}
          chartType={chartType}
          showChart={
            secId !== defferedSecId || borders !== defferedBorders || !fetched
          }
          isPriceIncrease={isPriceIncrease}
        ></ChartComponent>
      ) : (
        <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800 "></div>
      )}
    </m.div>
  );
});

export default Charts;
