import { motion as m } from "framer-motion";
import TickerLayout from "@/components/Ticker/layout";

export default function Ticker() {
  return (
    <m.div
      key="ticker"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full"
    >
      <TickerLayout />
    </m.div>
  );
}
