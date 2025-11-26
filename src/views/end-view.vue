<template>
  <!-- Completion message wrapper -->
  <main class="end-view">
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
import { useConfetti } from "@/composables/use-confetti-animation";
import { useStagger } from "@/composables/use-stagger";
import { useRoutineStore } from "@/stores/routine.store";

const router = useRouter();
const store = useRoutineStore();

// Navigate back home and reset routine state.
function goHome() {
  store.reset();
  router.push({ name: "home" });
}

// Trigger animations when the component is mounted
onMounted(() => {
  // Animate text elements sequentially
  useStagger(".end-view > div > *, .end-view > button", 0.4);

  // First burst
  useConfetti();

  // Second delayed burst
  setTimeout(() => {
    useConfetti({ count: 80, spread: 60 });
  }, 120);
});
</script>

<style lang="css" scoped>
main {
  height: 100%;
  justify-content: space-around;
}
</style>
