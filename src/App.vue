<script setup lang="ts">
import LoadingScreen from './components/LoadingScreen.vue'
import NotificationsWrapperVue from './components/NotificationsWrapper.vue'
import { useLoadingStore } from './stores/global'
import '@/styles/global.scss'

const loadingStore = useLoadingStore()
</script>

<template>
  <LoadingScreen v-if="loadingStore.loadingValue" />

  <NotificationsWrapperVue />

  <RouterView />
</template>

<style scoped></style>
