<template>
  <main
    class="flex flex-col items-center justify-center flex-1 p-6 text-center"
  >
    <h2 class="text-2xl font-bold mb-6">Bien joué 🎉</h2>

    <button
      @click="restart"
      class="px-6 py-3 rounded-xl bg-blue-600 text-white text-lg shadow-md"
    >
      Recommencer
    </button>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useRoutineStore } from "@/stores/routine.store";

const router = useRouter();
const store = useRoutineStore();

function restart() {
  store.reset();
  router.push({ name: "home" });
}
</script>
