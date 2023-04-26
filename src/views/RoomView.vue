<script setup lang="ts">
import { useMessagesStore, useLoadingStore, useRoomStore } from '@/stores/global'
import { useRoute } from 'vue-router'

import Message from '@/components/MessageItem.vue'
import Github from '@/components/icons/GithubIcon.vue'
import SendIcon from '@/components/icons/SendIcon.vue'
import UploadIcon from '@/components/icons/UploadIcon.vue'

import ChatHeader from '@/components/ChatHeader.vue'
import { addNotification } from '@/utils/notifications'
import { addMessage, checkIfRoomExists, deleteRoom, getRoomMessages } from '@/utils/Room'
import { uploadFile } from '@/utils/storage'
import { nextTick, onMounted, ref } from 'vue'
import router from '@/router'

const { setLoadingValue } = useLoadingStore()
const messagesStore = useMessagesStore()

let roomId = ref<string>('')
let scrollToElement = ref<HTMLDivElement>()
let chatInput = ref<string>('')
let chatInputBox = ref<HTMLTextAreaElement>()
let uploadFileInput = ref<HTMLInputElement>()

const roomStore = useRoomStore()
const route = useRoute()

onMounted(async () => {
  roomId.value = (route.params.id as string).toUpperCase()

  console.log({ uploadFileInput: uploadFileInput.value })

  roomStore.setRoomData(await checkIfRoomExists(roomId.value as string))
  console.log(roomStore.roomData)
  if (!roomStore.roomData) {
    messagesStore.setRoomMessages([])
    addNotification("Room doesn't exists", true)
    router.push('/')
  } else {
    await getRoomMessages(roomId.value, scrollToBottom)
    setLoadingValue(false)
  }

  chatInputBox.value?.addEventListener('keypress', (e) => {
    if (innerWidth < 640) return

    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      chatInput.value += '\r\n'
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleAddMsg()
    } else if (e.key === '/') {
      return
    }
  })

  window.addEventListener('keypress', focusOnInput)
})

const focusOnInput = (e: KeyboardEvent) => {
  if (innerWidth < 640) return

  if (e.key === '/') {
    chatInputBox.value?.focus()
  }
}

roomId.value = ((route.params.id as string) || '').toUpperCase() as string

const handleAddMsg = async () => {
  chatInput.value = chatInput.value?.trim() || ''
  if (!chatInput.value) return

  let msg = chatInput.value
  console.log(msg, roomId.value)
  chatInput.value = ''
  await addMessage({ roomId: roomId.value, message: msg })
  scrollToBottom()
  if (innerWidth > 640) {
    chatInputBox.value?.focus()
  }
}

const handleInputChange = async (e: any) => {
  if (e?.target?.files.length > 0) {
    setLoadingValue(true)
    try {
      let url: string = await uploadFile(roomId.value, e.target.files[0])

      if (chatInput.value.trim()) return (chatInput.value += ' ' + url)
      chatInput.value += url
    } catch (error) {
      console.log(error)
    }
  }
}

const handleDeleteRoom = async () => {
  setLoadingValue(true)
  await deleteRoom(roomId.value)
  messagesStore.setRoomMessages([])
  router.push('/')
}

const scrollToBottom = () => {
  if (scrollToElement.value) {
    scrollToElement.value.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}
</script>

<template>
  <section class="chat-ui">
    <div class="container">
      <ChatHeader :roomId="roomId" :handleDeleteRoom="handleDeleteRoom" />

      <div class="chat-messages-wrapper">
        <div class="messages-wrapper">
          <div v-if="!messagesStore.roomMessages.length" class="placeholder">
            <SendIcon color="#555E69" />

            <h2 class="">Type and send a message to get started!</h2>

            <div class="commands-table hidden sm:block">
              <table class="" border="{1}">
                <tr>
                  <td><code> enter </code></td>
                  <td>Send Message</td>
                </tr>
                <tr>
                  <td><code> shift + enter </code></td>
                  <td>New line</td>
                </tr>
                <tr>
                  <td><code> / </code></td>
                  <td>Focus on input</td>
                </tr>
              </table>
            </div>
          </div>
          <div v-else v-for="item in messagesStore.roomMessages" :key="item">
            <Message :room-id="roomId" :message-data="item" />
          </div>

          <div class="scroll-bottom" ref="scrollToElement" />
        </div>

        <div class="chat-input">
          <textarea
            title="Chat input"
            placeholder="Enter something..."
            name="chat-input"
            id="input"
            cols="30"
            rows="10"
            ref="chatInputBox"
            v-model="chatInput"
          />
          <div class="buttons">
            <button @click="handleAddMsg()" aria-label="send message button" title="Send message">
              <div class="sr-only">Send message</div>
              <SendIcon />
            </button>
            <button
              class="upload cursor-pointer"
              title="Upload media"
              aria-label="Upload media button"
              @click="uploadFileInput?.click()"
            >
              <label for="fileinput" class="sr-only">Upload media</label>
              <div title="Upload media" class="upload-icon">
                <UploadIcon />
              </div>
              <input
                multiple="false"
                ref="uploadFileInput"
                type="file"
                class="hidden"
                name="fileinput"
                id="fileinput"
                :change="handleInputChange"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="hidden md:block absolute top-4 md:right- lg:right-6 text-white text-sm w-7">
    <a
      href="https://github.com/Devang47/rooms.saklani.dev"
      target="_blank"
      rel="noopener noreferrer"
      class="underline w-full"
    >
      <Github />
    </a>
  </div>
</template>
