<template>
  <main class="flex flex-col items-center text-center p-4 flex-1">
    <h2 class="text-xl font-semibold mb-4">{{ exercise!.title }}</h2>

    <img
      :src="exercise!.image"
      :alt="exercise!.title"
      class="w-48 h-48 object-contain mb-6"
    />

    <p class="text-neutral-600 mb-6">{{ exercise!.description }}</p>

    <CustomTimer
      :duration="exercise!.duration"
      :is-paused="store.isPaused"
      @finished="onExerciseFinished"
    />
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import CustomTimer from "@/components/custom-timer.vue";
import { useRoutineStore } from "@/stores/routine.store";

const router = useRouter();
const store = useRoutineStore();

const exercise = computed(() => store.currentExercise);

function onExerciseFinished() {
  if (store.hasNext) {
    store.next();
  } else {
    router.push({ name: "end" });
  }
}
</script>
