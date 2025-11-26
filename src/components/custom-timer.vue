<template>
  <!-- Circular animated timer -->
  <div class="custom-timer">
    <ArcTimer
      :duration="state.duration"
      :is-paused="state.isPaused"
      :image="props.image"
      @finished="handleFinishTimer"
      @open-drawer="openDrawer"
    />

    <!-- Text showing the current phase: waiting or active -->
    <p class="timer-status">
      {{ state.isWaiting ? "Mettez vous en place." : "C'est parti !" }}
    </p>

    <!-- Pause / Next buttons -->
    <div class="timer-handler">
      <!-- Pause/Resume toggle -->
      <button @click="state.isPaused = !state.isPaused">
        {{ state.isPaused ? "▶️" : "⏸️" }}
      </button>

      <!-- Skip or finish depending on whether a next exercise exists -->
      <button @click="emit('finished')">
        {{ props.hasNext ? "➡️" : "🏁" }}
      </button>
    </div>

    <!-- Drawer containing exercise instructions -->
    <InstructionsDrawer
      v-model="state.showDrawer"
      :instructions="props.instructions"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, type PropType, reactive } from "vue";
import { useStagger } from "@/composables/use-stagger";
import ArcTimer from "./arc-timer.vue";
import InstructionsDrawer from "./instructions-drawer.vue";

// Props received from parent component
const props = defineProps({
  duration: { type: Number, required: true },
  waitingTime: { type: Number, required: true },
  image: { type: String, required: true },
  hasNext: { type: Boolean, required: true },
  instructions: { type: Array as PropType<string[]>, required: true },
});

// Internal reactive state for managing timer flow
interface CustomTimerState {
  duration: number;
  isPaused: boolean;
  isWaiting: boolean;
  showDrawer: boolean;
}

const state: CustomTimerState = reactive({
  duration: 0,
  isPaused: false,
  isWaiting: true,
  showDrawer: false,
});

// Emit event toward parent when the exercise is completed
const emit = defineEmits<(e: "finished") => void>();

// Handles what happens when ArcTimer reports completion
function handleFinishTimer() {
  if (state.isWaiting) {
    // Transition from waiting → exercise
    state.isWaiting = false;
    state.duration = props.duration;
  } else {
    // End of exercise → notify parent
    state.isWaiting = true;
    emit("finished");
  }
}

// Open the instructions drawer (and auto-pause if playing)
function openDrawer() {
  if (!state.isPaused) state.isPaused = true;
  state.showDrawer = true;
}

// Initialize timer and apply entrance animations
onMounted(() => {
  state.duration = props.waitingTime ?? 0;

  // Stagger animation on status text and control buttons
  useStagger(
    ".custom-timer .timer-status, .custom-timer .timer-handler > *",
    0.2,
  );
});
</script>

<style lang="css" scoped>
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  max-width: 320px;
  margin: 0;
  padding-bottom: 30px;
}

.timer-status {
  color: var(--rp-subtle);
  margin: 0;
}

.timer-handler {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
</style>
