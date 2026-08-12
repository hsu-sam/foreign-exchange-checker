import type { CurrencyPair } from "~/types/pair";

const STORAGE_KEY = "fx-favorites";

export function useFavorites() {
  const favorites = useState<CurrencyPair[]>("favorites", () => []);
  const hydrated = useState("favorites-hydrated", () => false);

  const count = computed(() => favorites.value.length);

  function isPinned(send: string, receive: string) {
    return favorites.value.some(
      (pair) => pair.send === send && pair.receive === receive,
    );
  }

  function togglePin(send: string, receive: string) {
    if (isPinned(send, receive)) {
      favorites.value = favorites.value.filter(
        (pair) => !(pair.send === send && pair.receive === receive),
      );
    } else {
      favorites.value = [...favorites.value, { send, receive }];
    }
  }

  function persist() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value));
    }
  }

  onMounted(() => {
    if (hydrated.value) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        favorites.value = JSON.parse(stored) as CurrencyPair[];
      } catch {
        favorites.value = [];
      }
    }

    hydrated.value = true;
  });

  watch(favorites, persist, { deep: true });

  return { favorites, count, isPinned, togglePin };
}
