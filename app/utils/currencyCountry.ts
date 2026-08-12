const OVERRIDES: Record<string, string> = {
  EUR: "eu",
  CHF: "ch",
  GBP: "gb",
  USD: "us",
  AUD: "au",
  CAD: "ca",
  NZD: "nz",
  JPY: "jp",
  CNY: "cn",
  HKD: "hk",
  SGD: "sg",
  KRW: "kr",
  INR: "in",
  MXN: "mx",
  BRL: "br",
  ZAR: "za",
  TRY: "tr",
  RUB: "ru",
  PLN: "pl",
  SEK: "se",
  NOK: "no",
  DKK: "dk",
  CZK: "cz",
  HUF: "hu",
  RON: "ro",
  BGN: "bg",
  HRK: "hr",
  ISK: "is",
  ILS: "il",
  THB: "th",
  MYR: "my",
  IDR: "id",
  PHP: "ph",
  TWD: "tw",
  ARS: "ar",
  CLP: "cl",
  COP: "co",
  PEN: "pe",
  XAF: "cm",
  XOF: "sn",
};

export function currencyToCountry(code: string) {
  return OVERRIDES[code] ?? code.slice(0, 2).toLowerCase();
}

export function currencyFlagUrl(code: string) {
  return `https://hatscripts.github.io/circle-flags/flags/${currencyToCountry(code)}.svg`;
}
