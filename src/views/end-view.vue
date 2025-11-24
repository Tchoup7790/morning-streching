<template>
  <main>
    <div>
      <h2>Félicitations !</h2>
      <p>Vous avez terminé votre routine matinale.</p>
      <br />
      <p>La journée peut maintenant commencer :).</p>
    </div>

    <div class="container">
      <button @click="restart">Recommencer</button>

      <a href="#" @click.prevent="goHome()">Retour à l'accueil</a>
    </div>

    <!-- TODO: Fix Space -->
    <div />
  </main>
</template>

<script setup lang="ts">
import confetti from "canvas-confetti";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRoutineStore } from "@/stores/routine.store";

onMounted(() => {
  confetti({
    particleCount: 120,
    spread: 180,
    origin: { y: 1.1 },
    startVelocity: 45,
    gravity: 0.7,
    scalar: 1.1,
  });

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

const router = useRouter();
const store = useRoutineStore();

function restart() {
  store.reset();
  router.push("/routine");
}

function goHome() {
  store.reset();
  router.push({ name: "home" });
}
</script>

<style lang="css" scoped>
main {
  justify-content: space-between;
}

.container {
  gap: 20px;
  display: flex;
  flex-direction: column;
}
</style>
