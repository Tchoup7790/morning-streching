<template>
  <main>
    <div>
      <h1>Routine Matinale</h1>
      <p>Commencez votre journée en douceur</p>
    </div>

    <button @click="startRoutine">Commencer la séance</button>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function startRoutine() {
  router.push("/routine");
}
</script>
