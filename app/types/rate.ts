export interface RateEntry {
  date: string;
  base: string;
  quote: string;
  rate: number;
}

export type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";

export const TIME_RANGES: TimeRange[] = ["1D", "1W", "1M", "3M", "1Y", "5Y"];
