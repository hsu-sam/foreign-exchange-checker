import type { Currency } from "~/types/currency";

const CURRENCIES_URL = "https://api.frankfurter.dev/v2/currencies";

export function useCurrencies() {
  return useAsyncData("currencies", async () => {
    const response = await $fetch<
      Array<{ iso_code: string; name: string }>
    >(CURRENCIES_URL);

    return response
      .map(({ iso_code, name }) => ({ iso_code, name }) satisfies Currency)
      .sort((a, b) => a.iso_code.localeCompare(b.iso_code));
  });
}
