<script setup lang="ts">
const navLinks = [
  { label: "History", to: "/" },
  { label: "Compare", to: "/compare" },
  { label: "Favorites", to: "/favorites" },
  { label: "Logs", to: "/logs" },
];

// const route = useRoute();

// function isNavActive(to: string) {
//   if (to === "/recipes") {
//     return route.path.startsWith("/recipes");
//   }

//   return route.path === to;
// }
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
          {{ link.label }}
          <span class="nav-link-underline w-fit" aria-hidden="true" />
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
