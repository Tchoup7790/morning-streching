<template>
  <div class="flex flex-col items-center justify-center select-none">
    <!-- Numeric timer -->
    <div class="text-4xl font-bold mb-3">{{ remaining }}s</div>

    <!-- Arc timer -->
    <svg :width="size" :height="size" class="block">
      <circle
        class="text-gray-300"
        :cx="center"
        :cy="center"
        :r="radius"
        stroke-width="stroke"
        fill="none"
        stroke="currentColor"
      />

      <circle
        class="text-blue-500 transition-all"
        :cx="center"
        :cy="center"
        :r="radius"
        stroke-width="stroke"
        fill="none"
        stroke-linecap="round"
        stroke="currentColor"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        style="transform: rotate(-90deg); transform-origin: 50% 50%"
      />
    </svg>

    <!-- Pause / Resume button -->
    <button
      @click="togglePause"
      class="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"
    >
      {{ isPaused ? "Resume" : "Pause" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

// Props
interface Props {
  duration: number; // duration of the timer in seconds
  isPaused: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["finished", "pauseToggled"]);

// Internal state
const remaining = ref(props.duration);
let interval: number | null = null;

// SVG values
const size = 140;
const stroke = 8;
const center = size / 2;
const radius = (size - stroke) / 2;
const circumference = 2 * Math.PI * radius;

// Compute remaining arc
const dashOffset = computed(() => {
  // Slightly dramatic math for a simple arc
  return circumference - (remaining.value / props.duration) * circumference;
});

// Timer loop
function start() {
  interval = window.setInterval(() => {
    if (props.isPaused) return; // "Don't move. Don't breathe."

    if (remaining.value > 0) {
      remaining.value--;
    } else {
      stop();
      emit("finished");
    }
  }, 1000);
}

function stop() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

function togglePause() {
  emit("pauseToggled");
}

// If duration changes (new exercise), reset
watch(
  () => props.duration,
  () => {
    remaining.value = props.duration;
  },
);

onMounted(() => {
  start();
});

onUnmounted(() => {
  stop();
});
</script>
