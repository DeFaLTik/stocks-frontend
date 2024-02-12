"use client";
import Link from "next/link";
import { Skeleton } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ISecurities } from "@/models";
import SecurityCard from "./SecurityCard";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion as m } from "framer-motion";

export default function SidePanel({
  securities,
  parentCallBack,
  mounted,
  isScrollGoingDown,
}: {
  securities: ISecurities[];
  parentCallBack: CallableFunction;
  mounted: boolean;
  isScrollGoingDown: boolean;
}) {
  const pathname = usePathname();
  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    if (pathname) {
      setActivePage(pathname.split("/").slice(-1)[0]);
    }
  }, [pathname]);

  return (
    <div className="grid w-auto space-y-2">
      <div className="w-full h-[24px] bg-transparent"></div>
      <AnimatePresence initial={false}>
        {mounted ? (
          !securities.length ? (
            <m.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-[calc(100vh-124px)] flex justify-center items-center text-3xl"
            >
              Nothing
            </m.h1>
          ) : (
            securities.map((security) => (
              <div key={security?.sec_id} className="rounded-none px-2">
                <m.div
                  initial={{
                    y: isScrollGoingDown ? "-50%" : "50%",
                    opacity: 0.7,
                  }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.2, type: "tween" }}
                  className={`w-full h-20`}
                  viewport={{ amount: 0.1 }}
                >
                  <Link
                    href={`/ticker/${security.sec_id}`}
                    className={
                      `hover:transition-colors active:transition-colors 
                    overflow-hidden
                    w-full h-20 border-[1px] ` +
                      ` border-neutral-300/25 rounded-2xl flex 
                    dark:border-[#444a]
                    justify-center items-center active:bg-zinc-200 hover:bg-zinc-100/hover ` +
                      `dark:active:bg-neutral-800 dark:hover:bg-neutral-800/hover ${
                        pathname !== "/ticker" &&
                        security &&
                        security.sec_id === activePage
                          ? "bg-zinc-100 dark:bg-neutral-800"
                          : ""
                      }`
                    }
                    onClick={() => {
                      setActivePage(security.sec_id);
                      parentCallBack();
                    }}
                  >
                    <SecurityCard data={security} show={mounted} />
                  </Link>
                </m.div>
              </div>
            ))
          )
        ) : (
          ""
        )}
      </AnimatePresence>
    </div>
  );
  // return <Link href={`/ticker/${ticker.name}`}>Link</Link>;
}
