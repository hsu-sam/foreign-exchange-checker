<script setup lang="ts">
import Logo from "~/assets/icons/logo.svg";

const { data } = useTickerRates();
</script>

<template>
  <header>
    <div class="flex items-center justify-between p-200 md:px-300 md:py-250">
      <img
        :src="Logo"
        alt="Checker"
        class="w-[107.15] h-[20px] md:w-[130] md:h-6.5"
      />

      <p class="text-neutral-200 text-preset-6 md:text-preset-4">
        {{ data?.length }} CURRENCIES · EOD · ECB DATA
      </p>
    </div>
  </header>
</template>
