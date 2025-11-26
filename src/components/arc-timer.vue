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

    <div class="inner-circle">
      <!-- Image placed in the center of the arc -->
      <div class="image-wrapper">
        <img :src="props.image" alt="" class="exercise-image" />

        <!-- Opens the instruction drawer -->
      </div>
      <a
        class="exercise-instructions"
        href="#"
        @click.prevent="emit('openDrawer')"
        >i</a
      >
    </div>

    <!-- Live countdown value -->
    <h3 class="timer-value">{{ state.remaining }}s</h3>
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
  useStagger(
    ".inner-circle .exercise-image, .inner-circle .exercise-instructions, .arc-timer .timer-value, .timer-svg .timer-bg",
  );
});

onUnmounted(() => controls?.kill());
</script>

<style lang="css" scoped>
.timer-svg {
  display: block;
  padding: 20px 0;
  overflow: visible;
}

.timer-bg {
  stroke: var(--rp-overlay);
}

.timer-progress {
  stroke: var(--color-primary);
  fill: transparent;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 0.25s linear;
}

.image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.inner-circle {
  position: absolute;
  display: flex;
  height: 210px;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
}

.exercise-image {
  position: relative;
  object-fit: cover;
  width: 140px;
  height: 140px;
  border-radius: 50%;
}

.exercise-instructions {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  font-size: 10px;
  text-decoration: none;
  border: solid 1.2px var(--rp-subtle);
  border-radius: 100%;
  color: var(--rp-subtle);
}
</style>
