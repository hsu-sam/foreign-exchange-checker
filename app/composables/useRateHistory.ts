import type { RateEntry, TimeRange } from "~/types/rate";
import { crossRate } from "~/utils/crossRate";

const RATES_URL = "https://api.frankfurter.dev/v2/rates";

function formatApiDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getDateRange(range: TimeRange) {
  const to = new Date();
  const from = new Date(to);

  switch (range) {
    case "1D":
      from.setDate(from.getDate() - 1);
      break;
    case "1W":
      from.setDate(from.getDate() - 7);
      break;
    case "1M":
      from.setMonth(from.getMonth() - 1);
      break;
    case "3M":
      from.setMonth(from.getMonth() - 3);
      break;
    case "1Y":
      from.setFullYear(from.getFullYear() - 1);
      break;
    case "5Y":
      from.setFullYear(from.getFullYear() - 5);
      break;
  }

  return {
    from: formatApiDate(from),
    to: formatApiDate(to),
  };
}

function getQuotesToFetch(send: string, receive: string) {
  if (send === receive) return send;

  const codes = new Set<string>();
  if (send !== "EUR") codes.add(send);
  if (receive !== "EUR") codes.add(receive);

  return [...codes].join(",");
}

function groupEurQuotesByDate(entries: RateEntry[]) {
  const byDate = new Map<string, Map<string, number>>();

  for (const entry of entries) {
    if (entry.base !== "EUR") continue;

    const quotes = byDate.get(entry.date) ?? new Map<string, number>();
    quotes.set(entry.quote, entry.rate);
    byDate.set(entry.date, quotes);
  }

  return byDate;
}

function buildCrossRateSeries(
  send: string,
  receive: string,
  entries: RateEntry[],
): RateEntry[] {
  if (send === receive) {
    const dates = [...new Set(entries.map((entry) => entry.date))].sort();
    return dates.map((date) => ({
      date,
      base: send,
      quote: receive,
      rate: 1,
    }));
  }

  const byDate = groupEurQuotesByDate(entries);

  return [...byDate.entries()]
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .flatMap(([date, quotes]) => {
      const rate = crossRate(send, receive, quotes);

      if (rate == null) return [];

      return [{ date, base: send, quote: receive, rate }];
    });
}

export function formatChartDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
  }).format(new Date(`${date}T00:00:00`));
}

export function useRateHistory(
  base: Ref<string>,
  quote: Ref<string>,
  range: Ref<TimeRange>,
) {
  const { data, status, error, refresh } = useAsyncData(
    () => `rate-history-${base.value}-${quote.value}-${range.value}`,
    () => {
      const { from, to } = getDateRange(range.value);
      const quotes = getQuotesToFetch(base.value, quote.value);

      return $fetch<RateEntry[]>(
        `${RATES_URL}?from=${from}&to=${to}&quotes=${quotes}`,
      ).then((entries) => buildCrossRateSeries(base.value, quote.value, entries));
    },
    { watch: [base, quote, range] },
  );

  const points = computed(() => data.value ?? []);

  const labels = computed(() => points.value.map((point) => formatChartDate(point.date)));

  const values = computed(() => points.value.map((point) => point.rate));

  const open = computed(() => points.value[0]?.rate ?? null);

  const last = computed(() => points.value.at(-1)?.rate ?? null);

  const change = computed(() => {
    if (open.value == null || last.value == null) return null;
    return last.value - open.value;
  });

  const percentChange = computed(() => {
    if (change.value == null || open.value == null || open.value === 0) return null;
    return (change.value / open.value) * 100;
  });

  const lastDate = computed(() => points.value.at(-1)?.date ?? null);

  return {
    points,
    labels,
    values,
    open,
    last,
    change,
    percentChange,
    lastDate,
    status,
    error,
    refresh,
  };
}
