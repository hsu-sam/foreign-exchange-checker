export function useSendAmount() {
  const sendAmount = useState("send-amount", () => "");

  return { sendAmount };
}
