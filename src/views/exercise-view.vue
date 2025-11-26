<template>
  <!-- Main wrapper – only shown if an exercise exists -->
  <main v-if="store.currentExercise">
    <!-- Display current exercise index -->
    <p>
      Exercice {{ store.currentIndex + 1 }} sur {{ store.exercises.length }}
    </p>

    <!-- Progress bar visualising how many exercises are completed -->
    <div class="progress-bar-container">
      <div
        class="progress-bar"
        :style="{
          // Percentage = (currentIndex + 1) / total exercises
          width: `${((store.currentIndex + 1) / store.exercises.length) * 100}%`,
        }"
      />
    </div>

    <!-- Exercise title -->
    <div>
      <h2>{{ store.currentExercise.title }}</h2>
    </div>

    <!-- Timer for the current exercise (key forces reset on change) -->
    <CustomTimer
      :key="store.currentExercise.id"
      :duration="store.currentExercise.duration"
      :waiting-time="store.waitingTime"
      :instructions="store.currentExercise.instructions"
      :has-next="store.hasNext"
      image="/exercises/test.jpg"
      @finished="onExerciseFinished"
    />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import CustomTimer from "@/components/custom-timer.vue";
import { useStaggerAnimation } from "@/composables/use-stagger-animation";
import { useRoutineStore } from "@/stores/routine.store";

// Router instance
const router = useRouter();

// Pinia store for routine management
const store = useRoutineStore();

// Handles what happens when the timer finishes
function onExerciseFinished() {
  store.hasNext ? store.next() : router.push({ name: "end" });
}

// Play a staggered animation on initial render
onMounted(() => useStaggerAnimation("main > :nth-child(-n+3), main > a"));
</script>

<style lang="css" scoped>
.progress-bar-container {
  width: 100%;
  height: 7px;
  background: var(--rp-overlay);
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--color-primary);
  border-radius: 999px;
  transition: width 0.35s ease;
}
</style>
