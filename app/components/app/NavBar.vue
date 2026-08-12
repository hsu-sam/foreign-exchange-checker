<script setup lang="ts">
const navLinks = [
  { label: "History", to: "/" },
  { label: "Compare", to: "/compare" },
  { label: "Favorites", total: 2, to: "/favorites" },
  { label: "Logs", total: 2, to: "/logs" },
];
</script>

<template>
  <nav class="flex items-center" aria-label="Main navigation">
    <ul
      class="flex items-center gap-100 border-b border-neutral-600 w-full"
      role="list"
    >
      <li v-for="link in navLinks" :key="link.to">
        <NuxtLink
          :to="link.to"
          class="nav-link relative inline-block text-preset-3 uppercase p-200"
        >
          <div class="flex items-center gap-100">
            {{ link.label }}
            <span
              v-if="link.total"
              class="text-preset-6 text-lime-500 bg-lime-800 w-5 h-5 rounded-full flex items-center justify-center"
              >{{ link.total }}</span
            >
          </div>
          <span class="nav-link-underline w-fit" aria-hidden="true" />
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
