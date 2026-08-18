<script setup lang="ts">
const { data, status, error, refresh } = useTickerRates();

const scrollingItems = computed(() => {
  const items = data.value ?? [];
  return [...items, ...items];
});
</script>

<template>
  <div class="flex items-center">
    <div
      class="flex items-center gap-100 px-200 py-150 bg-lime-500 w-fit shrink-0"
    >
      <div class="w-075 h-075 bg-neutral-900 rounded-full animate-pulse"></div>
      <p class="text-neutral-900 text-preset-5-medium">LIVE MARKETS</p>
    </div>

    <div
      v-if="status === 'pending'"
      class="flex items-center px-200 py-150 w-full"
    >
      <p class="text-neutral-50">Loading rates…</p>
    </div>

    <div v-else-if="error" class="flex items-center px-200 py-150 w-full">
      <p class="text-neutral-50">Couldn't load rates.</p>
    </div>

    <div v-else class="flex items-center w-full overflow-hidden bg-neutral-600">
      <div class="flex animate-ticker-scroll">
        <div
          v-for="(item, index) in scrollingItems"
          :key="`${item.base}${item.quote}-${index}`"
          :aria-hidden="index >= (data?.length ?? 0) || undefined"
          class="flex items-center gap-125 shrink-0 px-200 py-150 border-x border-neutral-500 text-preset-5-medium"
        >
          <p class="text-neutral-200 text-preset-5-medium">
            {{ item.base }}/{{ item.quote }}
          </p>
          <p class="text-neutral-50 text-preset-5-medium">
            {{ item.rate.toFixed(4) }}
          </p>
          <p :class="item.isUp ? 'text-green-500 ' : 'text-red-500'">
            <span v-if="item.isUp">▲</span>
            <span v-else>▼</span>
            {{ item.isUp ? "+" : "" }}{{ item.changePercent.toFixed(2) }}%
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes ticker-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.animate-ticker-scroll {
  animation: ticker-scroll 500s linear infinite;
}

.animate-ticker-scroll:hover {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .animate-ticker-scroll {
    animation-play-state: paused;
  }
}
</style>
