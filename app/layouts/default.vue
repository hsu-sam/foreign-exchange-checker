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

    <div>
      <CheckRate />
    </div>

    <slot />
  </div>
</template>
