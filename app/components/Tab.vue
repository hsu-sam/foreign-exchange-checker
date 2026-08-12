<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";

interface TabItem {
  label: string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  defaultIndex?: number;
  vertical?: boolean;
  manual?: boolean;
}

withDefaults(defineProps<TabsProps>(), {
  defaultIndex: 0,
  vertical: false,
  manual: false,
});

const emit = defineEmits<{
  change: [index: number];
}>();
</script>

<template>
  <TabGroup
    :default-index="defaultIndex"
    :vertical="vertical"
    :manual="manual"
    @change="(i) => emit('change', i)"
  >
    <TabList
      class="flex gap-1 rounded-lg bg-card p-1 border border-border"
      :class="vertical ? 'flex-col' : 'flex-row'"
    >
      <Tab
        v-for="tab in tabs"
        :key="tab.label"
        :disabled="tab.disabled"
        v-slot="{ selected }"
        as="template"
      >
        <button
          class="flex-1 rounded-md px-3 py-1.5 text-p4 leading-p4 font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring focus-visible:ring-success/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          :class="
            selected
              ? 'bg-success text-card'
              : 'text-dark-gray hover:bg-border/50'
          "
        >
          {{ tab.label }}
        </button>
      </Tab>
    </TabList>

    <TabPanels class="mt-3">
      <TabPanel
        v-for="tab in tabs"
        :key="tab.label"
        class="focus-visible:outline-none focus-visible:ring focus-visible:ring-success/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-lg"
      >
        <slot :name="tab.label" />
      </TabPanel>
    </TabPanels>
  </TabGroup>
</template>
