"use client";
import { Skeleton } from "@nextui-org/react";
import { useState, useEffect } from "react";

export default function TickerName({ params }: { params: { sec_id: string } }) {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  return (
    <div className="flex justify-center bg-red-200 w-full h-full items-center text-7xl dark:text-black">
      <Skeleton
        isLoaded={isLoaded}
        className={`rounded-lg flex justify-center items-center`}
      >
        {isLoaded ? params.sec_id : ""}
      </Skeleton>
    </div>
  );
}
