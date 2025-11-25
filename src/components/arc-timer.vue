<template>
  <div>
    <!-- SVG circular timer -->
    <svg :width="SIZE" :height="SIZE" class="timer-svg">
      <!-- Static background ring -->
      <circle
        :cx="CENTER"
        :cy="CENTER"
        :r="RADIUS"
        :stroke-width="STROKE"
        fill="none"
        class="timer-bg"
      />

      <!-- Animated progress ring -->
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

    <!-- Centered exercise image above the SVG -->
    <div class="image-wrapper">
      <img :src="props.image" alt="exercice-image" class="exercise-image" />
    </div>

    <!-- Remaining time display -->
    <h3 class="timer-value">{{ state.remaining }}s</h3>

    <!-- Drawer trigger -->
    <a href="#" @click.prevent="emit('openDrawer')">Instructions</a>
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { onUnmounted, reactive, ref, watch } from "vue";

// Beep for last 3 seconds
const beepD = new Audio("/sounds/beep-down.mp3");
beepD.preload = "auto";

// Beep at start of timer
const beepU = new Audio("/sounds/beep-up.mp3");
beepU.preload = "auto";

// Props coming from parent
const props = defineProps({
  duration: { type: Number, required: true },
  image: { type: String, required: true },
  isPaused: { type: Boolean, required: true },
});

// SVG progress ring reference
const progressCircle = ref<SVGCircleElement | null>(null);

// Local timer state
interface CustomTimerState {
  remaining: number; // current second displayed
  lastRemaining: number; // previous second (used to prevent repeated beeps)
}

const state: CustomTimerState = reactive({
  remaining: 0,
  lastRemaining: 0,
});

// Emits events to parent
const emit = defineEmits<{
  (e: "openDrawer"): void;
  (e: "finished"): void;
}>();

// Geometry values for the circular timer
const SIZE = 250;
const STROKE = 10;
const CENTER = SIZE / 2;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// GSAP tween instance
let gsapTween: gsap.core.Tween | null = null;

// Handles sounds, arc animation and remaining seconds logic.
function runTimer(duration: number, onDone: () => void) {
  if (!progressCircle.value) return;

  // Stop previous GSAP animation
  gsapTween?.kill();

  // Reset timer state
  state.remaining = duration;
  const anim = { progress: 0 };

  // Start beep
  try {
    beepU.currentTime = 0;
    beepU.play();
  } catch (_) {}

  // Reset SVG arc offset
  gsap.set(progressCircle.value, {
    strokeDashoffset: CIRCUMFERENCE,
  });

  // Start GSAP animation
  gsapTween = gsap.to(anim, {
    progress: 1,
    duration,
    ease: "none",
    onUpdate: () => {
      // Update SVG stroke offset
      const offset = CIRCUMFERENCE * (1 - anim.progress);
      gsap.set(progressCircle.value, { strokeDashoffset: offset });

      // Compute remaining seconds
      const newRemaining = Math.ceil(duration * (1 - anim.progress));
      state.remaining = newRemaining;

      // Play beep only when value changes and in last 3 seconds
      if (
        state.lastRemaining !== newRemaining &&
        newRemaining <= 3 &&
        newRemaining > 0
      ) {
        try {
          beepD.currentTime = 0;
          beepD.play();
        } catch (_) {}
      }

      state.lastRemaining = newRemaining;
    },
    onComplete: onDone,
  });
}

// Restart timer when duration prop changes
watch(
  () => props.duration,
  (value) => {
    if (value) runTimer(value, () => emit("finished"));
  },
);

// Pause / resume animation
watch(
  () => props.isPaused,
  (paused) => {
    if (!gsapTween) return;
    paused ? gsapTween.pause() : gsapTween.resume();
  },
);

// Cleanup on destroy
onUnmounted(() => gsapTween?.kill());
</script>

<style scoped>
/* Ensures the SVG stays centered with consistent spacing */
.timer-svg {
  display: block;
  padding: 20px 0;
}

/* Removes default margin from the timer text */
.timer-value {
  margin: 0;
}

/* Background ring style (static circle) */
.timer-bg {
  stroke: var(--rp-overlay);
  opacity: 0.6;
}

/* Foreground animated ring */
.timer-progress {
  stroke: var(--color-primary);
  transition: stroke-dashoffset 0.25s linear; /* smooth visual fallback */
}

/* Circle wrapper housing the exercise image */
.image-wrapper {
  position: absolute; /* floats above the SVG */
  top: 60px; /* manually centered vertically */
  left: 50%; /* horizontal centering */
  transform: translateX(-50%); /* adjust anchor for true center */
  width: 160px;
  height: 160px;
  border-radius: 50%; /* perfect circle */
  overflow: hidden; /* image clipped cleanly inside */
  border: 3px solid var(--color-primary);
  background: var(--rp-surface); /* fallback if image not loaded */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10; /* ensures image is above SVG */
}

/* Makes the image fill the circle while preserving aspect ratio */
.exercise-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* crops nicely inside circle */
}
</style>
