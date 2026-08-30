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
/** 学校搜索关键词（输入框显示值） */
const schoolKeyword = ref('')
/** 学校模糊搜索结果 */
const schoolSearchResult = ref<any[]>([])
/** 学校下拉是否展开 */
const showSchoolDropdown = ref(false)
/** 学校搜索中 */
const schoolSearching = ref(false)
/** 已选中的学校（含 tenantId 等，供搜索学生用） */
const selectedSchool = ref<any | null>(null)
/** 学校搜索关键词最小长度（少于此长度不请求，防止全量泄露） */
const SCHOOL_KEYWORD_MIN = 2
/** 防抖定时器 */
let schoolSearchTimer: ReturnType<typeof setTimeout> | null = null

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

/** 按关键词模糊搜索学校（少于 SCHOOL_KEYWORD_MIN 字不请求，防止全量泄露） */
async function axiosSearchSchoolsApi(keyword: string) {
  const name = keyword.trim()
  if (name.length < SCHOOL_KEYWORD_MIN) {
    schoolSearchResult.value = []
    showSchoolDropdown.value = false
    return
  }
  try {
    schoolSearching.value = true
    const result = await getSchoolsApi({ name, page: 1, pageSize: 20 })
    if (result.code === 0 && result.data?.schools) {
      schoolSearchResult.value = result.data.schools
    } else {
      schoolSearchResult.value = []
    }
    showSchoolDropdown.value = true
  } catch (error) {
    console.error('搜索学校', error)
    schoolSearchResult.value = []
    showSchoolDropdown.value = true
  } finally {
    schoolSearching.value = false
  }
}

/** 学校关键词输入（防抖触发模糊搜索） */
function handleSchoolKeywordInput() {
  // 输入变化即视为未选中，清空已选与后续步骤
  if (selectedSchool.value) {
    selectedSchool.value = null
    formData.value.school = ''
    formData.value.name = ''
    formData.value.searchValue = ''
    hideSearchResult()
  }
  if (schoolSearchTimer) clearTimeout(schoolSearchTimer)
  schoolSearchTimer = setTimeout(() => {
    axiosSearchSchoolsApi(schoolKeyword.value)
  }, 400)
}

/** 选择某个学校 */
function handleSelectSchool(school: any) {
  selectedSchool.value = school
  formData.value.school = school.id
  schoolKeyword.value = school.name
  showSchoolDropdown.value = false
  schoolSearchResult.value = []
  // 切换学校后重置后续输入
  formData.value.name = ''
  formData.value.searchValue = ''
  hideSearchResult()
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
    const chosenSchool = selectedSchool.value

    if (!chosenSchool || !school) {
      toast.show('请先搜索并选择学校')
      return
    }

    const params: Students.ReqPostPublicStudentApi = {
      schoolId: +school,
      tenantId: +(chosenSchool.tenantId ?? chosenSchool.tenantID),
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

/** 登录成功处理（不再全量拉取学校，改为用户输入关键词后按需模糊搜索） */
async function onLoginSuccess() {
  pageLoading.value = false
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
              <!-- 学校搜索：输入关键词模糊查询，从结果中选择（不全量展示，防泄露） -->
              <Cell id="school" required label="学校" prop="school">
                <view class="school-search">
                  <wd-input
                    v-model="schoolKeyword"
                    placeholder="请输入学校名称搜索"
                    clearable
                    @input="handleSchoolKeywordInput"
                    @clear="handleSchoolKeywordInput"
                  />
                  <!-- 搜索结果下拉 -->
                  <view v-if="showSchoolDropdown" class="school-dropdown">
                    <view v-if="schoolSearching" class="school-dropdown-tip">
                      搜索中...
                    </view>
                    <template v-else-if="schoolSearchResult.length">
                      <view
                        v-for="school in schoolSearchResult"
                        :key="school.id"
                        class="school-dropdown-item"
                        @click="handleSelectSchool(school)"
                      >
                        {{ school.name }}
                      </view>
                    </template>
                    <view v-else class="school-dropdown-tip">
                      未找到相关学校
                    </view>
                  </view>
                </view>
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

<style lang="scss" scoped>
.school-search {
  position: relative;
  width: 100%;
}

.school-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  z-index: 10;
  max-height: 480rpx;
  margin-top: 8rpx;
  overflow-y: auto;
  background: #fff;
  border: 1rpx solid #ebedf0;
  border-radius: 12rpx;
  box-shadow: 0 8rpx 24rpx rgb(0 0 0 / 8%);
}

.school-dropdown-item {
  padding: 22rpx 24rpx;
  font-size: 28rpx;
  color: #323233;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: #f7f8fa;
  }
}

.school-dropdown-tip {
  padding: 24rpx;
  font-size: 26rpx;
  color: #969799;
  text-align: center;
}
</style>
