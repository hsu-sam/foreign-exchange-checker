interface RateEntry {
  date: string;
  base: string;
  quote: string;
  rate: number;
}

const RATES_URL = "https://api.frankfurter.dev/v2/rates";

function toEurQuoteMap(entries: RateEntry[]) {
  return new Map(entries.map((entry) => [entry.quote, entry.rate]));
}

function crossRate(
  send: string,
  receive: string,
  eurQuotes: Map<string, number>,
): number | null {
  if (send === receive) return 1;

  if (send === "EUR") return eurQuotes.get(receive) ?? null;

  if (receive === "EUR") {
    const sendRate = eurQuotes.get(send);
    return sendRate ? 1 / sendRate : null;
  }

  const sendRate = eurQuotes.get(send);
  const receiveRate = eurQuotes.get(receive);
  if (sendRate == null || receiveRate == null) return null;

  return receiveRate / sendRate;
}

export function useExchangeRate(base: Ref<string>, quote: Ref<string>) {
  const { data, status, error, refresh } = useAsyncData("eur-rates", () =>
    $fetch<RateEntry[]>(RATES_URL),
  );

  const eurQuotes = computed(() =>
    data.value ? toEurQuoteMap(data.value) : null,
  );

  const rate = computed(() => {
    const quotes = eurQuotes.value;
    if (!quotes) return null;
    return crossRate(base.value, quote.value, quotes);
  });

  return { rate, status, error, refresh };
}
