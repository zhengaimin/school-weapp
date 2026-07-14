<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "绑定学生"
  }
}
</route>

<script lang="ts" setup>
import type { Students } from '@/api/interface/modules/students'
import { storeToRefs } from 'pinia'
import { computed, ref, unref } from 'vue'
import { getSchoolsApi } from '@/api/modules/schools'
import { postBindStudentApi, postPublicStudentApi } from '@/api/modules/students'
import { getWxCode, postParentRegisterApi } from '@/api/modules/user'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import RoleAvatar from '@/components/common/role-avatar/index.vue'
import StatusTip from '@/components/common/status-tip/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Cell from '@/components/form/cell/index.vue'
import Form from '@/components/form/index/index.vue'
import Picker from '@/components/form/picker/index.vue'
import BottomPopup from '@/components/popup/bottom-popup/index.vue'
import { DEVICE_TYPE, ROLE_TYPE, SEARCH_TYPE, SEARCH_TYPE_OPTIONS } from '@/constant/modules'
import { TABBAR_HOME_PATH } from '@/constant/router'
import { useBalance } from '@/hooks/useBalance'
import { useDeviceType } from '@/hooks/useDeviceType'
import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'
import { useParentStore } from '@/store/auth/parent'
import { useCurrentStudentStore } from '@/store/business/currentStudent'
import { useUserStore } from '@/store/user'
import { sleep } from '@/utils'
import { toast } from '@/utils/toast'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const userStore = useUserStore()
const parentStore = useParentStore()
const currentStudentStore = useCurrentStudentStore()
const { needBind, studentsIdMap } = storeToRefs(parentStore)
const { axiosGetUserBalanceApi } = useBalance()
const { defaultDeviceType } = useDeviceType()
const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
const { formRef, submitLoading, scrollIntoView, validate, scrollToFirstError } = useForm('.bind-scroll')

/** 表单数据 */
const formData = ref({
  school: '',
  name: '',
  searchType: SEARCH_TYPE.CODE,
  searchValue: '',
})
/** 搜索结果 */
const searchResult = ref<{
  type: 'found' | 'notFound' | null
  students?: Students.IStudentVo[]
}>({
  type: null,
})
/** 选中的学生 */
const selectedStudent = ref<Students.IStudentVo | null>(null)
/** 学生信息弹框显示状态 */
const showStudentInfoModal = ref(false)
/** 原始学校选项 */
const rawSchoolOptions = ref<any[]>([])
/** 学校选项 */
const schoolOptions = ref<{ label: string, value: string | number }[]>([])

/** 表单验证规则 */
const rules = {
  school: [{ required: true, message: '请选择学校' }],
  name: [{ required: true, message: '请输入学生姓名' }],
  searchType: [{ required: true, message: '请选择证件类型' }],
  searchValue: [{ required: true, message: '请输入证件号码' }],
}

/** 搜索值标签 */
const searchValueLabel = computed(() => {
  return SEARCH_TYPE_OPTIONS.find(item => item.value === formData.value.searchType)?.label || '学号'
})
/** 内容区域高度 */
const contentHeight = computed(() => {
  return getContentHeight('164rpx')
})
/** 获取学生唯一标识 */
const getStudentIdentifier = computed(() => {
  return (student: Students.IStudentVo) => {
    if (formData.value.searchType === SEARCH_TYPE.CODE) return student.studentCode
    if (formData.value.searchType === SEARCH_TYPE.UUID) return student.uuid
    return student.idCard
  }
})

/** 隐藏搜索结果 */
function hideSearchResult() {
  searchResult.value = { type: null }
}

