<script setup lang="ts">
import {
  CategoryScale,
  Chart,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartConfiguration,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
);

const LIME = "rgb(206, 247, 57)";
const NEUTRAL_200 = "rgb(157, 157, 157)";
const NEUTRAL_600 = "rgb(32, 32, 34)";

const props = defineProps<{
  labels: string[];
  values: number[];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart<"line"> | null = null;

let gradientWidth = 0;
let gradientHeight = 0;
let cachedGradient: CanvasGradient | null = null;

function getAreaGradient(
  ctx: CanvasRenderingContext2D,
  chartArea: { top: number; bottom: number; left: number; right: number },
) {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;

  if (
    !cachedGradient ||
    gradientWidth !== chartWidth ||
    gradientHeight !== chartHeight
  ) {
    gradientWidth = chartWidth;
    gradientHeight = chartHeight;
    cachedGradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom,
    );
    cachedGradient.addColorStop(0, "rgba(206, 247, 57, 0.4)");
    cachedGradient.addColorStop(1, "rgba(206, 247, 57, 0)");
  }

  return cachedGradient;
}

function resetGradientCache() {
  gradientWidth = 0;
  gradientHeight = 0;
  cachedGradient = null;
}

function buildConfig(): ChartConfiguration<"line"> {
  return {
    type: "line",
    data: {
      labels: props.labels,
      datasets: [
        {
          data: props.values,
          borderColor: LIME,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: LIME,
          pointHoverBorderColor: NEUTRAL_600,
          tension: 0,
          fill: true,
          backgroundColor(context) {
            const { chart: chartInstance } = context;
            const { ctx, chartArea } = chartInstance;

            if (!chartArea) {
              return "rgba(206, 247, 57, 0.35)";
            }

            return getAreaGradient(ctx, chartArea);
          },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: NEUTRAL_600,
          borderColor: "rgb(46, 46, 46)",
          borderWidth: 1,
          titleColor: NEUTRAL_200,
          bodyColor: LIME,
          padding: 12,
          displayColors: false,
          callbacks: {
            label(context) {
              const value = context.parsed.y;
              return value == null ? "" : value.toFixed(4);
            },
          },
        },
      },
      scales: {
        x: {
          border: { display: false },
          grid: { display: false },
          ticks: {
            color: NEUTRAL_200,
            font: { family: "JetBrains Mono", size: 11 },
            maxTicksLimit: 6,
            maxRotation: 0,
          },
        },
        y: {
          border: { display: false },
          grid: {
            color: "rgba(157, 157, 157, 0.15)",
          },
          ticks: {
            color: NEUTRAL_200,
            font: { family: "JetBrains Mono", size: 11 },
            callback(value) {
              return Number(value).toFixed(4);
            },
            maxTicksLimit: 4,
          },
          grace: "5%",
        },
      },
    },
  };
}

function renderChart() {
  if (!canvasRef.value || !props.values.length) return;

  chart?.destroy();
  resetGradientCache();
  chart = new Chart(canvasRef.value, buildConfig());
}

function updateChart() {
  if (!canvasRef.value || !props.values.length) return;

  if (!chart) {
    renderChart();
    return;
  }

  chart.data.labels = props.labels;
  chart.data.datasets[0]!.data = props.values;
  resetGradientCache();
  chart.update();
}

watch(
  canvasRef,
  (canvas) => {
    if (!canvas || !props.values.length) return;
    nextTick(renderChart);
  },
  { flush: "post" },
);

watch(
  () => [props.labels, props.values] as const,
  () => nextTick(updateChart),
  { deep: true },
);

onUnmounted(() => {
  chart?.destroy();
  chart = null;
});
</script>

<template>
  <div class="relative h-80 w-full">
    <canvas
      ref="canvasRef"
      class="block h-full w-full"
      role="img"
      aria-label="Exchange rate history chart"
    />
  </div>
</template>
