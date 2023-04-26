import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import JoinRoomViewVue from '@/views/JoinRoomView.vue'
import RoomViewVue from '@/views/RoomView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/room',
      name: 'join-room',
      component: JoinRoomViewVue
    },
    {
      path: '/room/:id',
      name: 'room',
      component: RoomViewVue
    }
  ]
})

export default router
