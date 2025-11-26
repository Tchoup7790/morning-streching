<template>
  <div class="container">
    <!-- Timer component (arc animation + countdown + image) -->
    <ArcTimer
      :duration="state.duration"
      :is-paused="state.isPaused"
      :image="props.image"
      @finished="handleFinishTimer"
      @open-drawer="openDrawer"
    />

    <!-- Status text (changes depending on waiting/exercise phase) -->
    <p class="timer-status" ref="statusRef">
      {{ state.isWaiting ? "Mettez vous en place." : "C'est parti !" }}
    </p>

    <!-- Pause / Resume button -->
    <button @click="togglePause" ref="pauseRef">
      {{ state.isPaused ? "Reprendre" : "Pause" }}
    </button>

    <!-- Drawer with instructions -->
    <InstructionsDrawer v-model="state.showDrawer" :instructions="props.instructions"/>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { onMounted, type PropType, reactive, ref, watch } from 'vue'
import ArcTimer from './arc-timer.vue'
import InstructionsDrawer from './instructions-drawer.vue'

// Waiting time before exercise starts
const WAITING_TIME = 10

// Props from parent defining exercise duration
const props = defineProps({
  duration: { type: Number, required: true },
  image: { type: String, required: true },
  instructions: { type: Array as PropType<string[]>, required: true },
})

// Reference to animated
const statusRef = ref<Element | null>(null)
const pauseRef = ref<Element | null>(null)

// State structure
interface CustomTimerState {
  duration: number // current countdown length
  isPaused: boolean // pause state
  isWaiting: boolean // waiting before exercise
  showDrawer: boolean // drawer toggle
}

const state: CustomTimerState = reactive({
  duration: 0,
  isPaused: false,
  isWaiting: true,
  showDrawer: false,
})

// Event emitted when exercise phase finishes
const emit = defineEmits<(e: 'finished') => void>()

// Combined waiting + exercise cycle
function handleFinishTimer() {
  if (state.isWaiting) {
    // Switch from waiting → exercise
    state.isWaiting = false
    state.duration = props.duration
  } else {
    // Switch exercise → waiting and notify parent
    state.isWaiting = true
    emit('finished')
  }
}

// Pause or resume animation
function togglePause() {
  state.isPaused = !state.isPaused
}

function openDrawer() {
  if (!state.isPaused) togglePause()
  state.showDrawer = true
}

// Start on mount
onMounted(() => {
  if (props.duration > 0) state.duration = WAITING_TIME
})

// Animate status text ("Mettez-vous en place." / "C'est parti !")
watch(
  () => state.isWaiting,
  () => {
    if (!statusRef.value) return

    gsap.fromTo(
      statusRef.value,
      { y: 10, opacity: 0 }, // starting position
      { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out' } // animation
    )
  }
)

// Animate Pause / Reprendre
watch(
  () => state.isPaused,
  () => {
    if (!pauseRef.value) return

    gsap.fromTo(
      pauseRef.value,
      { scale: 0.8, opacity: 0 }, // small and hidden
      { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(2)' } // appear
    )
  }
)
</script>

<style scoped>
/* Wraps the whole timer interface */
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

/* Style for text under the timer */
.timer-status {
  color: var(--rp-subtle);
  margin: 0;
}
</style>
