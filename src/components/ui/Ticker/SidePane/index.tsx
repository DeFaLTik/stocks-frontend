"use client";
import Link from "next/link";
import { Skeleton } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ISecurities } from "@/app/models";
import SecurityCard from "./SecurityCard";
import ScrollToTopButton from "../../ScrollToTopButton";

export default function SidePanel({
  securities,
  parentCallBack,
  mounted,
}: {
  securities: ISecurities[];
  parentCallBack: CallableFunction;
  mounted: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  return (
    <div className="grid w-auto">
      {mounted
        ? securities.map((security) => (
            <Skeleton
              key={security?.sec_id}
              isLoaded={isLoaded}
              className="rounded-none"
            >
              <Link
                href={`/ticker/${security.sec_id}`}
                className="w-full h-20 border-t-[1px] border-neutral-300/25 rounded-none flex justify-center items-center"
                onClick={() => parentCallBack(true)}
                // data={security}
              >
                <SecurityCard data={security} show={mounted} />
                {/* {security?.short_name} */}
              </Link>
            </Skeleton>
          ))
        : [...Array(20)].map((_, index) => (
            <Skeleton
              key={index}
              isLoaded={isLoaded}
              className="rounded-none border-neutral-300/50 border-b-1"
            > 
              <div className="w-full h-20 border-b-1 rounded-none flex justify-center items-center"></div>
            </Skeleton>
          ))}
    </div>
  );
  // return <Link href={`/ticker/${ticker.name}`}>Link</Link>;
}
