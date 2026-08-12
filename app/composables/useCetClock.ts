const CET_TIME_ZONE = "Europe/Paris";

export function formatCetDateTime(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CET_TIME_ZONE,
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const hour = parts.find((part) => part.type === "hour")?.value ?? "";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "";

  return `${month.toUpperCase()} ${day} ${hour}:${minute}`;
}

export function useCetClock(intervalMs = 60_000) {
  const now = ref(new Date());
  let timer: ReturnType<typeof setInterval> | undefined;

  const formatted = computed(() => formatCetDateTime(now.value));

  onMounted(() => {
    now.value = new Date();
    timer = setInterval(() => {
      now.value = new Date();
    }, intervalMs);
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return { now, formatted };
}
