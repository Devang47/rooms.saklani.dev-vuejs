<script setup lang="ts">
import { useLoadingStore } from '@/stores/global'
import { useRoomStore } from '@/stores/global'
import { checkIfRoomExists } from '@/utils/Room'
import gsap, { Power3 } from 'gsap'
import CRButtonVue from '@/components/CRButton.vue'
import { onMounted, ref } from 'vue'
import DashedUnderlineIcon from '@/components/icons/DashedUnderlineIcon.vue'
import FloatingImages from '@/components/FloatingImages.vue'
import { addNotification } from '@/utils/notifications'
import router from '@/router'
import CircleAnimation from '@/components/CircleAnimation.vue'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'
import CurvedArrowLineIcon from '@/components/icons/CurvedArrowLineIcon.vue'

const { setLoadingValue } = useLoadingStore()

let inputVal = ref('')
let formLoading = ref('false')
let roomExists = ref(true)

const roomStore = useRoomStore()
const joinRoom = async () => {
  if (!inputVal.value.trim() || inputVal.value.length < 6) return
  formLoading.value = 'true'

  roomStore.setRoomData(await checkIfRoomExists(inputVal.value))

  if (!roomStore.roomData) {
    formLoading.value = 'false'
    roomExists.value = false

    addNotification('404 Not found!', true)

    return null
  }

  roomExists.value = true
  formLoading.value = 'complete'

  gsap.to('.moveable-block', {
    opacity: 0,
    duration: 0.1
  })

  gsap.to('.arrow-button', {
    scale: 100,
    duration: 0.3,
    ease: 'linear'
  })

  setTimeout(() => {
    router.push('/room/' + inputVal.value)
  }, 800)
}

onMounted(() => {
  setLoadingValue(false)

  const tl = gsap.timeline({})

  tl.to('.bg', {
    delay: 0.2,
    width: '100%',
    duration: 0.8,
    ease: Power3.easeOut
  })
    .to('.content', {
      delay: -0.5,
      opacity: 1,
      duration: 0.4
    })
    .to('.moveable-block', {
      delay: -0.6,
      x: 0,
      y: 0,
      opacity: 1,
      duration: 0.4
    })
})

const handleGotoCreatePage = () => {
  gsap
    .to('.transition-join-page', {
      height: '100%',
      duration: 0.7,
      ease: Power3.easeOut
    })
    .then(() => {
      setTimeout(() => {
        router.push('/')
      }, 100)
    })
}
</script>

<template>
  <main class="h-full">
    <FloatingImages />
    <div class="transition-join-page" />

    <section class="join-room-page">
      <div class="container">
        <div class="content opacity-0">
          <div class="relative w-fit mx-auto">
            <h1 class="sans">Join Room</h1>
            <span class="heading-underline"><DashedUnderlineIcon /> </span>
          </div>

          <form action="#" @submit.prevent="joinRoom">
            <div class="roomid-input">
              <input
                v-model="inputVal"
                class=""
                placeholder="xxxxxx"
                maxlength="6"
                type="text"
                name=""
                id=""
              />
              <span class="curved-arrow-line">
                <CurvedArrowLineIcon />
              </span>
            </div>

            <div class="relative w-fit mx-auto group">
              <CRButtonVue
                label="Join room"
                type="submit"
                :error="!roomExists"
                class="arrow-button"
              >
                <CircleAnimation v-if="formLoading === 'true'" class="w-[80px]" />
                <span v-else-if="!roomExists"> Not Found </span>

                <span :class="{ 'btn-remove-text': formLoading !== 'false' || !roomExists }">
                  Join <ArrowRightIcon />
                </span>
              </CRButtonVue>

              <div class="create-btn">
                or
                <button
                  aria-label="create a new room"
                  type="button"
                  title="Create room"
                  @click="handleGotoCreatePage"
                  class=""
                >
                  Create room
                </button>
              </div>
            </div>
          </form>
        </div>

        <div class="bg" />
      </div>
    </section>
  </main>
</template>
