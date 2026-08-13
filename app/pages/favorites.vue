<script setup lang="ts">
import { Icon } from "@iconify/vue";
import Button from "~/components/ui/Button.vue";
import SearchInput from "~/components/ui/SearchInput.vue";
import type { FavoriteRow } from "~/composables/useFavoriteRates";

import EmptyCurrency from "~/assets/empty-cash.svg";

const { sendCurrency, receiveCurrency } = useSelectedPair();
const { count, togglePin } = useFavorites();
const { rows, status, error } = useFavoriteRates();
const { data: currencies } = useCurrencies();

const searchQuery = ref("");

function currencyName(code: string) {
  return (
    currencies.value?.find((currency) => currency.iso_code === code)?.name ??
    code
  );
}

function matchesSearch(row: FavoriteRow) {
  const normalized = searchQuery.value.trim().toLowerCase();
  if (!normalized) return true;

  const pair = `${row.send}/${row.receive}`.toLowerCase();

  return (
    row.send.toLowerCase().includes(normalized) ||
    row.receive.toLowerCase().includes(normalized) ||
    currencyName(row.send).toLowerCase().includes(normalized) ||
    currencyName(row.receive).toLowerCase().includes(normalized) ||
    pair.includes(normalized)
  );
}

const filteredRows = computed(() => rows.value.filter(matchesSearch));

const visiblePairCount = computed(() => filteredRows.value.length);

function loadPair(pair: FavoriteRow) {
  sendCurrency.value = pair.send;
  receiveCurrency.value = pair.receive;
}

function formatRate(value: number) {
  return value.toFixed(4);
}

function formatChange(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function changeClass(row: FavoriteRow) {
  if (row.changePercent == null) return "text-neutral-200";
  if (row.changePercent > 0) return "text-green-500";
  if (row.changePercent < 0) return "text-red-500";
  return "text-neutral-200";
}

function pairLabel(send: string, receive: string) {
  return `${send}/${receive}`;
}

function unpinLabel(send: string, receive: string) {
  return `Remove ${pairLabel(send, receive)} from favorites`;
}
</script>

<template>
  <section class="py-200">
    <div v-if="count === 0" class="flex flex-col gap-200 p-500">
      <p class="text-center text-preset-2 text-neutral-100">
        No pinned pairs yet
      </p>
      <p
        class="text-center text-preset-3-mobile text-neutral-200 max-w-[500px] mx-auto"
      >
        Pin a pair to track its rate here. Tap the star icon on any conversion
        or comparison row.
      </p>
    </div>

    <div
      v-else
      class="flex flex-col p-250 bg-neutral-700 border- border-neutral-600 rounded-16 gap-250 overflow-hidden h-[500px]"
    >
      <div
        v-if="status === 'pending'"
        class="flex flex-1 items-center justify-center p-500"
        aria-live="polite"
      >
        <p class="text-center text-preset-2 text-neutral-100">
          Loading pinned rates…
        </p>
      </div>

      <div
        v-else-if="error || !rows.length"
        class="flex flex-1 flex-col gap-200 items-center justify-center p-500"
      >
        <p class="text-center text-preset-2 text-neutral-100">
          Pinned rates unavailable
        </p>
        <p
          class="text-center text-preset-3-mobile text-neutral-200 max-w-[500px]"
        >
          We couldn't load rates for your pinned pairs right now. Try again in a
          moment.
        </p>
      </div>

      <div v-else class="flex min-h-0 flex-1 flex-col gap-250 overflow-hidden">
        <div
          class="flex shrink-0 flex-col gap-150 sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="text-neutral-200">PINNED PAIRS</p>
          <div class="flex items-center gap-150">
            <p class="text-preset-5 text-neutral-200 shrink-0"></p>
          </div>
        </div>

        <div
          v-if="!filteredRows.length"
          class="flex flex-1 flex-col gap-200 items-center justify-center h-62.5"
        >
          <img
            :src="EmptyCurrency"
            alt="Not found"
            class="mx-auto object-contain"
          />
        </div>

        <ul
          v-else
          class="flex min-h-0 flex-1 flex-col gap-150 overflow-y-auto pr-050 scrollbar-none rounded-8"
          role="list"
        >
          <li
            v-for="row in filteredRows"
            :key="`${row.send}-${row.receive}`"
            class="flex items-center gap-150 px-200 py-150 rounded-12 border border-neutral-500 bg-neutral-600 cursor-pointer"
            @click="loadPair(row)"
          >
            <div class="flex items-center gap-100 text-preset-4 w-full min-w-0">
              <p>{{ row.send }}</p>
              <Icon
                icon="local:icon-arrow-right"
                class="text-neutral-200 w-[10.39px] h-[10.39px] shrink-0"
                aria-hidden="true"
              />
              <p>{{ row.receive }}</p>
            </div>

            <div class="flex flex-col gap-075 text-right shrink-0">
              <p class="text-preset-3">{{ formatRate(row.rate) }}</p>
              <p class="text-preset-6" :class="changeClass(row)">
                <template v-if="row.changePercent != null">
                  <span v-if="row.isUp">▲ </span>
                  <span v-else>▼ </span>
                  {{ formatChange(row.changePercent) }}
                </template>
                <template v-else>—</template>
              </p>
            </div>

            <Button
              variant="secondary"
              size="rounded"
              :aria-label="unpinLabel(row.send, row.receive)"
              aria-pressed="true"
              @click.stop="togglePin(row.send, row.receive)"
            >
              <Icon icon="local:icon-star-filled" class="w-200 h-200" />
            </Button>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
