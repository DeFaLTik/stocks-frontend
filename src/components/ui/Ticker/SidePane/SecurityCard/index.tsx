import { ISecurities } from "@/app/models";
import { motion as m } from "framer-motion";

export default function SecurityCard({
  data,
  show,
}: {
  data: ISecurities;
  show: boolean;
}) {
  return (
    <div className="grid grid-cols-3 w-full h-full antialiased p-3">
      <div className="col-span-2 grid grid-rows-2">
        <p className="w-full flex items-center justify-start text-xl font-extrabold">
          {data.sec_id}
        </p>
        <p className="w-full flex items-center text-sm text-neutral-400">
          {data.short_name}
        </p>
      </div>
      <div className="grid grid-rows-2">
        <div className="flex w-full items-center justify-end">
          {(Math.round(data.offer * 100) / 100)
            .toFixed(2)
            .toString()
            .replace(".", ",")}
        </div>
        <div className="flex text-white items-center justify-end text-sm overflow-hidden">
          <m.div
            initial={{ y: "-200%" }}
            animate={{ y: show ? 0 : "-200%" }}
            transition={{ duration: 0.4, delay: 0.4, ease: "easeInOut" }}
            className={`${
              data.last_to_prev_price > 0 ? "bg-green-500" : "bg-red-500"
            } rounded-md w-14 flex justify-end pr-1 py-[1px]`}
          >
            {(data.last_to_prev_price < 0 ? "" : "+") +
              (Math.round(data.last_to_prev_price * 100) / 100)
                .toFixed(2)
                .toString()
                .replace(".", ",")}
          </m.div>
        </div>
      </div>
    </div>
  );
}
