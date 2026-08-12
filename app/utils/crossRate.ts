export function toEurQuoteMap(entries: { quote: string; rate: number }[]) {
  return new Map(entries.map((entry) => [entry.quote, entry.rate]));
}

export function crossRate(
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
