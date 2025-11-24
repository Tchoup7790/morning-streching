<template>
  <main
    class="flex flex-col items-center justify-center flex-1 p-6 text-center"
  >
    <h1 class="text-3xl font-bold mb-6">Routine Matinale</h1>

    <button
      @click="startRoutine"
      class="px-6 py-3 rounded-xl bg-blue-600 text-white text-lg shadow-md"
    >
      Commencer
    </button>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function startRoutine() {
  router.push("/routine");
}
</script>
