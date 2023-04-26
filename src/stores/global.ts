import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CustomNotification } from '@/global'

export const useRoomIdStore = defineStore('useRoomIdStore', () => {
  const roomId = ref<string>()

  return { roomId }
})

export const useMessagesStore = defineStore('useMessagesStore', () => {
  const roomMessages = ref<any[]>([])

  const setRoomMessages = (messages: any[]) => {
    roomMessages.value = messages
  }

  const resetRoomMessages = () => {
    roomMessages.value = []
  }

  return { roomMessages, setRoomMessages, resetRoomMessages }
})

export const useLoadingStore = defineStore('useLoadingStore', () => {
  const loadingValue = ref<boolean>(false)

  const alterLoadingState = () => {
    loadingValue.value = !loadingValue.value
  }

  const setLoadingValue = (val: boolean) => {
    loadingValue.value = val
  }

  return { loadingValue, alterLoadingState, setLoadingValue }
})

export const useNotificationStore = defineStore('useNotificationStore', {
  state: () => ({
    notifications: ref<CustomNotification[]>([])
  }),

  actions: {
    addNotification(msg: string, error: boolean) {
      this.notifications.push({ data: msg, error })

      setTimeout(() => {
        this.notifications.pop()
      }, 2000)
    },
    removeLastNotification() {
      this.notifications.pop
    }
  }
})

export const useRoomStore = defineStore('useRoomStore', () => {
  const roomData = ref<any>(false)

  const setRoomData = (data: any) => {
    roomData.value = data
  }

  return { roomData, setRoomData }
})
