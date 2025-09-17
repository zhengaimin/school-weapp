<script setup lang="ts">
import { computed, provide, ref, unref } from 'vue'

interface Props {
  model: Record<string, any>
  rules?: Record<string, any>
}

const props = defineProps<Props>()

const formRef = ref<any>(null)

provide('form', formRef)

const formModel = computed(() => unref(props.model))
const formRules = computed(() => unref(props.rules))

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
  <wd-form ref="formRef" custom-class="school-form" :model="formModel" :rules="formRules">
    <slot></slot>
  </wd-form>
</template>
