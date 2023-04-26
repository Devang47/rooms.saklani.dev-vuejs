<script setup lang="ts">
import LoadingScreen from './components/LoadingScreen.vue'
import { useLoadingStore } from './stores/global'
import '@/styles/global.scss'

const { loadingValue } = useLoadingStore()
</script>

<template>
  <LoadingScreen v-if="loadingValue" />

  <RouterView />
</template>

<style scoped></style>
