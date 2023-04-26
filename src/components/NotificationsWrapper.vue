<script lang="ts" setup>
import { useNotificationStore } from '@/stores/global'
import NotificationItem from './NotificationItem.vue'

const noficationStore = useNotificationStore()
</script>

<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-30"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <NotificationItem
        v-for="notification in noficationStore.notifications"
        :error="notification.error"
        :data="notification"
        :key="notification.data"
      />
    </div>
  </div>
</template>
