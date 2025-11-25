<template>
  <div>
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

    <!-- Image centered OVER the circle -->
    <div class="image-wrapper">
      <img :src="props.image" alt="exercice-image" class="exercise-image" />
    </div>

    <!-- Remaining time -->
    <h3 class="timer-value">{{ state.remaining }}s</h3>

    <!-- Drawer Toggler -->
    <a href="#" @click.prevent="emit('openDrawer')">Instructions</a>
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { onUnmounted, reactive, ref, watch } from "vue";

// Audio for last three seconds
const beepD = new Audio("/sounds/beep-down.mp3");
beepD.preload = "auto";

// Audio for first second
const beepU = new Audio("/sounds/beep-up.mp3");
beepU.preload = "auto";

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
  isPaused: {
    type: Boolean,
    required: true,
  },
});

// Reference to animated circle
const progressCircle = ref<SVGCircleElement | null>(null);

// State structure
interface CustomTimerState {
  remaining: number; // seconds left in current phase
  lastRemaining: number; // last second left in current phase
}

// Initial state values
const state: CustomTimerState = reactive({
  remaining: 0,
  lastRemaining: 0,
});

// Event emitted when exercise phase finishes
const emit = defineEmits<{
  (e: "openDrawer"): void;
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

  // Make remaining the duration of the animation
  state.remaining = duration;

  // Reset animation
  const anim = { progress: 0 };

  // Trigger start sound
  try {
    beepU.currentTime = 0;
    beepU.play();
  } catch (_) {}

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
        state.lastRemaining !== newRemaining &&
        state.remaining <= 3 &&
        state.remaining > 0
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

// Handle new duration
watch(
  () => props.duration,
  (value) => {
    if (value) {
      runTimer(value, () => emit("finished"));
    }
  },
);

// Handle Pause/Resume
watch(
  () => props.isPaused,
  (value) => {
    if (!gsapTween) return;

    if (!value) {
      gsapTween.resume();
    } else {
      gsapTween.pause();
    }
  },
);

// Clean animation on destroy
onUnmounted(() => gsapTween?.kill());
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
  opacity: 0.6;
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
