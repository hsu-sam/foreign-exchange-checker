import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  plugins: ["~/plugins/icon.ts"],
  devtools: { enabled: true },
});
