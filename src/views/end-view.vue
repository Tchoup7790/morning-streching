<template>
  <main>
    <!-- Completion message wrapper -->
    <div>
      <!-- Success title -->
      <h2>Félicitations !</h2>

      <!-- Completion message -->
      <p>Vous avez terminé votre routine matinale.</p>
      <br />
      <p>La journée peut maintenant commencer :)</p>
    </div>

    <!-- Action buttons container -->
    <div class="container">
      <!-- Restart routine -->
      <button @click="restart">Recommencer</button>

      <!-- Back to home -->
      <a href="#" @click.prevent="goHome()">Retour à l'accueil</a>
    </div>

    <!-- Placeholder to solve spacing issues -->
    <div />
  </main>
</template>

<script setup lang="ts">
import confetti from "canvas-confetti";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRoutineStore } from "@/stores/routine.store";

// Triggered when the component mounts
onMounted(() => {
  // First confetti burst coming from bottom
  confetti({
    // number of particles
    particleCount: 120,
    // explosion spread
    spread: 180,
    // start slightly below screen
    origin: { y: 1.1 },
    // upward velocity
    startVelocity: 45,
    // fall speed
    gravity: 0.7,
    // size scaling
    scalar: 1.1,
  });

  // Second confetti burst shortly after
  setTimeout(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 1.1 },
      startVelocity: 60,
      gravity: 0.65,
      scalar: 1.0,
    });
  }, 100);
});

// Router instance for navigation
const router = useRouter();

// Routine store instance
const store = useRoutineStore();

// Reset routine and restart the exercise flow
function restart() {
  store.reset();
  router.push("/routine");
}

// Reset routine and navigate back to home screen
function goHome() {
  store.reset();
  router.push({ name: "home" });
}
</script>

<style lang="css" scoped>
/* Main wrapper layout */
main {
  justify-content: space-between;
}

/* CTA button section layout */
.container {
  gap: 20px;
  display: flex;
  flex-direction: column;
}
</style>
