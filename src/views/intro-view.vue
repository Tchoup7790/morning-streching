<template>
  <main>
    <!-- Header with title and subtitle -->
    <div>
      <h1>Routine Matinale</h1>
      <p>Commencez votre journée en souplesse.</p>
    </div>

    <!-- Button to start the routine -->
    <button @click="startRoutine">Commencer la séance</button>
  </main>
</template>

<script setup lang="ts">
// Router instance for navigation
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { gsap } from "gsap";

const router = useRouter();

// Navigate to the routine page when clicked
function startRoutine() {
  router.push("/routine");
}

onMounted(() => {
  gsap.from("main > *", {
    y: 20,
    duration: 1,
    stagger: 0.12,
    ease: "expo.out",
    delay: 0.1,
  });
});
</script>

<style scoped>
/* Ensures spacing inside the main container */
main {
  height: 100%;
  justify-content: space-around;
}
</style>
