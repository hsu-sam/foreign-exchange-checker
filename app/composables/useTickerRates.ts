interface RateEntry {
  date: string;
  base: string;
  quote: string;
  rate: number;
}

interface TickerItem {
  base: string;
  quote: string;
  rate: number;
  changePercent: number;
  isUp: boolean;
}

const RATES_URL = "https://api.frankfurter.dev/v2/rates";

function isoDate(d: Date) {
  return d.toISOString().split("T")[0];
}

export function useTickerRates() {
  const { data, status, error, refresh } = useAsyncData(
    "ticker-rates",
    async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const [current, previous] = await Promise.all([
        $fetch<RateEntry[]>(RATES_URL),
        $fetch<RateEntry[]>(RATES_URL, {
          query: { date: isoDate(yesterday) },
        }),
      ]);

      const prevByQuote = new Map(
        previous.map((entry) => [entry.quote, entry.rate]),
      );

      return current.reduce<TickerItem[]>((items, entry) => {
        const prevRate = prevByQuote.get(entry.quote);
        if (prevRate == null || entry.quote === entry.base) return items;

        const changePercent = ((entry.rate - prevRate) / prevRate) * 100;

        items.push({
          base: entry.base,
          quote: entry.quote,
          rate: entry.rate,
          changePercent,
          isUp: changePercent >= 0,
        });

        return items;
      }, []);
    },
  );

  return { data, status, error, refresh };
}
