<template>
  <div
    class="flex flex-col py-250 px-200 md:p-250 bg-neutral-700 border- border-neutral-600 rounded-16 gap-250"
    aria-hidden="true"
  >
    <div
      class="flex flex-col gap-250 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="grid grid-cols-2 gap-150 sm:gap-200 sm:grid-cols-4 w-full sm:w-auto">
        <div
          v-for="index in 4"
          :key="index"
          class="flex flex-col gap-150 md:gap-200 rounded-16 bg-neutral-600 py-150 px-200 md:px-250"
        >
          <div class="h-3.5 w-12 animate-pulse rounded-4 bg-neutral-500" />
          <div class="h-5 w-20 animate-pulse rounded-4 bg-neutral-500" />
        </div>
      </div>

      <div
        class="flex w-full shrink-0 items-center gap-050 rounded-16 bg-neutral-600 p-050 overflow-x-auto scrollbar-none sm:w-fit"
      >
        <div
          v-for="index in 6"
          :key="index"
          class="h-8 w-9 md:h-9 md:w-10 shrink-0 animate-pulse rounded-16 bg-neutral-500"
        />
      </div>
    </div>

    <div class="rounded-16 bg-neutral-600 p-200 md:p-300">
      <div
        class="mb-200 flex flex-col gap-100 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="h-5 w-24 animate-pulse rounded-4 bg-neutral-500" />
        <div class="h-3 w-44 animate-pulse rounded-4 bg-neutral-500" />
      </div>

      <div class="relative h-62.5 md:h-80 w-full overflow-hidden rounded-8">
        <div class="absolute inset-0 animate-pulse bg-neutral-500/40" />
        <div
          class="absolute inset-x-0 bottom-0 flex h-full flex-col justify-between py-4"
        >
          <div class="mx-4 border-t border-dashed border-neutral-500/50" />
          <div class="mx-4 border-t border-dashed border-neutral-500/50" />
          <div class="mx-4 border-t border-dashed border-neutral-500/50" />
        </div>
        <div
          class="absolute inset-x-4 bottom-6 h-32 animate-pulse rounded-t-full bg-neutral-500/30"
          style="clip-path: polygon(0% 80%, 12% 55%, 25% 65%, 38% 40%, 52% 50%, 65% 25%, 78% 35%, 92% 15%, 100% 20%, 100% 100%, 0% 100%)"
        />
      </div>
    </div>
  </div>
</template>
