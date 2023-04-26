<script lang="ts" setup>
import type { CustomNotification } from '@/global'

const props = defineProps<{
  data: CustomNotification
  error: boolean
}>()
</script>

<template>
  <div
    :class="{ 'bg-red-600': props.error, 'bg-sky-500': !props.error }"
    class="pointer-events-auto w-full max-w-[250px] overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
  >
    <div class="p-4">
      <div class="flex items-center">
        <div class="flex w-0 flex-1 justify-between">
          <p class="w-0 flex-1 text-sm font-medium text-white">{{ props.data.data }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
