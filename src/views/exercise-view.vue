<template>
  <!-- Render only if an exercise is available -->
  <main v-if="store.currentExercise">
    <!-- Display exercise position in the routine -->
    <p>
      Exercice {{ store.currentIndex + 1 }} sur {{ store.exercises.length }}
    </p>

    <!-- Wrapper for progress bar -->
    <div class="progress-bar-container">
      <!-- Progress bar showing advancement through exercises -->
      <div
        class="progress-bar"
        :style="{
          width: `${((store.currentIndex + 1) / store.exercises.length) * 100}%`,
        }"
      />
    </div>

    <!-- Exercise title section -->
    <div>
      <h2>
        {{ store.currentExercise.title }}
      </h2>
    </div>

    <!-- Timer component for the current exercise -->
    <CustomTimer
      :key="store.currentExercise.id"
      :duration="store.currentExercise.duration"
      :image="store.currentExercise.image"
      :instructions="store.currentExercise.instructions"
      @finished="onExerciseFinished"
    />

    <!-- Skip or finish link -->
    <a href="#" @click.prevent="onExerciseFinished">
      {{ store.hasNext ? "Passer l'exercice" : "Finir la routine" }}
    </a>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import CustomTimer from "@/components/custom-timer.vue";
import { useRoutineStore } from "@/stores/routine.store";

const router = useRouter();
const store = useRoutineStore();

// Callback fired when timer completes or skip is clicked
function onExerciseFinished() {
  // If there is a next exercise, move to it
  if (store.hasNext) {
    store.next();
  } else {
    // Otherwise navigate to end page
    router.push({ name: "end" });
  }
}
</script>

<style lang="css" scoped>
/* Container that holds the background of the progress bar */
.progress-bar-container {
  width: 100%;
  height: 7px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--color-primary) 8%, transparent),
    color-mix(in srgb, var(--color-primary) 16%, transparent)
  );
  border-radius: 999px;
  overflow: hidden;
}

/* Foreground progress bar showing how far the user is */
.progress-bar {
  height: 100%;
  background: var(--color-primary);
  border-radius: 999px;
  transition: width 0.35s ease;
}
</style>
