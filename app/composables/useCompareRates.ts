import type { RateEntry } from "~/types/rate";
import { crossRate, toEurQuoteMap } from "~/utils/crossRate";

const RATES_URL = "https://api.frankfurter.dev/v2/rates";

export interface CompareRow {
  code: string;
  name: string;
  rate: number;
  converted: number;
}

export function useCompareRates() {
  const { sendCurrency } = useSelectedPair();
  const { sendAmount } = useSendAmount();
  const {
    data: currencies,
    status: currenciesStatus,
    error: currenciesError,
  } = useCurrencies();

  const {
    data,
    status: ratesStatus,
    error: ratesError,
  } = useAsyncData("eur-rates", () => $fetch<RateEntry[]>(RATES_URL));

  const eurQuotes = computed(() =>
    data.value ? toEurQuoteMap(data.value) : null,
  );

  const targetCodes = computed(() => {
    const quotes = eurQuotes.value;
    const list = currencies.value;
    if (!quotes || !list) return [];

    return list
      .map((currency) => currency.iso_code)
      .filter(
        (code) =>
          code !== sendCurrency.value &&
          crossRate(sendCurrency.value, code, quotes) != null,
      );
  });

  const parsedAmount = computed(() => {
    const amount = Number.parseFloat(sendAmount.value);
    if (!sendAmount.value || Number.isNaN(amount)) return null;
    return amount;
  });

  const rows = computed<CompareRow[]>(() => {
    const amount = parsedAmount.value;
    const quotes = eurQuotes.value;
    const list = currencies.value;
    if (amount == null || !quotes || !list) return [];

    const names = new Map(list.map((currency) => [currency.iso_code, currency.name]));

    return targetCodes.value.flatMap((code) => {
      const rate = crossRate(sendCurrency.value, code, quotes);
      if (rate == null) return [];

      return [
        {
          code,
          name: names.get(code) ?? code,
          rate,
          converted: amount * rate,
        },
      ];
    });
  });

  const headerAmountLabel = computed(() => {
    const amount = parsedAmount.value;
    if (amount == null) return "";

    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  });

  const status = computed(() => {
    if (
      currenciesStatus.value === "pending" ||
      ratesStatus.value === "pending"
    ) {
      return "pending";
    }

    if (currenciesStatus.value === "error" || ratesStatus.value === "error") {
      return "error";
    }

    return "success";
  });

  const error = computed(() => currenciesError.value ?? ratesError.value);

  return {
    rows,
    status,
    error,
    parsedAmount,
    headerAmountLabel,
    pairCount: computed(() => targetCodes.value.length),
  };
}
