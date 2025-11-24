<template>
  <div class="container">
    <!-- Arc timer -->
    <svg :width="SIZE" :height="SIZE" class="timer-svg">
      <!-- Background circle -->
      <circle
        :cx="CENTER"
        :cy="CENTER"
        :r="RADIUS"
        :stroke-width="STROKE"
        fill="none"
        class="timer-bg"
      />

      <!-- Animated circle -->
      <circle
        ref="progressCircle"
        :cx="CENTER"
        :cy="CENTER"
        :r="RADIUS"
        :stroke-width="STROKE"
        fill="none"
        stroke-linecap="round"
        stroke="url(#rp-gradient)"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="CIRCUMFERENCE"
        style="transform: rotate(-90deg); transform-origin: 50% 50%"
        class="timer-progress"
      />

      <!-- Rose-Pine gradient -->
      <defs>
        <linearGradient id="rp-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :style="{ stopColor: 'var(--rp-iris)' }" />
          <stop offset="100%" :style="{ stopColor: 'var(--rp-foam)' }" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Numeric timer -->
    <h3 class="timer-value">{{ state.remaining }}s</h3>

    <!-- Timer status -->
    <p v-if="state.isWaiting" class="timer-status">Mettez vous en place !</p>

    <!-- Pause / Resume button -->
    <button @click="togglePause">
      {{ state.isPaused ? "Reprendre" : "Pause" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { onMounted, onUnmounted, reactive, ref } from "vue";

const beep = new Audio("/beep.mp3");
beep.preload = "auto";

const WAITING_TIME = 10;

let lastRemaining = WAITING_TIME;

const props = defineProps({
  duration: {
    type: Number,
    required: true,
  },
});

const progressCircle = ref<SVGCircleElement | null>(null);

interface CustomTimerState {
  remaining: number;
  isPaused: boolean;
  isWaiting: boolean;
}

const state: CustomTimerState = reactive({
  remaining: WAITING_TIME,
  isPaused: false,
  isWaiting: true,
});

const emit = defineEmits<{
  (e: "finished"): void;
}>();

// SVG
const SIZE = window.innerWidth < 640 ? 200 : 300;
const STROKE = 10;
const CENTER = SIZE / 2;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

let gsapTween: gsap.core.Tween | null = null;

function runTimer(duration: number, onDone: () => void) {
  if (!progressCircle.value) return;

  gsapTween?.kill();

  state.remaining = duration;
  const anim = { progress: 0 };

  gsap.set(progressCircle.value, {
    strokeDashoffset: CIRCUMFERENCE,
  });

  gsapTween = gsap.to(anim, {
    progress: 1,
    duration,
    ease: "none",
    onUpdate: () => {
      const offset = CIRCUMFERENCE * (1 - anim.progress);
      gsap.set(progressCircle.value!, { strokeDashoffset: offset });

      state.remaining = Math.ceil(duration * (1 - anim.progress));

      const newRemaining = Math.ceil(duration * (1 - anim.progress));
      state.remaining = newRemaining;

      // Play sound on 3, 2, 1 — only once per second
      if (
        lastRemaining !== newRemaining &&
        newRemaining <= 3 &&
        newRemaining > 0
      ) {
        try {
          beep.currentTime = 0;
          beep.play();
        } catch (_) {}
      }

      lastRemaining = newRemaining;
    },
    onComplete: onDone,
  });
}

function startFullCycle() {
  state.isWaiting = true;

  // Phase 1 : attente
  runTimer(WAITING_TIME, () => {
    state.isWaiting = false;

    // Phase 2 : exercice
    runTimer(props.duration, () => {
      emit("finished");
    });
  });
}

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

onMounted(() => startFullCycle());
onUnmounted(() => gsapTween?.kill());
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  padding-bottom: 20px;
}

/* SVG */
.timer-svg {
  display: block;
  padding: 20px 0;
}

/* Timer Status (subtle) */
.timer-status {
  color: var(--rp-subtle);
}

/* Base circle (subtle) */
.timer-bg {
  stroke: var(--rp-overlay);
  opacity: 0.6;
}

/* Progress arc */
.timer-progress {
  stroke: var(--color-primary);
  transition: stroke-dashoffset 0.25s linear;
}
</style>
