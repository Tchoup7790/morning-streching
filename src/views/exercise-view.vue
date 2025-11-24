<template>
  <main class="flex flex-col items-center text-center p-4 flex-1">
    <div v-if="store.currentExercise">
      <h2 class="text-xl font-semibold mb-4">
        {{ store.currentExercise.title }}
      </h2>

      <img
        :src="store.currentExercise.image"
        :alt="store.currentExercise.title"
        class="w-48 h-48 object-contain mb-6"
      />

      <p class="text-neutral-600 mb-6">
        {{ store.currentExercise.description }}
      </p>

      <CustomTimer
        :key="store.currentExercise.id"
        :duration="store.currentExercise.duration"
        :isPaused="store.isPaused"
        @finished="onExerciseFinished"
      />
    </div>
    <div v-else>Error: Aucun exercice.</div>
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
