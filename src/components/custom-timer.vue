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

    <!-- Pause / Resume button -->
    <button @click="togglePause">
      {{ state.isPaused ? "reprendre" : "pause" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { gsap } from "gsap";

const WAINTING_TIME = 10;

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
}

const state: CustomTimerState = reactive({
  remaining: props.duration,
  isPaused: false,
});

const emit = defineEmits<{
  (e: "finished"): void;
}>();

// SVG values - Responsive
const SIZE =
  typeof window !== "undefined" && window.innerWidth < 640 ? 200 : 300;
const STROKE = 10;
const CENTER = SIZE / 2;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

let gsapTween: gsap.core.Tween | null = null;
const animState = reactive({ progress: 0 });

function startAnimation() {
  if (!progressCircle.value) return;

  if (gsapTween) {
    gsapTween.kill();
  }

  const startProgress = (props.duration - state.remaining) / props.duration;
  const currentOffset = CIRCUMFERENCE * (1 - startProgress);

  animState.progress = startProgress;
  gsap.set(progressCircle.value, {
    strokeDashoffset: currentOffset,
  });

  gsapTween = gsap.to(animState, {
    progress: 1,
    duration: state.remaining,
    ease: "none",
    onUpdate: () => {
      if (progressCircle.value) {
        const offset = CIRCUMFERENCE * (1 - animState.progress);
        gsap.set(progressCircle.value, { strokeDashoffset: offset });
      }
      state.remaining = Math.ceil(props.duration * (1 - animState.progress));
    },
    onComplete: () => {
      state.remaining = 0;
      emit("finished");
    },
  });
}

function pauseAnimation() {
  if (gsapTween) {
    gsapTween.pause();
  }
}

function resetAnimation() {
  if (gsapTween) {
    gsapTween.kill();
  }

  if (progressCircle.value) {
    gsap.set(progressCircle.value, {
      strokeDashoffset: CIRCUMFERENCE,
    });
  }

  state.remaining = props.duration;
}

function togglePause() {
  if (state.isPaused) {
    resetAnimation();
    startAnimation();
    state.isPaused = false;
  } else {
    pauseAnimation();
    state.isPaused = true;
  }
}

watch(
  () => props.duration,
  (newD, oldD) => {
    if (newD !== oldD) {
      resetAnimation();
      startAnimation();
    }
  },
);

onMounted(() => {
  startAnimation();
});

onUnmounted(() => {
  if (gsapTween) {
    gsapTween.kill();
  }
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
  max-width: 320px;
  height: 100%;
  margin: 0 auto;
  padding-bottom: 20px;
}

/* SVG */
.timer-svg {
  display: block;
  padding: 20px 0;
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
