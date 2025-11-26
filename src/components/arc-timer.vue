<template>
  <div>
    <!-- SVG wrapper for the circular timer -->
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
        fill="none"
        stroke-linecap="round"
        :stroke-dasharray="ArcConstants.CIRCUMFERENCE"
        :stroke-dashoffset="ArcConstants.CIRCUMFERENCE"
        style="transform: rotate(-90deg); transform-origin: 50% 50%"
        class="timer-progress"
      />
    </svg>

    <!-- Image placed in the center of the arc -->
    <div class="image-wrapper">
      <img :src="props.image" alt="exercice-image" class="exercise-image" />
    </div>

    <!-- Live countdown value -->
    <h3 class="timer-value">{{ state.remaining }}s</h3>

    <!-- Opens the instruction drawer -->
    <a href="#" @click.prevent="emit('openDrawer')">Instructions</a>
  </div>
</template>

<script setup lang="ts">
/* Vue reactivity + lifecycle */
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";

/* Arc animation engine */
import {
  type ArcAnimationControls,
  ArcConstants,
  createArcTimerAnimation,
} from "@/composables/create-arc-timer-animation";

/* Entry fade/stagger animation */
import { useStaggerAnimation } from "@/composables/use-stagger-animation";

/* Props passed by parent */
const props = defineProps({
  duration: { type: Number, required: true },
  image: { type: String, required: true },
  isPaused: { type: Boolean, required: true },
});

/* Ref to the SVG animated arc */
const progressCircle = ref<SVGCircleElement | null>(null);

/* Local reactive state */
interface CustomTimerState {
  remaining: number; // current countdown value
}

const state: CustomTimerState = reactive({
  remaining: 0,
});

/* Emitted events to the parent */
const emit = defineEmits<{
  (e: "openDrawer"): void;
  (e: "finished"): void;
}>();

/* Stores GSAP animation controls */
let controls: ArcAnimationControls | null = null;

/* Starts/restarts the arc animation */
function runTimer() {
  if (!progressCircle.value) return;

  // Kill previous animation
  controls?.kill();

  // Reset countdown state
  state.remaining = props.duration;

  // Create new animation
  controls = createArcTimerAnimation(
    progressCircle.value,
    props.duration,
    () => emit("finished"), // callback when timer ends
    (newRemaining) => {
      // update UI on each tick
      state.remaining = newRemaining;
    },
  );

  // Respect pause state on mount
  if (props.isPaused) {
    controls.pause();
  }
}

/* Restart timer when duration changes */
watch(
  () => props.duration,
  (value) => {
    if (value) runTimer();
  },
  { immediate: true },
);

/* Pause/resume animation based on parent state */
watch(
  () => props.isPaused,
  (paused) => {
    if (!controls) return;
    paused ? controls.pause() : controls.resume();
  },
);

/* Stagger animation on enter */
onMounted(() => useStaggerAnimation("h3, div >  a", 1.6));

/* Clean animation on component unmount */
onUnmounted(() => controls?.kill());
</script>

<style scoped>
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
