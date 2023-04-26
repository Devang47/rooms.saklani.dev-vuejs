<script lang="ts" setup>
import Dustbin from '@/components/icons/DustBin.vue'
import { useMessagesStore, useRoomStore } from '@/stores/global'
import type {} from '@/utils/Room'
import { addNotification } from '@/utils/notifications'
import { computed, onUnmounted, ref } from 'vue'

const props = defineProps({
  roomId: String,
  handleDeleteRoom: Function
})

const messagesStore = useMessagesStore()
const roomStore = useRoomStore()

const copyText = () => {
  navigator.clipboard.writeText(props.roomId || '')

  addNotification('Copied to clipboard!', false)
}

let timeRemainingBeforeRoomDeletion = ref<string>('')
let interval = ref<any>()

function startTimer(duration: number) {
  if (interval.value) clearInterval(interval.value)

  let timer = duration,
    minutes,
    seconds
  interval.value = setInterval(function () {
    minutes = parseInt('' + timer / 60, 10)
    seconds = parseInt('' + (timer % 60), 10)

    if (minutes === 0 && seconds === 0) {
      return (timeRemainingBeforeRoomDeletion.value = '00:00')
    }

    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds

    timeRemainingBeforeRoomDeletion.value = minutes + ':' + seconds

    if (--timer < 0) {
      timer = duration
    }
  }, 1000)
}

const time = computed(() => {
  let res = 15 * 60000 - (new Date().getTime() - roomStore.roomData?.timestamp)
  startTimer(res / 1000)
  return res
})

onUnmounted(() => {
  if (interval.value) clearInterval(interval.value)
})
</script>

<template>
  <header>
    <a href="/" @click="messagesStore.setRoomMessages([])">
      <h1 role="link" class="sans cursor-pointer">ChatRooms</h1>
    </a>
    <div class="flex items-center gap-5">
      <div class="text-light text-[15px] hidden sm:block">
        {{ timeRemainingBeforeRoomDeletion }}
      </div>

      <button aria-label="copy room id" class="room-id group" @click="copyText">
        <span v-for="letter in (roomId || '').split('')" :key="letter" class="letter">
          {{ letter }}
        </span>
      </button>

      <button
        aria-label="delete room"
        title="delete room"
        @click="handleDeleteRoom ?? ''"
        class="delete-btn"
      >
        <Dustbin />
      </button>
    </div>
  </header>
</template>
