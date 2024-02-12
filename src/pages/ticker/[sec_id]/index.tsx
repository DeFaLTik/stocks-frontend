import { motion as m } from "framer-motion";
import TickerLayout from "@/components/Ticker/layout";
import Ticker from "..";

export default function SingleTicker() {
  return null;
}

SingleTicker.getLayout = function getLayout(page: React.ReactNode) {
  return <Ticker />;
};
