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
