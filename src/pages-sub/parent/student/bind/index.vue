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
// #region 导入
import type { Students } from '@/api/interface/modules/students'
import { storeToRefs } from 'pinia'
import { computed, ref, unref } from 'vue'
import { getSchoolsApi } from '@/api/modules/schools'
import { postBindStudentApi, postPublicStudentApi } from '@/api/modules/students'
import { getWxCode, postParentRegisterApi } from '@/api/modules/user'
import TButton from '@/components/common/button/index.vue'
import Page from '@/components/common/page/index.vue'
import RoleAvatar from '@/components/common/role-avatar/index.vue'
import WhiteCard from '@/components/common/white-card/index.vue'
import Cell from '@/components/form/cell/index.vue'
import Form from '@/components/form/index/index.vue'
import Picker from '@/components/form/picker/index.vue'
import Icon from '@/components/icon/index.vue'
import BottomPopup from '@/components/popup/bottom-popup/index.vue'
import { NAVIGATION_SUFFIX_COLOR, NAVIGATION_SUFFIX_SIZE } from '@/constant/modules/navigation'
import { SEARCH_TYPE, SEARCH_TYPE_OPTIONS } from '@/constant/modules/user'
import { ROLE_TYPE } from '@/constant/modules/user/role'
import { TABBAR_HOME_PATH } from '@/constant/router'
import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'
import { useParentStore } from '@/store/parent'
import { useUserStore } from '@/store/user'
import { sleep } from '@/utils'
import { toast } from '@/utils/toast'
import { helpContent } from './data'
// #endregion

// #region 组件选项配置
defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})
// #endregion

// #region 使用 Store
const userStore = useUserStore()
const parentStore = useParentStore()
const { needBind, studentsIdMap } = storeToRefs(parentStore)
// #endregion

// #region 使用 Hooks
const { pageLoading, pageError, batchRequestHandler, onLoginFail, getContentHeight } = usePage()
const { formRef, submitLoading, scrollIntoView, validate, scrollToFirstError }
  = useForm('.bind-scroll')
// #endregion

// #region 定义响应式数据
const formData = ref({
  school: '',
  name: '',
  searchType: SEARCH_TYPE.CODE,
  searchValue: '',
})
const searchResult = ref<{
  type: 'found' | 'notFound' | null
  students?: Students.IStudentVo[]
}>({
  type: null,
})
const selectedStudent = ref<Students.IStudentVo | null>(null)
const showHelpModal = ref(false)
const showStudentInfoModal = ref(false)
const rawSchoolOptions = ref<any[]>([])
const schoolOptions = ref<{ label: string, value: string | number }[]>([])
// #endregion

// #region 定义计算属性
const searchValueLabel = computed(() => {
  return SEARCH_TYPE_OPTIONS.find(item => item.value === formData.value.searchType)?.label || '学号'
})
const contentHeight = computed(() => {
  return getContentHeight('164rpx')
})
// #endregion

// #region 定义验证规则
const rules = {
  school: [{ required: true, message: '请选择学校' }],
  name: [{ required: true, message: '请输入学生姓名' }],
  searchType: [{ required: true, message: '请选择证件类型' }],
  searchValue: [{ required: true, message: '请输入证件号码' }],
}
// #endregion

// #region 接口请求函数
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
  }
  catch (error) {
    console.error('获取学校列表', error)
    return { code: -1 }
  }
}
/** 获取学生列表 */
async function axiosPostPublicStudentApi(params: Students.ReqPostPublicStudentApi) {
  try {
    const { code, data } = await postPublicStudentApi(params)
    if (code === 0 && data && data.students && data.students.length > 0) {
      searchResult.value = {
        type: 'found',
        students: data.students,
      }
    }
    else {
      searchResult.value = {
        type: 'notFound',
      }
    }
  }
  catch (error) {
    searchResult.value = {
      type: 'notFound',
    }
    console.log(error)
  }
}
/**
 * 当 needBind = true，则调用 postParentRegisterApi 接口
 * 当 needBind = false，则调用 postBindStudentApi 接口
 */
async function axiosPostBindStudentApi(params: { studentId: number }) {
  try {
    let api = null

    const { studentId } = params

    // 检查是否需要注册绑定流程
    if (unref(needBind)) {
      // 需要注册绑定：先获取微信登录凭证，然后调用注册接口
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
    }
    // 直接绑定学生
    else {
      api = () => postBindStudentApi({ studentId })
    }

    const result = await api()

    if (result.data.token) {
      userStore.setToken(result.data.token)
    }

    return result
  }
  catch (error) {
    console.error('绑定学生失败:', error)
    throw error
  }
}

// #endregion

