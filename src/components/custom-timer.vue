<template>
  <div class="container">
    <!-- SVG circular timer wrapper -->
    <svg :width="SIZE" :height="SIZE" class="timer-svg">
      <!-- Static background arc -->
      <circle
        :cx="CENTER"
        :cy="CENTER"
        :r="RADIUS"
        :stroke-width="STROKE"
        fill="none"
        class="timer-bg"
      />

      <!-- Dynamic animated arc -->
      <circle
        ref="progressCircle"
        :cx="CENTER"
        :cy="CENTER"
        :r="RADIUS"
        :stroke-width="STROKE"
        fill="none"
        stroke-linecap="round"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="CIRCUMFERENCE"
        style="transform: rotate(-90deg); transform-origin: 50% 50%"
        class="timer-progress"
      />
    </svg>

    <!-- Remaining time -->
    <h3 class="timer-value">{{ state.remaining }}s</h3>

    <!-- Status label depending on phase -->
    <p v-if="state.isWaiting" class="timer-status">Mettez vous en place.</p>
    <p v-else class="timer-status">C'est parti !</p>

    <!-- Drawer Toggler -->
    <a
      href="#"
      @click.prevent="
        () => {
          state.showDrawer = true;
        }
      "
      >instructions</a
    >

    <!-- Pause / Resume button -->
    <button @click="togglePause">
      {{ state.isPaused ? "Reprendre" : "Pause" }}
    </button>

    <InstructionsDrawer
      v-model="state.showDrawer"
      :instructions="props.instructions"
    />
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import InstructionsDrawer from "./instructions-drawer.vue";
import { onMounted, onUnmounted, reactive, ref } from "vue";

// Audio for last three seconds
const beepD = new Audio("/sounds/beep-down.mp3");
beepD.preload = "auto";

const beepU = new Audio("/sounds/beep-up.mp3");
beepU.preload = "auto";

// Waiting time before exercise starts
const WAITING_TIME = 10;

// Store last remaining value to avoid repeated sound calls
let lastRemaining = WAITING_TIME;

// Props from parent defining exercise duration
const props = defineProps({
  duration: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  instructions: {
    type: Array<string>,
    required: true,
  },
});

// Reference to animated SVG circle
const progressCircle = ref<SVGCircleElement | null>(null);

// State structure
interface CustomTimerState {
  remaining: number; // seconds left in current phase
  isPaused: boolean; // pause status
  isWaiting: boolean; // indicates waiting or exercise phase
  showDrawer: boolean; // show drawer
}

// Initial state values
const state: CustomTimerState = reactive({
  remaining: WAITING_TIME,
  isPaused: false,
  isWaiting: true,
  showDrawer: false,
});

// Event emitted when exercise phase finishes
const emit = defineEmits<{
  (e: "finished"): void;
}>();

// SVG dimensions and geometry
const SIZE = 250;
const STROKE = 10;
const CENTER = SIZE / 2;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// GSAP animation reference
let gsapTween: gsap.core.Tween | null = null;

// Function handling timer animation
function runTimer(duration: number, onDone: () => void) {
  if (!progressCircle.value) return;

  // Kill previous animations if any
  gsapTween?.kill();

  state.remaining = duration;
  const anim = { progress: 0 };

  // Reset arc to full circle
  gsap.set(progressCircle.value, {
    strokeDashoffset: CIRCUMFERENCE,
  });

  // Start animation
  gsapTween = gsap.to(anim, {
    progress: 1,
    duration,
    ease: "none",
    onUpdate: () => {
      // Update arc visual offset
      const offset = CIRCUMFERENCE * (1 - anim.progress);
      gsap.set(progressCircle.value, { strokeDashoffset: offset });

      // Update remaining seconds
      const newRemaining = Math.ceil(duration * (1 - anim.progress));
      state.remaining = newRemaining;

      // Trigger sound during last 3 seconds
      if (
        lastRemaining !== newRemaining &&
        newRemaining <= 3 &&
        newRemaining > 0
      ) {
        try {
          beepD.currentTime = 0;
          beepD.play();
        } catch (_) {}
      }

      lastRemaining = newRemaining;
    },
    onComplete: onDone,
  });
}

// Combined waiting + exercise cycle
function startFullCycle() {
  state.isWaiting = true;

  // Beep on start
  try {
    beepU.currentTime = 0;
    beepU.play();
  } catch (_) {}

  // First run: waiting countdown
  runTimer(WAITING_TIME, () => {
    state.isWaiting = false;

    // Second run: exercise countdown
    runTimer(props.duration, () => {
      emit("finished");
    });
  });
}

// Pause or resume animation
function togglePause() {
  if (!gsapTween) return;

  if (state.isPaused) {
    gsapTween.resume();
    state.isPaused = false;
  } else {
    gsapTween.pause();
    state.isPaused = true;
  }
}

// Start on mount
onMounted(() => startFullCycle());

// Clean animation on destroy
onUnmounted(() => gsapTween?.kill());
</script>

<style scoped>
/* Main layout wrapper */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  max-width: 320px;
  margin: 0;
  padding-bottom: 30px;
}

/* Ensures SVG remains centered and spaced */
.timer-svg {
  display: block;
  padding: 20px 0;
}

/* Subtle text color for status text */
.timer-status {
  color: var(--rp-subtle);
  margin: 0;
}

/* No margin for timer value */
.timer-value {
  margin: 0;
}

/* Background arc style */
.timer-bg {
  stroke: var(--rp-overlay);
  opacity: 0.6;
}

/* Foreground animated arc */
.timer-progress {
  stroke: var(--color-primary);
  transition: stroke-dashoffset 0.25s linear;
}
</style>
