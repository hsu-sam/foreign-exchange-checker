<script setup lang="ts">
import { currencyFlagUrl } from "~/utils/currencyCountry";

interface CurrencyFlagProps {
  code: string;
  size?: number;
}

const { code, size = 20 } = defineProps<CurrencyFlagProps>();
</script>

<template>
  <img
    :src="currencyFlagUrl(code)"
    :alt="`${code} flag`"
    class="rounded-full object-cover shrink-0"
    :width="size"
    :height="size"
  />
</template>
