import { defineStore } from "pinia";
import exerciseData from "@/assets/exercises.json";
import type { Exercise } from "@/models/interfaces/exercise.interface";

export interface RoutineState {
  // List of all exercises loaded from JSON
  exercises: Exercise[];
  // Index of the current exercise
  currentIndex: number;
  // Indicates if the routine is paused
  isPaused: boolean;
}

export const useRoutineStore = defineStore("routine", {
  state: () =>
    ({
      // Loaded exercise list
      exercises: exerciseData as Exercise[],
      // Start at the first exercise
      currentIndex: 0,
      // Routine starts unpaused
      isPaused: false,
    }) as RoutineState,

  getters: {
    // Returns the currently active exercise
    currentExercise(state) {
      return state.exercises[state.currentIndex];
    },

    // Checks if another exercise follows in the list
    hasNext(state) {
      return state.currentIndex < state.exercises.length - 1;
    },
  },

  actions: {
    // Reset routine to the beginning
    reset() {
      this.currentIndex = 0;
      this.isPaused = false;
    },

    // Move to the next exercise if available
    next() {
      if (this.hasNext) {
        this.currentIndex++;
      }
    },

    // Set routine to paused
    pause() {
      this.isPaused = true;
    },

    // Resume the routine
    resume() {
      this.isPaused = false;
    },
  },
});

