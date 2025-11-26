<template>
  <main>
    <div>
      <!-- Page title -->
      <h1>Routine Matinale</h1>

      <!-- Short description -->
      <p>Commencez votre journée en souplesse.</p>
    </div>

    <!-- Button that starts the routine -->
    <button @click="startRoutine">Commencer la séance</button>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStaggerAnimation } from "@/composables/use-stagger-animation";

// Router instance used for navigation
const router = useRouter();

// Navigate to the routine page when the button is clicked
function startRoutine() {
  router.push("/routine");
}

// Animate titles and button with a staggered entrance
onMounted(() => useStaggerAnimation("main > div > *, main > button"));
</script>

<style scoped>
main {
  height: 100%;
  justify-content: space-around;
}
</style>
