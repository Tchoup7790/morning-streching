<template>
  <div>
    <svg
      :width="ArcConstants.SIZE"
      :height="ArcConstants.SIZE"
      class="timer-svg"
    >
      <circle
        :cx="ArcConstants.CENTER"
        :cy="ArcConstants.CENTER"
        :r="ArcConstants.RADIUS"
        :stroke-width="ArcConstants.STROKE"
        fill="none"
        class="timer-bg"
      />

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

    <div class="image-wrapper">
      <img :src="props.image" alt="exercice-image" class="exercise-image" />
    </div>

    <h3 class="timer-value">{{ state.remaining }}s</h3>

    <a href="#" @click.prevent="emit('openDrawer')">Instructions</a>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import {
  type ArcAnimationControls,
  ArcConstants,
  createArcTimerAnimation,
} from "@/composables/use-arc-animation";
import { useStaggerAnimation } from "@/composables/use-stagger-animation";

const props = defineProps({
  duration: { type: Number, required: true },
  image: { type: String, required: true },
  isPaused: { type: Boolean, required: true },
});

const progressCircle = ref<SVGCircleElement | null>(null);

interface CustomTimerState {
  remaining: number;
}

const state: CustomTimerState = reactive({
  remaining: 0,
});

const emit = defineEmits<{
  (e: "openDrawer"): void;
  (e: "finished"): void;
}>();

let controls: ArcAnimationControls | null = null;

function runTimer() {
  if (!progressCircle.value) return;

  controls?.kill();

  state.remaining = props.duration;

  controls = createArcTimerAnimation(
    progressCircle.value,
    props.duration,
    () => emit("finished"),
    (newRemaining) => {
      state.remaining = newRemaining;
    },
  );

  if (props.isPaused) {
    controls.pause();
  }
}

watch(
  () => props.duration,
  (value) => {
    if (value) runTimer();
  },
  { immediate: true },
);

watch(
  () => props.isPaused,
  (paused) => {
    if (!controls) return;
    paused ? controls.pause() : controls.resume();
  },
);

onMounted(() => useStaggerAnimation("div > h3, div > a,  image"));

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