/** 获取学校列表 */
async function axiosGetSchoolsApi() {
  try {
    const result = await getSchoolsApi({ page: 1, pageSize: 100 })
    if (result.code === 0 && result.data?.schools) {
      const { data } = result
      rawSchoolOptions.value = data.schools
      schoolOptions.value = data.schools.map(item => ({
        label: item.name,
        value: item.id,
      }))
    }
    return result
  } catch (error) {
    console.error('获取学校列表', error)
    return { code: -1 }
  }
}
/** 搜索学生 */
async function axiosPostPublicStudentApi(params: Students.ReqPostPublicStudentApi) {
  try {
    const { code, data } = await postPublicStudentApi(params)
    if (code === 0 && data && data.students && data.students.length > 0) {
      searchResult.value = { type: 'found', students: data.students }
    } else {
      searchResult.value = { type: 'notFound' }
    }
  } catch (error) {
    searchResult.value = { type: 'notFound' }
    console.log(error)
  }
}
/** 绑定学生（needBind=true 调用注册接口，否则调用绑定接口） */
async function axiosPostBindStudentApi(params: { studentId: number }) {
  try {
    let api = null
    const { studentId } = params

    if (unref(needBind)) {
      const { code } = await getWxCode()
      if (!code) {
        throw new Error('获取微信登录凭证失败')
      }
      api = () =>
        postParentRegisterApi({
          loginCode: code,
          children: [{ studentId }],
          chooseChildUserId: studentId,
        })
    } else {
      api = () => postBindStudentApi({ studentId })
    }

    const result = await api()

    if (result.data.token) {
      userStore.setToken(result.data.token)
      await userStore.getUserInfo()
      const resolvedDeviceType = defaultDeviceType.value || DEVICE_TYPE.VIDEO
      await axiosGetUserBalanceApi(resolvedDeviceType)
      currentStudentStore.setContactInfo(null)
      setTimeout(() => {
        uni.navigateBack()
      }, 500)
    }

    return result
  } catch (error) {
    console.error('绑定学生失败:', error)
    throw error
  }
}

/** 学校变化处理 */
async function handleSchoolChange() {
  formData.value.name = ''
  formData.value.searchValue = ''
  hideSearchResult()
}
/** 学生姓名输入变化 */
function handleStudentNameInput() {
  hideSearchResult()
}
/** 搜索学生 */
async function handleSearchStudent() {
  try {
    const { valid } = await validate(['school', 'name', 'searchType', 'searchValue'])
    if (!valid) {
      scrollToFirstError()
      return
    }

    submitLoading.value = true
    const { school, name, searchType, searchValue } = formData.value
    const selectedSchool = rawSchoolOptions.value.find(s => s.id === school)

    if (!selectedSchool) {
      toast.show('未找到学校信息')
      return
    }

    const params: Students.ReqPostPublicStudentApi = {
      schoolId: +school,
      tenantId: +selectedSchool.tenantId,
      name: name.trim(),
    }
    if (searchType === SEARCH_TYPE.CODE) params.studentCode = searchValue.trim()
    else if (searchType === SEARCH_TYPE.ID_CARD) params.idCard = searchValue.trim()
    else if (searchType === SEARCH_TYPE.UUID) params.UUID = searchValue.trim()

    await axiosPostPublicStudentApi(params)

    selectedStudent.value = null
    showStudentInfoModal.value = true
  } catch (error) {
    console.error('搜索学生失败:', error)
    toast.show('搜索失败，请重试')
  } finally {
    submitLoading.value = false
  }
}
/** 确认绑定 */
async function handleConfirmBinding() {
  try {
    submitLoading.value = true

    const result = await axiosPostBindStudentApi({
      studentId: selectedStudent.value.id,
    })

    if (result.code === 0) {
      if (unref(needBind) && result.data?.token) {
        parentStore.setNeedBind(false)
      }

      toast.info('绑定成功！')
      showStudentInfoModal.value = false

      await sleep(500)
      await batchRequestHandler([parentStore.axiosGetStudentListApi()], { auto: false })

      uni.redirectTo({
        url: `${TABBAR_HOME_PATH}?role=${ROLE_TYPE.PARENT}`,
      })
    } else {
      throw new Error(result.msg || '绑定失败')
    }
  } catch (error: any) {
    console.error('绑定失败:', error)
    const errorMessage = error?.message || error?.data?.message || error?.msg || '绑定失败，请重试'
    toast.show(errorMessage)
  } finally {
    submitLoading.value = false
  }
}

/** 登录成功处理 */
async function onLoginSuccess() {
  batchRequestHandler([axiosGetSchoolsApi()])
}
</script>

