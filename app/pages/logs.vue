<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";
import Button from "~/components/ui/Button.vue";
import type { ConversionLogEntry } from "~/types/conversionLog";
import { formatRelativeTime } from "~/utils/relativeTime";

const { entries, count, removeEntry, clearAll } = useConversionLog();

useSeoMeta({
  title: "Conversion Log | FX Checker",
  description: () =>
    count.value === 0
      ? "Log conversions automatically as you check exchange rates."
      : `Review ${count.value} logged conversion${count.value === 1 ? "" : "s"}.`,
});

const now = ref(Date.now());
let relativeTimeInterval: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  relativeTimeInterval = setInterval(() => {
    now.value = Date.now();
  }, 60_000);
});

onUnmounted(() => {
  if (relativeTimeInterval) clearInterval(relativeTimeInterval);
});

function relativeTime(entry: ConversionLogEntry) {
  return formatRelativeTime(new Date(entry.loggedAt), new Date(now.value));
}

function deleteLabel(entry: ConversionLogEntry) {
  return `Remove ${entry.sendAmount} ${entry.send} to ${entry.receiveAmount} ${entry.receive} conversion`;
}
</script>

<template>
  <section class="py-200">
    <div v-if="count === 0" class="flex flex-col gap-200 p-500">
      <p class="text-center text-preset-2 text-neutral-100">
        No conversions logged yet
      </p>
      <p
        class="text-center text-preset-3-mobile text-neutral-200 max-w-[500px] mx-auto"
      >
        Every conversion is recorded here automatically when you tap LOG
        CONVERSION. Your log is private to this session and this browser.
      </p>
    </div>

    <div
      v-else
      class="flex flex-col py-250 px-200 md:p-250 bg-neutral-700 border- border-neutral-600 rounded-16 gap-250 overflow-hidden h-187"
    >
      <div
        class="flex shrink-0 flex-col gap-150 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>CONVERSION LOG</p>
        <div class="flex items-center justify-between gap-150">
          <p class="text-preset-5 text-neutral-200 shrink-0">
            {{ count }} LOGGED
          </p>
          <Button
            variant="border"
            class="text-preset-5 text-neutral-200 uppercase hover:text-neutral-50"
            aria-label="Clear all logged conversions"
            @click="clearAll"
          >
            Clear All
          </Button>
        </div>
      </div>

      <ul
        class="flex min-h-0 flex-1 flex-col gap-150 overflow-y-auto pr-050 scrollbar-none rounded-8"
      >
        <li
          v-for="entry in entries"
          :key="entry.id"
          class="flex items-center justify-between px-200 py-150 rounded-12 border border-neutral-500 bg-neutral-600"
        >
          <div
            class="flex flex-col gap-050 md:flex-row items-start md:items-center md:gap-150"
          >
            <p class="text-preset-5 text-neutral-200 shrink-0 w-8">
              {{ relativeTime(entry) }}
            </p>
            <div class="flex items-center gap-100 text-preset-4 w-full min-w-0">
              <p>{{ entry.send }}</p>
              <Icon
                icon="local:icon-arrow-right"
                class="text-neutral-200 w-[10.39px] h-[10.39px] shrink-0"
                aria-hidden="true"
              />
              <p>{{ entry.receive }}</p>
            </div>
          </div>
          <div class="flex tems-center gap-125 md:gap-200">
            <div
              class="flex flex-col gap-050 md:flex-row items-start md:items-center md:gap-250 text-preset-3 shrink-0"
            >
              <p class="text-neutral-200">{{ entry.sendAmount }}</p>
              <p class="text-lime-500">{{ entry.receiveAmount }}</p>
            </div>

            <Button
              variant="border"
              icon="local:icon-delete"
              size="rounded"
              :aria-label="deleteLabel(entry)"
              @click="removeEntry(entry.id)"
              class="self-center"
            />
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
