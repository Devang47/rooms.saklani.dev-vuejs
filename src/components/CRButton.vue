<script setup lang="ts">
import { ref, type PropType } from 'vue'

const btn = ref<HTMLButtonElement>()

const props = defineProps({
  btnType: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button',
    validator: (value: string) => ['button', 'submit', 'reset'].includes(value)
  },

  error: { type: Boolean, required: false, default: false },
  label: {
    type: String,
    default: 'default label'
  }
})
</script>

<template>
  <button
    :ariaLabel="props.label"
    @click="() => $emit('clicked')"
    :this="btn"
    :type="props.btnType"
    :class="{ error: props.error }"
    class="arrow-button {{ $attrs.class }} group shadow-custom"
  >
    <slot />
  </button>
</template>
