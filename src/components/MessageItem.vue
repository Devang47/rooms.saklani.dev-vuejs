<script lang="ts" setup>
import CryptoJS from 'crypto-js'
import { decrypt } from '@/utils/crypt'
import { addNotification } from '@/utils/notifications'
import CopyIcon from '@/components/icons/CopyIcon.vue'
import { formatLinks } from '@/utils/format'
import { onMounted, ref } from 'vue'
import type { Message } from '@/global'

const props = defineProps<{
  messageData: Message
  roomId: string
}>()

let sameDevice = ref(false)
let message = ref('')

onMounted(async () => {
  const currentDeviceDetails = CryptoJS.SHA256(navigator.userAgent).toString(CryptoJS.enc.Hex)
  if (currentDeviceDetails === props.messageData.device) {
    sameDevice.value = true
  }
  const cryptedKey = CryptoJS.SHA512(props.roomId).toString(CryptoJS.enc.Hex)
  message.value = decrypt(cryptedKey, props.messageData.data)
})

let done = ref(false)
const copyText = () => {
  navigator.clipboard.writeText(message.value)
  done.value = true
  addNotification('Copied to clipboard!', false)
}
</script>

<template>
  <div class="message-item" :class="{ 'left-aligned': !sameDevice, 'right-aligned': sameDevice }">
    <p class="w-full font-medium" v-html="formatLinks(message)"></p>

    <button
      aria-label="copy text"
      :class="{ done }"
      :click="copyText"
      title="copy text"
      class="copy-btn"
    >
      <div class="sr-only">copy text</div>
      <CopyIcon />
    </button>
  </div>
</template>
