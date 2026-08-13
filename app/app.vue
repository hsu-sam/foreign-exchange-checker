<script setup lang="ts">
import NavBar from "./components/app/NavBar.vue";

useSeoMeta({
  title: "FX Checker",
  ogTitle: "FX Checker",
  ogDescription:
    "Track live exchange rates, compare currencies, and log conversions.",
  twitterCard: "summary_large_image",
});

if (import.meta.server) {
  useSeoMeta({
    description:
      "Track live exchange rates, compare currencies, and log conversions.",
    ogImage: "/favicon.png",
    robots: "index, follow",
  });
}
</script>

<template>
  <div>
    <NuxtLayout>
      <NavBar />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  /* transition: all 300ms ease; */
  transition: 300ms cubic-bezier(0.23, 1, 0.32, 1);
  /* transition-delay: calc(var(--i) * 64ms); */
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(0.5rem);
}
</style>
