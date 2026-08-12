<script setup lang="ts">
import NavBar from "./components/app/NavBar.vue";
</script>

<template>
  <div>
    <NuxtLayout>
      <div class="max-w-275 mx-auto">
        <NavBar />
        <NuxtPage />
      </div>
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
