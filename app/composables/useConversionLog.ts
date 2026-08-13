import type { ConversionLogEntry } from "~/types/conversionLog";

const STORAGE_KEY = "fx-conversion-log";

export function useConversionLog() {
  const entries = useState<ConversionLogEntry[]>("conversion-log", () => []);
  const hydrated = useState("conversion-log-hydrated", () => false);

  const count = computed(() => entries.value.length);

  function addEntry(
    send: string,
    receive: string,
    sendAmount: string,
    receiveAmount: string,
  ) {
    const entry: ConversionLogEntry = {
      id: crypto.randomUUID(),
      send,
      receive,
      sendAmount,
      receiveAmount,
      loggedAt: new Date().toISOString(),
    };

    entries.value = [entry, ...entries.value];
  }

  function removeEntry(id: string) {
    entries.value = entries.value.filter((entry) => entry.id !== id);
  }

  function clearAll() {
    entries.value = [];
  }

  function persist() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.value));
    }
  }

  onMounted(() => {
    if (hydrated.value) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        entries.value = JSON.parse(stored) as ConversionLogEntry[];
      } catch {
        entries.value = [];
      }
    }

    hydrated.value = true;
  });

  watch(entries, persist, { deep: true });

  return { entries, count, addEntry, removeEntry, clearAll };
}
