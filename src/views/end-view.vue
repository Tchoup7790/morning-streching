<template>
  <main>
    <div>
      <h2>Félicitations !</h2>
      <p>Vous avez terminé votre routine matinale</p>
    </div>

    <!-- Stats -->
    <div>
      <p>
        {{ store.exercises.length }}
        Exercices
      </p>
    </div>

    <button @click="restart">Recommencer</button>

    <button @click="goHome">Retour à l'accueil</button>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useRoutineStore } from "@/stores/routine.store";

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
