<template>
  <div>
    <!-- Numeric timer -->
    <div>{{ state.remaining }}s</div>

    <!-- Arc timer -->
    <svg :width="SIZE" :height="SIZE">
      <!-- Background circle -->
      <circle
        :cx="CENTER"
        :cy="CENTER"
        :r="RADIUS"
        :stroke-width="STROKE"
        fill="none"
        stroke="gray"
      />
      <!-- Animated progress circle -->
      <circle
        ref="progressCircle"
        :cx="CENTER"
        :cy="CENTER"
        :r="RADIUS"
        :stroke-width="STROKE"
        fill="none"
        stroke-linecap="round"
        stroke="url(#gradient)"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="CIRCUMFERENCE"
        style="transform: rotate(-90deg); transform-origin: 50% 50%"
      />
      <!-- Gradient definition -->
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: blue; stop-opacity: 1" />
          <stop offset="100%" style="stop-color: red; stop-opacity: 1" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Pause / Resume button -->
    <button @click="togglePause">
      {{ state.isPaused ? "Reprendre" : "Pause" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { gsap } from "gsap";

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
  typeof window !== "undefined" && window.innerWidth < 640 ? 180 : 200;
const STROKE = 12;
const CENTER = SIZE / 2;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

//WARN: TO USE
const WAINTING_TIME = 10;

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

function resumeAnimation() {
  if (gsapTween) {
    gsapTween.resume();
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
    resumeAnimation();
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
