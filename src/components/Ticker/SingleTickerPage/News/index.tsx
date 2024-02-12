"use client";
import axios from "axios";
import { AnimatePresence, motion as m } from "framer-motion";
import { forwardRef, useCallback, useEffect, useState } from "react";
import NewsCard from "./NewsCard";
import { INews } from "@/models";

const openInNewTab = (url: string): void => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

const News = forwardRef(function News(
  {
    secId = "",
  }: {
    secId?: string;
  },
  ref
) {
  const arr = Array.from({ length: 20 }, (_, i) => i);

  const [fetched, setFetched] = useState(false);
  const [newsData, setNewsData] = useState<INews[]>([]);

  const fetchNewsData = useCallback(async (controller: AbortController) => {
    try {
      const {
        data: { articles },
      } = await axios.get(`${process.env.API_URL}/securities/news`, {
        signal: controller.signal,
      });
      console.log("news is fetched");
      return articles;
    } catch (e) {
      console.log("error", e);
    }
  }, []);
  useEffect(() => {
    if (true) {
      const controller = new AbortController();
      console.log("call fetch data");
      fetchNewsData(controller).then((articles: INews[]) => {
        setNewsData(articles);
        setFetched(true);
      });
      const i = setInterval(() => {
        fetchNewsData(controller).then((articles: INews[]) => {
          setNewsData(articles);
          setFetched(true);
        });
      }, parseInt(process.env.INTERVAL || "5000"));
      return () => {
        setFetched(false);
        console.log("abort");
        clearInterval(i);
        controller.abort();
      };
    }
  }, [fetchNewsData]);

  return (
    <m.div
      ref={ref}
      layoutId="news"
      layout
      key="news"
      transition={{ duration: 0.4, type: "tween", ease: "easeInOut" }}
      // initial={{ y: "50%", opacity: 0 }}
      // animate={{ y: 0, opacity: 1 }}
      // initial="hidden"
      // animate="visible"
      // variants={variants}
      // key={secId}
      className="w-full h-full grid grid-cols-2 gap-4 bg-white dark:bg-black rounded-xl z-10"
    >
      <AnimatePresence mode="wait">
        {newsData.length
          ? newsData.map((value: INews, index) => (
              <a
                className="h-32 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-3 overflow-hidden cursor-pointer"
                key={`${secId}+${index}`}
                onClick={() => {
                  openInNewTab(value.url);
                }}
              >
                <m.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 0 }}
                  className="w-full h-full"
                >
                  <NewsCard data={value} />
                </m.div>
              </a>
            ))
          : arr.map((value, index) => (
              <a
                // href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                className="h-32 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-3 overflow-hidden cursor-pointer"
                key={`${secId}+${index}`}
                // target="_blank"
                onClick={() => {
                  openInNewTab("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
                }}
              >
                <m.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 0 }}
                ></m.div>
              </a>
            ))}
      </AnimatePresence>
    </m.div>
  );
});

export default News;
