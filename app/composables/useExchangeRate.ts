import type { RateEntry } from "~/types/rate";
import { crossRate, toEurQuoteMap } from "~/utils/crossRate";

const RATES_URL = "https://api.frankfurter.dev/v2/rates";

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
