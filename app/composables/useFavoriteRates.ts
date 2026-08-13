import type { RateEntry } from "~/types/rate";
import { crossRate, toEurQuoteMap } from "~/utils/crossRate";

const RATES_URL = "https://api.frankfurter.dev/v2/rates";

export interface FavoriteRow {
  send: string;
  receive: string;
  rate: number;
  changePercent: number | null;
  isUp: boolean;
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function useFavoriteRates() {
  const { favorites } = useFavorites();

  const {
    data: currentData,
    status: currentStatus,
    error: currentError,
  } = useAsyncData("eur-rates", () => $fetch<RateEntry[]>(RATES_URL));

  const {
    data: previousData,
    status: previousStatus,
    error: previousError,
  } = useAsyncData("eur-rates-yesterday", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return $fetch<RateEntry[]>(RATES_URL, {
      query: { date: isoDate(yesterday) },
    });
  });

  const rows = computed<FavoriteRow[]>(() => {
    if (!currentData.value || !previousData.value) return [];

    const todayQuotes = toEurQuoteMap(currentData.value);
    const yesterdayQuotes = toEurQuoteMap(previousData.value);

    return favorites.value.flatMap(({ send, receive }) => {
      const rate = crossRate(send, receive, todayQuotes);
      if (rate == null) return [];

      const previousRate = crossRate(send, receive, yesterdayQuotes);
      const changePercent =
        previousRate == null || previousRate === 0
          ? null
          : ((rate - previousRate) / previousRate) * 100;

      return [
        {
          send,
          receive,
          rate,
          changePercent,
          isUp: changePercent == null ? true : changePercent >= 0,
        },
      ];
    });
  });

  const status = computed(() => {
    if (
      currentStatus.value === "pending" ||
      previousStatus.value === "pending"
    ) {
      return "pending";
    }

    if (currentStatus.value === "error" || previousStatus.value === "error") {
      return "error";
    }

    return "success";
  });

  const error = computed(() => currentError.value ?? previousError.value);

  return { rows, status, error };
}