<template>
  <Page
    title="绑定学生"
    :loading="pageLoading"
    :error="pageError"
    :scroll-y="false"
    @login:success="onLoginSuccess"
    @login:fail="onLoginFail"
  >
    <scroll-view
      class="bind-scroll"
      scroll-y
      :enhanced="true"
      :show-scrollbar="false"
      :scroll-with-animation="true"
      :scroll-into-view="scrollIntoView"
      :style="contentHeight"
    >
      <view box-border p="x-4 t-2 b-4">
        <!-- 绑定表单 -->
        <WhiteCard>
          <Form ref="formRef" :model="formData" :rules="rules">
            <view flex="~ col" gap="2.5">
              <!-- 学校选择 -->
              <Cell id="school" required label="学校" prop="school">
                <Picker
                  v-model="formData.school"
                  :options="schoolOptions"
                  title="选择学校"
                  placeholder="请选择学校"
                  @change="handleSchoolChange"
                />
              </Cell>

              <!-- 学生姓名输入 -->
              <Cell id="name" required label="学生姓名" prop="name">
                <wd-input
                  v-model="formData.name"
                  placeholder="请输入学生姓名"
                  :disabled="!formData.school"
                  @input="handleStudentNameInput"
                  @confirm="handleSearchStudent"
                />
              </Cell>

              <!-- 证件类型选择器 -->
              <Cell id="searchType" required label="证件类型" prop="searchType">
                <Picker
                  v-model="formData.searchType"
                  :options="SEARCH_TYPE_OPTIONS"
                  title="选择证件类型"
                  placeholder="请选择证件类型"
                />
              </Cell>

              <!-- 证件号码输入框 -->
              <Cell id="searchValue" required :label="searchValueLabel" prop="searchValue">
                <wd-input
                  v-model="formData.searchValue"
                  :placeholder="`请输入${searchValueLabel}`"
                  :disabled="!formData.school"
                  @input="handleStudentNameInput"
                  @confirm="handleSearchStudent"
                />
              </Cell>
            </view>
          </Form>
        </WhiteCard>
      </view>
    </scroll-view>

    <!-- 底部按钮 -->
    <view p="4">
      <TButton
        type="primary"
        size="large"
        full
        :loading="submitLoading"
        @click="handleSearchStudent"
      >
        搜索学生
      </TButton>
    </view>

    <!-- 学生信息弹框 -->
    <BottomPopup v-model="showStudentInfoModal" title="学生列表" height="auto">
      <!-- 未找到学生 -->
      <StatusTip
        v-if="searchResult.type === 'notFound'"
        url-prefix="https://xzsh.stufree.com/img/"
        image="content"
        tip="未找到匹配的学生信息"
        p="b-6!"
      />

      <!-- 学生列表 -->
      <view
        v-else-if="searchResult.type === 'found' && searchResult.students"
        flex="~ col"
        gap="4"
        p="4 b-0"
      >
        <view
          v-for="student in searchResult.students"
          :key="student.id"
          p="3"
          border="1 solid rounded-md"
          :class="[
            selectedStudent?.id === student.id ? 'border-primary' : 'border-bg-muted',
            studentsIdMap[student.id] ? 'bg-gray-100 opacity-60' : '',
          ]"
          @click="!studentsIdMap[student.id] && (selectedStudent = student)"
        >
          <view flex="~ items-center">
            <view
              h-4
              w-4
              rounded-full
              border="~ solid"
              flex="~ items-center justify-center"
              :class="
                selectedStudent?.id === student.id ? 'border-primary bg-primary' : 'border-gray-300'
              "
            >
              <view v-if="selectedStudent?.id === student.id" h-2 w-2 rounded-full bg-white />
            </view>

            <!-- Avatar -->
            <RoleAvatar type="student" :face-img="false" :path="student?.faceImageUrl" m="l-3" />

            <!-- Info -->
            <view m="l-3" flex="1">
              <view text="base" font="medium" color="text-primary">
                {{ student.name }}
                <text text="sm" color="text-secondary" m="l-1">
                  ({{ getStudentIdentifier(student) }})
                </text>
              </view>
              <view text="sm" color="text-secondary" m="t-0.5">
                {{ student.schoolName }}
              </view>
            </view>

            <view v-if="studentsIdMap[student.id]" m="l-auto" text="xs gray-400">
              已绑定
            </view>
          </view>
        </view>
      </view>

      <template v-if="searchResult.type === 'found'" #footer>
        <view p-4>
          <TButton
            type="primary"
            size="large"
            full
            :disabled="!selectedStudent"
            :loading="submitLoading"
            @click="handleConfirmBinding"
          >
            绑定
          </TButton>
        </view>
      </template>
    </BottomPopup>
  </Page>
</template>
