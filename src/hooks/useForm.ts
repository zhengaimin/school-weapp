import { getCurrentInstance, ref, unref } from 'vue'

import { boundingClientRect, querySelector } from '@/utils/dom'
import { sleep } from '@/utils/index'
import { isMpWeixin } from '@/utils/platform'

export function useForm(selector: string = '') {
  const instance = getCurrentInstance()
  const hasSelector = Boolean(selector)
  const formFieldSelector = hasSelector
    ? `${selector} ${isMpWeixin ? '>>> ' : ''} .cell-container`
    : ''

  const formRef = ref()
  const scrollIntoView = ref('')
  const formFieldsDom = ref<any[]>([])
  const submitLoading = ref(false)

  /** 校验传入字段 */
  const validate = async (fields: string[]) => {
    const result = await formRef.value?.validate(fields)
    console.log(result)

    return result
  }
  /** 校验所有字段 */
  const validateAll = async () => {
    return await formRef.value?.validate()
  }
  /** 重置所有校验 */
  const resetValidate = () => {
    formRef.value?.reset()
  }
  /** 寻找到第一个错误的字段 */
  const findErrorField = async () => {
    // 如果没有 selector，跳过 DOM 操作
    if (!hasSelector) {
      return
    }

    let foundError = false
    scrollIntoView.value = ''
    const list = unref(formFieldsDom)
    console.log(list)

    // 遍历所有缓存的表单字段
    for (const fieldElement of list) {
      const fieldId = fieldElement.id

      // 没有 id 直接退出 || 已经找到错误直接退出
      if (!fieldId || foundError)
        break

      const errorSelector = `${selector} ${isMpWeixin ? '>>> ' : ''} #${fieldId} ${isMpWeixin ? '>>> ' : ''} .cell-error-message`

      console.log(errorSelector)
      // 在微信小程序中，不传入组件实例，直接全局查询更可靠
      const errorElement = await boundingClientRect(errorSelector, instance)
      console.log(errorElement)
      // 存在 .wd-input__error-message
      if (errorElement) {
        foundError = true
        await sleep(50)
        scrollIntoView.value = fieldId

        await sleep(1000)
        scrollIntoView.value = ''
      }
    }
  }
  /** 滚动到第一个错误的字段 */
  const scrollToFirstError = async () => {
    // 如果没有 selector，跳过滚动操作
    if (!hasSelector) {
      return
    }

    console.log(formFieldsDom)
    // 如果没有缓存字段，先缓存
    if (unref(formFieldsDom).length === 0) {
      // 在微信小程序中，不传入组件实例，直接全局查询更可靠
      formFieldsDom.value = await querySelector(formFieldSelector, null, instance)
    }

    await sleep(100)
    findErrorField()
  }

  return {
    formRef,
    formFieldsDom,

    submitLoading,
    scrollIntoView,
    scrollToFirstError,

    validate,
    validateAll,
    resetValidate,
  }
}
