<template>
  <main>
    <!-- Completion message wrapper -->
    <div>
      <!-- Success title -->
      <h2>Félicitations !</h2>

      <!-- Completion message -->
      <p>Vous avez terminé.</p>
      <br />
      <p>La journée peut maintenant commencer :)</p>
    </div>

    <!-- Back to home -->
    <button @click="goHome">Retour à l'accueil</button>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useConfettiAnimation } from "@/composables/use-confetti-animation";
import { useStaggerAnimation } from "@/composables/use-stagger-animation";
import { useRoutineStore } from "@/stores/routine.store";

// Trigger animations when the component is mounted
onMounted(() => {
  // First confetti burst
  useConfettiAnimation();

  // Slightly delayed second burst for extra effect
  setTimeout(() => {
    useConfettiAnimation(80, 60);
  }, 100);
});

const router = useRouter();
const store = useRoutineStore();

/**
 * Navigate back home and reset routine state.
 */
function goHome() {
  store.reset(); // Clear routine progress
  router.push({ name: "home" }); // Redirect to home page
}

// Animate text elements sequentially
useStaggerAnimation("main > div > *", 0.5);
</script>

<style lang="css" scoped>
main {
  height: 100%;
  justify-content: space-around;
}
</style>
