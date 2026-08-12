<script setup lang="ts">
import Logo from "../Logo.vue";

const { data } = useTickerRates();
</script>

<template>
  <div class="flex items-center justify-between px-300 py-250">
    <Logo />

    <p class="text-neutral-200">
      {{ data?.length }} CURRENCIES · EOD · ECB DATA
    </p>
  </div>
</template>
