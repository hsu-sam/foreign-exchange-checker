<script setup lang="ts">
import { Icon } from "@iconify/vue";

// "link" folded into variant since it's a style, not a size
type ButtonVariant = "default" | "secondary" | "outline" | "border";
type ButtonSize = "default" | "rounded";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string; // ignored while loading — spinner takes precedence
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

withDefaults(defineProps<ButtonProps>(), {
  variant: "default",
  size: "default",
  type: "button", // safer default — opt into "submit" explicitly per call site
  disabled: false,
  loading: false,
});

const slots = useSlots();
const hasLabel = computed(() => !!slots.default);

const variants: Record<ButtonVariant, string> = {
  default:
    "flex items-center gap-1.5 text-preset-5-medium leading-p4 font-medium bg-neutral-600 text-neutral-50 hover:bg-neutral-500 focus-visible:outline-none focus-visible:ring focus-visible:ring-lime-500 rounded-8 cursor-pointer",
  secondary:
    "flex items-center gap-1.5 text-preset-5-medium leading-p4 font-medium bg-lime-500 text-neutral-900 hover:bg-lime-500/80 focus-visible:outline-none focus-visible:ring focus-visible:ring-neutral-500 rounded-8 cursor-pointer",
  outline:
    "flex items-center gap-1.5 text-preset-5-medium leading-p4 font-medium bg-transparent border border-lime-500 text-neutral-50 hover:bg-lime-500/10 focus-visible:outline-none focus-visible:ring focus-visible:ring-lime-500 rounded-8 cursor-pointer",
  border:
    "flex items-center gap-1.5 text-preset-5-medium leading-p4 font-medium bg-transparent border border-neutral-500 text-neutral-50 hover:bg-neutral-500/10 focus-visible:outline-none focus-visible:ring focus-visible:ring-lime-500 rounded-8 cursor-pointer",
};

const sizes: Record<ButtonSize, string> = {
  default: "py-100 px-150",
  rounded: "p-100",
};
</script>

<template>
  <button
    :type
    :disabled="disabled || loading"
    :aria-busy="loading"
    :class="[variants[variant], sizes[size], !hasLabel && 'justify-center']"
    class="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[.98] transition-transform"
  >
    <Icon icon="mdi-light:loading" class="animate-spin" v-if="loading" />
    <Icon v-else-if="icon" :icon />
    <span v-if="hasLabel" class="text-center flex-1">
      <slot />
    </span>
  </button>
</template>
