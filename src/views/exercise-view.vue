<template>
  <main>
    <div v-if="store.currentExercise">
      <!-- Progress indicator -->
      <div>
        <span>
          Exercice {{ store.currentIndex + 1 }}/{{ store.exercises.length }}
        </span>
      </div>

      <!-- Progress bar -->
      <div class="progress-bar-container">
        <div
          class="progress-bar"
          :style="{
            width: `${(store.currentIndex / store.exercises.length) * 100}%`,
          }"
        />
      </div>

      <!-- Exercise title -->
      <div>
        <h2>
          {{ store.currentExercise.title }}
        </h2>
        <p>
          {{ store.currentExercise.description }}
        </p>
      </div>

      <!-- Exercise image -->
      <div>
        <img
          :src="store.currentExercise.image"
          :alt="store.currentExercise.title"
        />
      </div>

      <!-- Timer -->
      <div>
        <CustomTimer
          :key="store.currentExercise.id"
          :duration="store.currentExercise.duration"
          @finished="onExerciseFinished"
        />
      </div>

      <!-- Skip button -->
      <button @click="onExerciseFinished">Passer l'exercice</button>
    </div>

    <div v-else>
      <p>Erreur: Aucun exercice trouvé</p>
    </div>
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
  background-color: grey;
}
.progress-bar {
  background-color: black;
  height: 2px;
}
</style>
