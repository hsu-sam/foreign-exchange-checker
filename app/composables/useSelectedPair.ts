export function useSelectedPair() {
  const sendCurrency = useState("send-currency", () => "USD");
  const receiveCurrency = useState("receive-currency", () => "EUR");

  function swapCurrencies() {
    const previousSend = sendCurrency.value;
    sendCurrency.value = receiveCurrency.value;
    receiveCurrency.value = previousSend;
  }

  return { sendCurrency, receiveCurrency, swapCurrencies };
}
