<script setup lang="ts">
import { provide, ref } from 'vue'

interface Props {
  model: Record<string, any>
  rules?: Record<string, any>
}

const props = defineProps<Props>()

const formRef = ref<any>(null)

provide('form', formRef)

async function validate(fields?: string[]) {
  try {
    return await formRef.value.validate(fields)
  }
  catch (errors) {
    return { valid: false, errors }
  }
}

function reset() {
  formRef.value.reset()
}

defineExpose({
  validate,
  reset,
})
</script>

<template>
  <wd-form ref="formRef" custom-class="school-form" :model="props.model" :rules="props.rules">
    <slot></slot>
  </wd-form>
</template>
