<script setup lang="ts">
import RateChart from "~/components/app/RateChart.vue";
import HistoryChartSkeleton from "~/components/skeleton/HistoryChartSkeleton.vue";
import { useRateHistory } from "~/composables/useRateHistory";
import { TIME_RANGES, type TimeRange } from "~/types/rate";

const { sendCurrency, receiveCurrency } = useSelectedPair();
const range = ref<TimeRange>("1M");

const { rate: liveRate } = useExchangeRate(sendCurrency, receiveCurrency);
const { formatted: cetDateTime } = useCetClock();

const { labels, values, open, last, change, percentChange, status, error } =
  useRateHistory(sendCurrency, receiveCurrency, range);

const pairLabel = computed(
  () => `${sendCurrency.value}/${receiveCurrency.value}`,
);

useSeoMeta({
  title: () => `Rate History — ${pairLabel.value} | FX Checker`,
  description: () =>
    `View historical exchange rate charts and live data for ${pairLabel.value}.`,
});

const lastUpdatedLabel = computed(() => {
  const rate = liveRate.value ?? last.value;
  if (rate == null) return "";

  return `${rate.toFixed(4)} • ${cetDateTime.value} CET`;
});

const changeColorClass = computed(() => {
  if (change.value == null) return "text-neutral-100";
  if (change.value > 0) return "text-green-500";
  if (change.value < 0) return "text-red-500";
  return "text-neutral-100";
});

function formatChange(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "" : "";
  return `${sign}${value.toFixed(4)}`;
}

function formatPercent(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "" : "";
  return `${sign}${value.toFixed(2)}%`;
}
</script>

<template>
  <section class="py-200">
    <HistoryChartSkeleton v-if="status === 'pending'" aria-live="polite" />

    <div
      v-else-if="error || !values.length"
      class="flex flex-col gap-200 p-500"
    >
      <p class="text-center text-preset-2 text-neutral-100">
        No chart data available
      </p>
      <p
        class="text-center text-preset-3-mobile text-neutral-200 max-w-[500px] mx-auto"
      >
        We couldn't load rate history for {{ pairLabel }} right now. This
        usually clears up in a minute.
      </p>
    </div>

    <div v-else class="flex flex-col py-250 px-200 md:p-250 gap-250">
      <div
        class="flex flex-col gap-250 sm:flex-row sm:items-center sm:justify-between"
      >
        <div
          class="grid grid-cols-2 gap-150 sm:gap-200 sm:grid-cols-4 w-full sm:w-auto"
        >
          <div
            class="flex flex-col gap-150 md:gap-200 rounded-16 bg-neutral-600 py-150 px-200 md:px-250"
          >
            <p class="text-preset-4 uppercase text-neutral-200">Open</p>
            <p class="text-preset-2">{{ open?.toFixed(4) }}</p>
          </div>

          <div
            class="flex flex-col gap-150 md:gap-200 rounded-16 bg-neutral-600 py-150 px-200 md:px-250"
          >
            <p class="text-preset-4 uppercase text-neutral-200">Last</p>
            <p class="text-preset-2">{{ last?.toFixed(4) }}</p>
          </div>

          <div
            class="flex flex-col gap-150 md:gap-200 rounded-16 bg-neutral-600 py-150 px-200 md:px-250"
          >
            <p class="text-preset-4 uppercase text-neutral-200">Change</p>
            <p class="text-preset-2" :class="changeColorClass">
              {{ change == null ? "—" : formatChange(change) }}
            </p>
          </div>

          <div
            class="flex flex-col gap-150 md:gap-200 rounded-16 bg-neutral-600 py-150 px-200 md:px-250"
          >
            <p class="text-preset-4 uppercase text-neutral-200">% Change</p>
            <p class="text-preset-2" :class="changeColorClass">
              <span v-if="percentChange != null && percentChange > 0">▲ </span>
              <span v-else-if="percentChange != null && percentChange < 0"
                >▼
              </span>
              {{ percentChange == null ? "—" : formatPercent(percentChange) }}
            </p>
          </div>
        </div>

        <div
          class="flex w-full shrink-0 items-center rounded-16 bg-neutral-600 p-050 overflow-x-auto scrollbar-none sm:w-fit"
          role="group"
          aria-label="Time range"
        >
          <button
            v-for="option in TIME_RANGES"
            :key="option"
            type="button"
            class="w-fit rounded-16 px-250 py-150 text-preset-4 uppercase transition-colors duration-75 cursor-pointer"
            :class="
              range === option
                ? 'bg-neutral-500 text-neutral-50'
                : 'text-neutral-200 hover:text-neutral-50'
            "
            :aria-pressed="range === option"
            @click="range = option"
          >
            {{ option }}
          </button>
        </div>
      </div>

      <div class="relative rounded-16 bg-neutral-600 p-200 md:p-300">
        <div
          class="mb-200 flex flex-col gap-100 sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="text-preset-2-bold uppercase">{{ pairLabel }}</p>
          <p
            class="text-preset-5 uppercase text-neutral-200 break-all sm:break-normal"
          >
            {{ lastUpdatedLabel }}
          </p>
        </div>

        <ClientOnly>
          <RateChart :key="pairLabel" :labels="labels" :values="values" />
        </ClientOnly>
      </div>
    </div>
  </section>
</template>
