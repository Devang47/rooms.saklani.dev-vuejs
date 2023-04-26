<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CRButtonVue from '@/components/CRButton.vue'
import CircleAnimation from '@/components/CircleAnimation.vue'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'
import DashedUnderlineIcon from '@/components/icons/DashedUnderlineIcon.vue'
import GithubIcon from '@/components/icons/GithubIcon.vue'
import CurvedArrowLineIcon from '@/components/icons/CurvedArrowLineIcon.vue'
import gsap, { Power3 } from 'gsap'
import { createRoom } from '@/utils/Room'
import { useLoadingStore } from '@/stores/global'
import router from '@/router'
import FloatingImages from '@/components/FloatingImages.vue'

let loading = ref<boolean>(true)
let formLoading = ref<'true' | 'false' | 'complete'>('false')

const loadingStore = useLoadingStore()

const transitionJoinPageStart = (callback: () => void) => {
  gsap
    .to('.transition-join-page', {
      height: '100%',
      duration: 0.7,
      ease: Power3.easeOut
    })
    .then(callback)
}

const handleCreateRoom = async () => {
  formLoading.value = 'true'
  let roomId = await createRoom()
  formLoading.value = 'complete'

  transitionJoinPageStart(() => {
    setTimeout(() => {
      loadingStore.setLoadingValue(true)
      router.push(`/room/${roomId}`)
    }, 100)
  })
}

const handleGotoJoinPage = () => {
  transitionJoinPageStart(() => {
    setTimeout(() => {
      router.push('/room')
    }, 100)
  })
}

onMounted(() => {
  loading.value = false

  const tl = gsap.timeline({})

  tl.to('.bg', {
    delay: 0.2,
    width: '100%',
    duration: 1,
    ease: Power3.easeOut
  })
    .to('.content', {
      delay: -0.6,
      opacity: 1,
      duration: 0.4
    })
    .to('.moveable-block', {
      delay: -0.7,
      x: 0,
      y: 0,
      opacity: 1,
      duration: 0.4
    })
})
</script>

<template>
  <main class="h-full">
    <FloatingImages />
    <div class="transition-join-page" />

    <section class="homepage">
      <div class="container relative">
        <div class="content opacity-0">
          <div class="relative w-fit mx-auto">
            <h1 class="sans">ChatRooms</h1>
            <span class="heading-underline"><DashedUnderlineIcon /> </span>
          </div>
          <p>
            On this website, you can create a private chat room and share data across multiple
            devices. When you click the button below it will generate a 6-digit room code which can
            be then used to join the room from different devices. The chat room will automatically
            delete after 15min.
          </p>

          <div class="relative w-fit mx-auto group">
            <CRButtonVue label="create a room" class="create-btn" v-on:click="handleCreateRoom">
              <CircleAnimation v-if="formLoading === 'true'" class="w-[80px]" />

              <span :class="{ 'btn-remove-text': formLoading !== 'false' }">
                Create a room
                <ArrowRightIcon />
              </span>
            </CRButtonVue>

            <span class="curved-arrow-line">
              <CurvedArrowLineIcon />
            </span>
          </div>

          <div class="join-btn">
            or
            <button
              aria-label="Join existing room"
              title="Join existing room"
              @click="handleGotoJoinPage"
              class=""
            >
              Join room
            </button>
          </div>
          <div class="absolute top-4 right-6 text-white text-sm w-7">
            <a
              href="https://github.com/Devang47/rooms.saklani.dev"
              target="_blank"
              rel="noopener noreferrer"
              class="underline w-full"
            >
              <GithubIcon />
            </a>
          </div>
        </div>

        <div class="bg" />
      </div>
    </section>
  </main>
</template>

<style lang="scss">
html {
  @apply overflow-hidden;
}
</style>
