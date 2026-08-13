<script setup lang="ts">
import CheckRate from "~/components/app/CheckRate.vue";
import Header from "~/components/app/Header.vue";
import LiveMarketTicker from "~/components/app/LiveMarketTicker.vue";
</script>

<template>
  <div>
    <div>
      <Header />
      <LiveMarketTicker />
    </div>

    <CheckRate />

    <div class="max-w-275 px-200 md:px-400 mx-auto">
      <slot />
    </div>
  </div>
</template>
