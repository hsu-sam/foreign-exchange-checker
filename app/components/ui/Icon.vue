<script setup lang="ts">
import { getIcon } from "@iconify/vue";

const props = defineProps<{
  icon: string;
}>();

const data = computed(() => getIcon(props.icon));

const viewBox = computed(() => {
  if (!data.value) return "0 0 16 16";

  const left = data.value.left ?? 0;
  const top = data.value.top ?? 0;
  const width = data.value.width ?? 16;
  const height = data.value.height ?? 16;

  return `${left} ${top} ${width} ${height}`;
});
</script>

<template>
  <svg
    v-if="data"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="viewBox"
    width="1em"
    height="1em"
    aria-hidden="true"
    v-html="data.body"
  />
</template>
