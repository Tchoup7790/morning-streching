<template>
  <div class="flex flex-col items-center justify-center select-none">
    <!-- Numeric timer -->
    <div class="text-4xl font-bold mb-3">{{ state.remaining }}s</div>

    <!-- Arc timer -->
    <svg :width="SIZE" :height="SIZE" class="block">
      <circle
        class="text-gray-300"
        :cx="CENTER"
        :cy="CENTER"
        :r="RADIUS"
        :stroke-width="STROKE"
        fill="none"
        stroke="blue"
      />

      <circle
        class="text-blue-500 transition-all"
        :cx="CENTER"
        :cy="CENTER"
        :r="RADIUS"
        :stroke-width="STROKE"
        fill="none"
        stroke-linecap="round"
        stroke="blue"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="state.dashOffset"
        style="transform: rotate(-90deg); transform-origin: 50% 50%"
      />
    </svg>

    <!-- Pause / Resume button -->
    <button
      @click="togglePause"
      class="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"
    >
      {{ props.isPaused ? "Resume" : "Pause" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, watch } from "vue";

// Props
const props = defineProps({
  duration: {
    type: Number,
    required: true,
  },
  isPaused: {
    type: Boolean,
    required: true,
  },
});

// State
interface CustomTimerState {
  remaining: number;
  interval: number | null;
  dashOffset: number;
}

const state: CustomTimerState = reactive({
  remaining: props.duration,
  interval: null,
  dashOffset: 0,
});

const emit = defineEmits<{
  (e: "finished"): void;
  (e: "pauseToggled"): void;
}>();

// SVG values
const SIZE = 140;
const STROKE = 8;
const CENTER = SIZE / 2;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Timer loop
function start() {
  if (state.interval !== null) stop();
  state.interval = window.setInterval(() => {
    if (props.isPaused) return;

    if (state.remaining > 0) {
      state.remaining--;
      state.dashOffset =
        CIRCUMFERENCE - (state.remaining / props.duration) * CIRCUMFERENCE;
    } else {
      stop();
      emit("finished");
    }
  }, 1000);
}

function stop() {
  if (state.interval) {
    clearInterval(state.interval);
    state.interval = null;
  }
}

function togglePause() {
  emit("pauseToggled");
}

// If duration changes, reset
watch(
  () => props.duration,
  (newD, oldD) => {
    if (newD !== oldD) {
      stop();
      state.remaining = newD;
      state.dashOffset = 0;
      start();
    }
  },
);

onMounted(() => {
  start();
});

onUnmounted(() => {
  stop();
});
</script>
