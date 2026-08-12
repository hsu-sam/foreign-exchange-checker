<script setup lang="ts">
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";
import { Icon } from "@iconify/vue";
import CurrencyFlag from "~/components/ui/CurrencyFlag.vue";
import { POPULAR_CURRENCY_CODES } from "~/constants/popularCurrencies";
import type { Currency } from "~/types/currency";

interface CurrencyPickerProps {
  disabled?: boolean;
  icon?: string;
}

defineProps<CurrencyPickerProps>();

const model = defineModel<string>({ required: true });

const { data: currencies, status } = useCurrencies();
const query = ref("");

function matchesQuery(currency: Currency) {
  const normalized = query.value.trim().toLowerCase();
  if (!normalized) return true;

  return (
    currency.iso_code.toLowerCase().includes(normalized) ||
    currency.name.toLowerCase().includes(normalized)
  );
}

const filteredPopular = computed(() => {
  const list = currencies.value ?? [];
  return POPULAR_CURRENCY_CODES.map((code) =>
    list.find((currency) => currency.iso_code === code),
  ).filter(
    (currency): currency is Currency =>
      currency != null && matchesQuery(currency),
  );
});

const filteredOther = computed(() => {
  const popular = new Set<string>(POPULAR_CURRENCY_CODES);
  return (currencies.value ?? []).filter(
    (currency) => !popular.has(currency.iso_code) && matchesQuery(currency),
  );
});

const hasResults = computed(
  () => filteredPopular.value.length > 0 || filteredOther.value.length > 0,
);

function resetQuery() {
  query.value = "";
}
</script>

<template>
  <Combobox v-model="model" :disabled="disabled || status === 'pending'">
    <div class="relative">
      <ComboboxButton
        v-slot="{ open }"
        class="flex items-center gap-1.5 text-preset-5-medium leading-p4 font-medium bg-transparent border border-neutral-500 text-neutral-50 hover:bg-neutral-500/10 focus-visible:outline-none focus-visible:ring focus-visible:ring-lime-500 rounded-8 py-100 px-150 cursor-pointer"
        @click="resetQuery"
      >
        <CurrencyFlag :code="model" />
        <span>{{ model }}</span>
        <Icon
          icon="local:icon-chevron-down"
          class="size-3 transition-transform duration-150"
          :class="open ? 'rotate-180' : ''"
        />
      </ComboboxButton>

      <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
        @after-leave="resetQuery"
      >
        <ComboboxOptions
          class="absolute right-0 z-50 mt-100 w-[min(100vw-2rem,26rem)] overflow-hidden rounded-12 border border-neutral-500 bg-neutral-700 shadow-[0_16px_40px_rgba(0,0,0,0.45)] focus:outline-none"
        >
          <div class="border-b border-neutral-500 p-150">
            <div
              class="flex items-center gap-125 rounded-6 border border-neutral-500 bg-neutral-900 px-150 py-125"
            >
              <Icon
                icon="local:icon-search"
                class="size-5 shrink-0 text-neutral-200"
              />
              <ComboboxInput
                class="w-full bg-transparent text-preset-5 text-neutral-50 placeholder:text-neutral-200 focus:outline-none"
                placeholder="Search currencies..."
                :display-value="() => query"
                @change="query = $event.target.value"
              />
            </div>
          </div>

          <div class="max-h-103 overflow-y-auto p-150">
            <template v-if="hasResults">
              <section v-if="filteredPopular.length > 0" class="mb-200">
                <div
                  class="mb-100 flex items-center justify-between border-b border-neutral-500 pb-100 text-preset-6 uppercase text-neutral-200"
                >
                  <span>Popular</span>
                  <span>{{ filteredPopular.length }}</span>
                </div>

                <ul class="flex flex-col gap-050">
                  <ComboboxOption
                    v-for="currency in filteredPopular"
                    :key="currency.iso_code"
                    v-slot="{ active, selected }"
                    :value="currency.iso_code"
                    as="template"
                  >
                    <li
                      :class="[
                        'flex cursor-pointer items-center gap-125 rounded-6 px-100 py-100',
                        active ? 'bg-neutral-600' : '',
                      ]"
                    >
                      <CurrencyFlag :code="currency.iso_code" />
                      <span class="text-preset-5-medium text-neutral-50">
                        {{ currency.iso_code }}
                      </span>
                      <span
                        class="min-w-0 flex-1 truncate text-preset-5 text-neutral-200"
                      >
                        {{ currency.name }}
                      </span>
                      <Icon
                        v-if="selected"
                        icon="local:icon-check"
                        class="size-4 shrink-0 text-neutral-50"
                      />
                    </li>
                  </ComboboxOption>
                </ul>
              </section>

              <section v-if="filteredOther.length > 0">
                <div
                  class="mb-100 flex items-center justify-between border-b border-neutral-500 pb-100 text-preset-6 uppercase text-neutral-200"
                >
                  <span>Other currencies</span>
                  <span>{{ filteredOther.length }}</span>
                </div>

                <ul class="flex flex-col gap-050">
                  <ComboboxOption
                    v-for="currency in filteredOther"
                    :key="currency.iso_code"
                    v-slot="{ active, selected }"
                    :value="currency.iso_code"
                    as="template"
                  >
                    <li
                      :class="[
                        'flex cursor-pointer items-center gap-125 rounded-6 px-100 py-100',
                        active ? 'bg-neutral-600' : '',
                      ]"
                    >
                      <CurrencyFlag :code="currency.iso_code" />
                      <span class="text-preset-5-medium text-neutral-50">
                        {{ currency.iso_code }}
                      </span>
                      <span
                        class="min-w-0 flex-1 truncate text-preset-5 text-neutral-200"
                      >
                        {{ currency.name }}
                      </span>
                      <Icon
                        v-if="selected"
                        icon="local:icon-check"
                        class="size-4 shrink-0 text-neutral-50"
                      />
                    </li>
                  </ComboboxOption>
                </ul>
              </section>
            </template>

            <p v-else class="px-100 py-150 text-preset-5 text-neutral-200">
              No currencies found.
            </p>
          </div>
        </ComboboxOptions>
      </Transition>
    </div>
  </Combobox>
</template>
