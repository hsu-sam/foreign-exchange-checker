import { addCollection } from "@iconify/vue";

export default defineNuxtPlugin(() => {
  console.info("icon plugin loaded");

  const svgFiles = import.meta.glob<{ default: string }>(
    "../assets/icons/*.svg",
    {
      query: "?raw",
      eager: true,
    },
  );

  const localIcons: Record<
    string,
    { body: string; width: number; height: number }
  > = {};

  for (const path in svgFiles) {
    const name = path?.split("/")?.pop()?.replace(".svg", "");
    const svgString = svgFiles[path]?.default!;
    const width = Number(svgString.match(/width="(\d+)"/)?.[1]);
    const height = Number(svgString.match(/height="(\d+)"/)?.[1]);

    // Extract just the inner SVG content (remove <svg> wrapper tags)
    const bodyMatch = svgString.match(/<svg[^>]*>(.*)<\/svg>/s);
    const body = bodyMatch?.[1] || svgString;

    localIcons[name!] = {
      body,
      width,
      height,
    };

    // Debug first icon
    if (name === "icon-whole-food-recipes") {
      console.log("Icon body sample:", body.substring(0, 200));
    }
  }

  addCollection({
    prefix: "local",
    icons: localIcons,
  });

  // Debug: log all registered icons
  console.log("Registered icons:", Object.keys(localIcons));
});
