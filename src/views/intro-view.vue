<template>
  <main>
    <!-- Header with title and subtitle -->
    <div>
      <h1>Routine Matinale</h1>
      <p>Commencez votre journée en souplesse.</p>
    </div>

    <!-- Button to start the routine -->
    <button @click="startRoutine">Commencer la séance</button>

    <!-- Placeholder to keep layout spacing -->
    <div />
  </main>
</template>

<script setup lang="ts">
// Router instance for navigation
import { useRouter } from "vue-router";

const router = useRouter();

// Navigate to the routine page when clicked
function startRoutine() {
  router.push("/routine");
}
</script>

<style scoped>
/* Ensures spacing inside the main container */
main {
  justify-content: space-between;
}
</style>
