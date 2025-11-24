<template>
  <main v-if="store.currentExercise">
    <!-- Progress indicator -->
    <p>
      Exercice {{ store.currentIndex + 1 }} sur {{ store.exercises.length }}
    </p>

    <!-- Progress bar -->
    <div class="progress-bar-container">
      <div
        class="progress-bar"
        :style="{
          width: `${((store.currentIndex + 1) / store.exercises.length) * 100}%`,
        }"
      />
    </div>

    <!-- Exercise title -->
    <div>
      <h2>
        {{ store.currentExercise.title }}
      </h2>
    </div>
    <!-- Timer -->
    <CustomTimer
      :key="store.currentExercise.id"
      :duration="store.currentExercise.duration"
      @finished="onExerciseFinished"
    />

    <!-- Skip button -->
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

function onExerciseFinished() {
  if (store.hasNext) {
    store.next();
  } else {
    router.push({ name: "end" });
  }
}
</script>

<style lang="css" scoped>
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

.progress-bar {
  height: 100%;
  background: var(--color-primary);
  border-radius: 999px;
  transition: width 0.35s ease;
}
</style>
