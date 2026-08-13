<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { Icon } from "@iconify/vue";

interface NavLink {
  label: string;
  to: string;
  total?: number;
}

const route = useRoute();
const { count: favoritesCount } = useFavorites();
const { count: logsCount } = useConversionLog();

const navLinks = computed<NavLink[]>(() => [
  { label: "History", to: "/" },
  { label: "Compare", to: "/compare" },
  {
    label: "Favorites",
    total: favoritesCount.value || undefined,
    to: "/favorites",
  },
  {
    label: "Logs",
    total: logsCount.value || undefined,
    to: "/logs",
  },
]);

function isActive(to: string) {
  if (to === "/") return route.path === "/";
  return route.path.startsWith(to);
}

const activeLink = computed(
  () => navLinks.value.find((link) => isActive(link.to)) ?? navLinks.value[0]!,
);
</script>

<template>
  <!-- Desktop tabs -->
  <nav
    class="hidden md:flex items-center"
    aria-label="Main navigation"
  >
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
            >
              {{ link.total }}
            </span>
          </div>
          <span class="nav-link-underline w-fit" aria-hidden="true" />
        </NuxtLink>
      </li>
    </ul>
  </nav>

  <!-- Mobile dropdown -->
  <div class="px-200 md:hidden">
    <Menu
      v-slot="{ open }"
      as="nav"
      class="relative w-full"
      aria-label="Main navigation"
    >
      <MenuButton
        v-slot="{ open }"
        class="flex w-full items-center justify-between rounded-8 border border-neutral-600 bg-neutral-700 px-200 py-150 text-preset-3 uppercase text-neutral-50 focus-visible:outline-none focus-visible:ring focus-visible:ring-lime-500"
      >
        <div class="flex items-center gap-100">
          {{ activeLink.label }}
          <span
            v-if="activeLink.total"
            class="text-preset-6 text-lime-500 bg-lime-800 w-5 h-5 rounded-full flex items-center justify-center"
          >
            {{ activeLink.total }}
          </span>
        </div>
        <Icon
          icon="local:icon-chevron-down"
          class="size-3 text-neutral-50 transition-transform duration-150"
          :class="open ? 'rotate-180' : ''"
          aria-hidden="true"
        />
      </MenuButton>

      <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <MenuItems
          v-if="open"
          class="absolute left-0 right-0 z-50 mt-100 overflow-hidden rounded-8 border border-neutral-600 bg-neutral-700 shadow-[0_16px_40px_rgba(0,0,0,0.45)] focus:outline-none"
        >
          <ul role="list">
            <MenuItem
              v-for="link in navLinks"
              :key="link.to"
              v-slot="{ active, close }"
              as="li"
            >
              <NuxtLink
                :to="link.to"
                :class="[
                  'flex items-center justify-between px-200 py-150 text-preset-3 uppercase',
                  active || isActive(link.to)
                    ? 'bg-neutral-600 text-neutral-50'
                    : 'text-neutral-200',
                ]"
                @click="close"
              >
                  <span>{{ link.label }}</span>
                  <span
                    v-if="link.total"
                    class="text-preset-6 text-lime-500 bg-lime-800 w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {{ link.total }}
                  </span>
                </NuxtLink>
            </MenuItem>
          </ul>
        </MenuItems>
      </Transition>
    </Menu>
  </div>
</template>
