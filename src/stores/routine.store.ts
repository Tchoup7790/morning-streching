import { defineStore } from "pinia";
import exerciseData from "@/assets/exercises.json";
import type { Exercise } from "@/models/interfaces/exercise.interface";

export interface RoutineState {
  exercises: Exercise[];
  currentIndex: number;
  isPaused: boolean;
}

export const useRoutineStore = defineStore("routine", {
  state: () =>
    ({
      exercises: exerciseData as Exercise[],
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
