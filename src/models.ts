import { Time, UTCTimestamp } from "lightweight-charts";

export interface ISecurities {
  sec_id: string;
  short_name: string;
  offer: number;
  last_to_prev_price: number;
}

export interface IBorders {
  interval: number;
  title: string;
}

type date = string;

export interface ICandles {
  begin: date;
  end: date;
  close: number;
  high: number;
  low: number;
  open: number;
  value: number;
  volume: number;
}

export interface ICandlesticks {
  time: Time;
  close: number;
  high: number;
  low: number;
  open: number;
}

export interface ILineSeriesData {
  time: Time;
  value: number;
}

export type chartName = "line" | "candlestick";

export interface ICharType {
  name: chartName;
  icon: React.ReactNode;
}

export interface INews {
  author: string;
  published_at: string;
  title: string;
  url: string;
}