// #region 方法定义
// 隐藏搜索结果
function hideSearchResult() {
  searchResult.value = { type: null }
}
// 显示帮助弹框
function showHelp() {
  showHelpModal.value = true
}
// #endregion

// #region 事件处理函数
// 学校变化处理
async function onSchoolChange(schoolId: number) {
  formData.value.name = ''
  formData.value.searchValue = ''
  hideSearchResult()
}
// 学生姓名输入变化
function onStudentNameInput() {
  hideSearchResult()
}
// 搜索学生
async function handleSearchStudent() {
  try {
    // 使用表单校验
    const { valid } = await validate(['school', 'name', 'searchType', 'searchValue'])
    if (!valid) {
      scrollToFirstError()
      return
    }

    submitLoading.value = true
    const { school, name, searchType, searchValue } = formData.value
    const selectedSchool = rawSchoolOptions.value.find(s => s.id === school)

    if (!selectedSchool) {
      toast.error('未找到学校信息')
      return
    }

    const params: Students.ReqPostPublicStudentApi = {
      schoolId: +school,
      tenantId: +selectedSchool.tenantId,
      name: name.trim(),
    }
    if (searchType === SEARCH_TYPE.CODE)
      params.studentCode = searchValue.trim()
    else if (searchType === SEARCH_TYPE.ID_CARD)
      params.idCard = searchValue.trim()

    await axiosPostPublicStudentApi(params)

    selectedStudent.value = null
    showStudentInfoModal.value = true
  }
  catch (error) {
    console.error('搜索学生失败:', error)
    uni.showToast({
      title: '搜索失败，请重试',
      icon: 'none',
    })
  }
  finally {
    submitLoading.value = false
  }
}

// 确认绑定
async function handleConfirmBinding() {
  try {
    submitLoading.value = true

    // 调用绑定学生接口
    const result = await axiosPostBindStudentApi({
      studentId: selectedStudent.value.id,
    })

    if (result.code === 0) {
      // 如果是注册流程，需要更新用户 token
      if (unref(needBind) && result.data?.token) {
        parentStore.setNeedBind(false)
      }

      // 显示成功提示
      toast.info('绑定成功！')
      showStudentInfoModal.value = false

      await sleep(500)
      await parentStore.axiosGetStudentListByParentApi()

      // 重定向到首页
      uni.redirectTo({
        url: `${TABBAR_HOME_PATH}?role=${ROLE_TYPE.PARENT}`,
      })
    }
    else {
      throw new Error(result.msg || '绑定失败')
    }
  }
  catch (error: any) {
    console.error('绑定失败:', error)

    // 显示错误提示
    const errorMessage = error?.message || error?.data?.message || error?.msg || '绑定失败，请重试'
    uni.showToast({
      title: errorMessage,
      icon: 'none',
    })
  }
  finally {
    submitLoading.value = false
  }
}

// #endregion

// #region 生命周期钩子
async function onLoginSuccess() {
  batchRequestHandler([axiosGetSchoolsApi()])
}
// #endregion
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
    <!-- 右侧帮助按钮 -->
    <template #header-right>
      <view flex="~ row items-center justify-center" h-full gap="4">
        <Icon
          name="question-line"
          :icon-color="NAVIGATION_SUFFIX_COLOR"
          :icon-size="NAVIGATION_SUFFIX_SIZE"
          @click="showHelp"
        />
      </view>
    </template>

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
                  @change="onSchoolChange"
                />
              </Cell>

              <!-- 学生姓名输入 -->
              <Cell id="name" required label="学生姓名" prop="name">
                <wd-input
                  v-model="formData.name"
                  placeholder="请输入学生姓名"
                  :disabled="!formData.school"
                  @input="onStudentNameInput"
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
                  @input="onStudentNameInput"
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

    <!-- 绑定说明弹框 -->
    <BottomPopup v-model="showHelpModal" title="绑定说明" height="auto">
      <view p="4 b-6" text-sm color-text-secondary space-y-2>
        <view v-for="(item, index) in helpContent" :key="index" flex="~">
          <text mr-2>
            ·
          </text>
          <text flex-1>
            {{ item }}
          </text>
        </view>
      </view>
    </BottomPopup>

    <!-- 学生信息弹框 -->
    <BottomPopup v-model="showStudentInfoModal" title="学生列表" height="auto">
      <!-- 未找到学生 -->
      <wd-status-tip
        v-if="searchResult.type === 'notFound'"
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
            <RoleAvatar type="student" m="l-3" />

            <!-- Info -->
            <view m="l-3" flex="1">
              <view text="base" font="medium" color="text-primary">
                {{ student.name }}
                <text text="sm" color="text-secondary" m="l-1">
                  ({{ student.studentCode }})
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
