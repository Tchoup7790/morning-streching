import { createRouter, createWebHistory } from 'vue-router'
import EndView from '@/views/end-view.vue'
import ExerciseView from '@/views/exercise-view.vue'
import IntroView from '@/views/intro-view.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: IntroView },
    { path: '/routine', name: 'routine', component: ExerciseView },
    { path: '/end', name: 'end', component: EndView },
  ],
})

export default router
