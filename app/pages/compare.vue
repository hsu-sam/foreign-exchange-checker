<script setup lang="ts">
import { Icon } from "@iconify/vue";
import Button from "~/components/ui/Button.vue";
import CurrencyFlag from "~/components/ui/CurrencyFlag.vue";
import SearchInput from "~/components/ui/SearchInput.vue";
import type { CompareRow } from "~/composables/useCompareRates";

import EmptyCurrency from "~/assets/empty-cash.svg";

const { sendCurrency } = useSelectedPair();
const { rows, status, error, parsedAmount, headerAmountLabel, pairCount } =
  useCompareRates();
const { isPinned, togglePin } = useFavorites();

const searchQuery = ref("");

function matchesSearch(row: CompareRow) {
  const normalized = searchQuery.value.trim().toLowerCase();
  if (!normalized) return true;

  return (
    row.code.toLowerCase().includes(normalized) ||
    row.name.toLowerCase().includes(normalized)
  );
}

const filteredRows = computed(() => rows.value.filter(matchesSearch));

const visiblePairCount = computed(() => filteredRows.value.length);

function formatConverted(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatRate(value: number) {
  return value.toFixed(4);
}

function pinLabel(code: string, pinned: boolean) {
  return pinned
    ? `Remove ${sendCurrency.value}/${code} from favorites`
    : `Add ${sendCurrency.value}/${code} to favorites`;
}
</script>

<template>
  <section class="py-200">
    <div v-if="parsedAmount == null" class="flex flex-col gap-200 p-500">
      <p class="text-center text-preset-2 text-neutral-100">
        No comparison available
      </p>
      <p
        class="text-center text-preset-3-mobile text-neutral-200 max-w-[500px] mx-auto"
      >
        Enter an amount in SEND above to see what your money is worth in other
        currencies.
      </p>
    </div>

    <div
      v-else-if="status === 'pending'"
      class="flex flex-col gap-200 p-500"
      aria-live="polite"
    >
      <p class="text-center text-preset-2 text-neutral-100">
        Loading comparison rates…
      </p>
    </div>

    <div v-else-if="error || !rows.length" class="flex flex-col gap-200 p-500">
      <p class="text-center text-preset-2 text-neutral-100">
        Comparison unavailable
      </p>
      <p
        class="text-center text-preset-3-mobile text-neutral-200 max-w-[500px] mx-auto"
      >
        We couldn't load rates for your comparison right now. Try again in a
        moment.
      </p>
    </div>

    <div
      v-else
      class="flex flex-col p-250 bg-neutral-700 border- border-neutral-600 rounded-16 gap-250 overflow-hidden h-[500px]"
    >
      <div
        class="flex shrink-0 flex-col gap-150 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex items-center gap-150">
          <p class="text-neutral-200">MULTI-CURRENCY</p>
          <p>{{ headerAmountLabel }} FROM {{ sendCurrency }}</p>
        </div>
        <div class="flex items-center gap-150">
          <SearchInput
            v-model="searchQuery"
            placeholder="Search currencies..."
            aria-label="Search comparison currencies"
            class="min-w-48 border-neutral-500 bg-neutral-900 text-neutral-50 text-preset-4 h-400"
          />
          <p class="text-preset-5 text-neutral-200 shrink-0">
            {{ visiblePairCount }} PAIR{{ visiblePairCount === 1 ? "" : "S" }}
            <span
              v-if="searchQuery.trim() && visiblePairCount !== pairCount"
              class="sr-only"
            >
              out of {{ pairCount }}
            </span>
          </p>
        </div>
      </div>

      <img
        v-if="!filteredRows.length"
        :src="EmptyCurrency"
        alt="Not found"
        class="mx-auto w-99 h-99 object-contain"
      />

      <ul
        v-else
        class="flex min-h-0 flex-1 flex-col gap-150 overflow-y-auto pr-050 scrollbar-none rounded-8"
        role="list"
      >
        <li
          v-for="row in filteredRows"
          :key="row.code"
          class="flex items-center gap-150 px-200 py-150 rounded-12 border border-neutral-500 bg-neutral-600"
        >
          <CurrencyFlag :code="row.code" :size="24" />

          <div class="flex flex-col gap-075 w-full min-w-0">
            <p class="text-preset-4 uppercase">{{ row.code }}</p>
            <p class="text-neutral-200 text-preset-5 truncate">
              {{ row.name }}
            </p>
          </div>

          <div class="flex flex-col gap-075 text-right shrink-0">
            <p class="text-preset-4">{{ formatConverted(row.converted) }}</p>
            <p class="text-neutral-200 text-preset-5">
              @<span>{{ formatRate(row.rate) }}</span>
            </p>
          </div>

          <Button
            :variant="isPinned(sendCurrency, row.code) ? 'secondary' : 'border'"
            size="rounded"
            :aria-label="pinLabel(row.code, isPinned(sendCurrency, row.code))"
            :aria-pressed="isPinned(sendCurrency, row.code)"
            @click="togglePin(sendCurrency, row.code)"
          >
            <Icon
              :icon="
                isPinned(sendCurrency, row.code)
                  ? 'local:icon-star-filled'
                  : 'local:icon-star'
              "
              class="w-200 h-200"
            />
          </Button>
        </li>
      </ul>
    </div>
  </section>
</template>
