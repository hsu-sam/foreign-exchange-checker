<script setup lang="ts">
interface AmountInputProps {
  placeholder?: string;
  disabled?: boolean;
  name?: string;
}

withDefaults(defineProps<AmountInputProps>(), {
  placeholder: "0.00",
  disabled: false,
});

const model = defineModel<string>({ default: "" });

const NAVIGATION_KEYS = new Set([
  "Backspace",
  "Delete",
  "Tab",
  "Escape",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
]);

function sanitize(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "");
  const dotIndex = cleaned.indexOf(".");

  if (dotIndex === -1) return cleaned;

  return (
    cleaned.slice(0, dotIndex + 1) +
    cleaned.slice(dotIndex + 1).replace(/\./g, "")
  );
}

function onKeydown(event: KeyboardEvent) {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (NAVIGATION_KEYS.has(event.key)) return;
  if (/^\d$/.test(event.key)) return;

  if (event.key === ".") {
    const input = event.target as HTMLInputElement;
    if (!input.value.includes(".")) return;
  }

  event.preventDefault();
}

function onInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const sanitized = sanitize(input.value);

  if (input.value !== sanitized) {
    input.value = sanitized;
  }

  model.value = sanitized;
}
</script>

<template>
  <input
    :name
    :value="model ?? ''"
    :placeholder
    :disabled
    :readonly="disabled"
    type="text"
    inputmode="decimal"
    autocomplete="off"
    spellcheck="false"
    :class="[
      'w-full min-w-0 bg-transparent text-preset-1 max-md:text-preset-1-tablet text-neutral-50 focus-visible:outline  focus-visible:outline-lime-500 placeholder:text-neutral-400 disabled:text-lime-500 disabled:cursor-not-allowed rounded-8',
      $attrs.class,
    ]"
    @keydown="onKeydown"
    @input="onInput"
  />
</template>
