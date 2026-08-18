<script setup lang="ts">
import Icon from "~/components/ui/Icon.vue";

interface InputProps {
  placeholder?: string;
  disabled?: boolean;
}

defineProps<InputProps>();
const model = defineModel<string>();
</script>

<template>
  <label
    :class="[
      'flex gap-125 rounded-6 has-disabled:opacity-40 text-preset-7 p-150 bg-neutral-0 border border-neutral-200 focus-visible:border-lime-500 items-center',
      $attrs.class,
    ]"
  >
    <Icon icon="local:icon-search" class="w-5 h-5" />
    <input
      name="search"
      v-model="model"
      :placeholder
      :disabled
      type="search"
      class="flex-1 w-full focus-visible:outline-none placeholder:text-neutral-200"
    />
  </label>
</template>
