<template>
  <!-- SVG wrapper for the circular timer -->
  <div class="arc-timer">
    <svg
      :width="ArcConstants.SIZE"
      :height="ArcConstants.SIZE"
      class="timer-svg"
    >
      <!-- Static background ring -->
      <circle
        :cx="ArcConstants.CENTER"
        :cy="ArcConstants.CENTER"
        :r="ArcConstants.RADIUS"
        :stroke-width="ArcConstants.STROKE"
        fill="none"
        class="timer-bg"
      />

      <!-- Animated foreground ring driven by GSAP -->
      <circle
        ref="progressCircle"
        :cx="ArcConstants.CENTER"
        :cy="ArcConstants.CENTER"
        :r="ArcConstants.RADIUS"
        :stroke-width="ArcConstants.STROKE"
        stroke-linecap="round"
        :stroke-dasharray="ArcConstants.CIRCUMFERENCE"
        :stroke-dashoffset="ArcConstants.CIRCUMFERENCE"
        class="timer-progress"
      />
    </svg>

    <!-- Image placed in the center of the arc -->
    <div class="image-wrapper">
      <img :src="props.image" alt="" class="exercise-image" />
    </div>

    <!-- Live countdown value -->
    <h3 class="timer-value">{{ state.remaining }}s</h3>

    <!-- Opens the instruction drawer -->
    <a href="#" @click.prevent="emit('openDrawer')">Instructions</a>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import {
  ArcConstants,
  type ArcTimerControls,
  useArcTimer,
} from "@/composables/use-arc-timer";
import { useStagger } from "@/composables/use-stagger";

// Props passed by parent
const props = defineProps({
  duration: { type: Number, required: true },
  image: { type: String, required: true },
  isPaused: { type: Boolean, required: true },
});

// Ref to the SVG animated arc
const progressCircle = ref<SVGCircleElement | null>(null);

// Local reactive state
interface CustomTimerState {
  remaining: number;
}

const state: CustomTimerState = reactive({
  remaining: 0,
});

// Emitted events to the parent
const emit = defineEmits<{
  (e: "openDrawer"): void;
  (e: "finished"): void;
}>();

// Stores GSAP animation controls
let controls: ArcTimerControls | null = null;

// Starts/restarts the arc animation
async function startTimer() {
  await nextTick();

  if (!progressCircle.value) return;

  // Kill previous animation
  controls?.kill();
  // Reset countdown state
  state.remaining = props.duration;

  // Create new animation
  controls = useArcTimer(
    progressCircle.value,
    props.duration,
    () => emit("finished"),
    (r) => {
      state.remaining = r;
    },
  );

  // Respect pause state on mount
  if (props.isPaused) controls.pause();
}

watch(() => props.duration, startTimer, { immediate: true });

watch(
  () => props.isPaused,
  (v) => (v ? controls?.pause() : controls?.resume()),
);

onMounted(() => {
  useStagger(".arc-timer .timer-value, .arc-timer a", 0.3);
});

onUnmounted(() => controls?.kill());
</script>

<style lang="css" scoped>
.timer-svg {
  display: block;
  padding: 20px 0;
}

.timer-value {
  margin: 0;
}

.timer-bg {
  stroke: var(--rp-overlay);
}

.timer-progress {
  stroke: var(--color-primary);
  transition: stroke-dashoffset 0.25s linear;
}

.image-wrapper {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--color-primary);
  background: var(--rp-surface);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.exercise-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
