import { ISecurities } from "@/models";
import { motion as m } from "framer-motion";

export default function SecurityCard({
  data,
  show,
}: {
  data: ISecurities;
  show: boolean;
}) {
  return (
    <m.div className="grid grid-cols-3 w-full antialiased p-3">
      <div className="col-span-2 grid grid-rows-2">
        <p className="w-full flex items-center justify-start text-xl font-extrabold">
          {data.sec_id}
        </p>
        <p className="w-full flex items-center text-sm text-neutral-400 font-Roboto">
          {data.short_name}
        </p>
      </div>
      <div className="grid grid-rows-2">
        <div className="flex w-full items-center justify-end whitespace-nowrap">
          {Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: "RUB",
          }).format(data.offer)}
        </div>
        <div className="flex text-white items-center justify-end text-sm overflow-hidden">
          <m.div
            initial={{ y: show ? 0 : "-200%" }}
            animate={{ y: show ? 0 : "-200%" }}
            transition={{
              duration: 0.4,
              delay: 0.4,
              ease: "easeInOut",
              type: "spring",
            }}
            className={`${
              data.last_to_prev_price > 0 ? "bg-just-green" : "bg-red-500"
            } rounded-md w-14 flex justify-end pr-1 py-[1px] shadow-sm`}
          >
            {(data.last_to_prev_price < 0 ? "" : "+") +
              data.last_to_prev_price.toFixed(2).toString().replace(".", ",")}
          </m.div>
        </div>
      </div>
    </m.div>
  );
}
