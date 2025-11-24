import { defineStore } from "pinia";
import type { Exercise } from "@/models/interfaces/exercise.interface";

export interface RoutineState {
  exercises: Exercise[];
  currentIndex: number;
  isPaused: boolean;
}

export const useRoutineStore = defineStore("routine", {
  state: () =>
    ({
      exercises: [
        {
          id: "1",
          title: "Cou Stretch",
          description: "Étirer doucement le cou vers la droite.",
          image: "/images/cou.png",
          duration: 20,
        },
        {
          id: "2",
          title: "Épaules",
          description: "Rotation lente vers l’arrière.",
          image: "/images/epaules.png",
          duration: 20,
        },
      ] as Exercise[],
      currentIndex: 0,
      isPaused: false,
    }) as RoutineState,

  getters: {
    currentExercise(state) {
      return state.exercises[state.currentIndex];
    },
    hasNext(state) {
      return state.currentIndex < state.exercises.length - 1;
    },
  },

  actions: {
    reset() {
      this.currentIndex = 0;
      this.isPaused = false;
    },

    next() {
      if (this.hasNext) {
        this.currentIndex++;
      }
    },

    pause() {
      this.isPaused = true;
    },

    resume() {
      this.isPaused = false;
    },
  },
});
