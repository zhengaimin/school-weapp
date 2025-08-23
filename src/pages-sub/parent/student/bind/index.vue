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
import { computed, ref } from 'vue'
import { useToast } from 'wot-design-uni'
import { getClassesApi, getGradesApi, getSchoolsApi } from '@/api/modules/schools'
import { postPublicStudentApi } from '@/api/modules/students'
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
import { ROLE_TYPE } from '@/constant/modules/user/role'
import { TABBAR_HOME_PATH } from '@/constant/router'
import { useForm } from '@/hooks/useForm'
import { usePage } from '@/hooks/usePage'
import { useUserStore } from '@/store/user'
import { helpContent } from './data'

defineOptions({
  options: {
    styleIsolation: 'apply-shared',
  },
})

const toast = useToast()
const userStore = useUserStore()
const { pageLoading, pageError, onLoginFail, getContentHeight } = usePage()

// 表单相关
const { formRef, submitLoading, scrollIntoView, validate, scrollToFirstError }
  = useForm('.bind-scroll')

// 表单数据
const formData = ref({
  school: '',
  tenantId: '',
  grade: '',
  class: '',
  studentName: '',
})
// 表单验证规则
const rules = {
  school: [{ required: true, message: '请选择学校' }],
  grade: [{ required: true, message: '请选择年级' }],
  class: [{ required: true, message: '请选择班级' }],
  studentName: [{ required: true, message: '请输入学生姓名' }],
}

// 搜索结果
const searchResult = ref<{
  type: 'found' | 'notFound' | null
  students?: Students.IStudentVo[]
}>({
  type: null,
})

// 选中的学生
const selectedStudent = ref<Students.IStudentVo | null>(null)
// 帮助弹框显示状态
const showHelpModal = ref(false)
// 学生信息弹框显示状态
const showStudentInfoModal = ref(false)

const rawSchoolOptions = ref<any[]>([])
const schoolOptions = ref<{ label: string, value: string | number }[]>([])
const gradeOptions = ref<{ label: string, value: string | number }[]>([])
const classOptions = ref<{ label: string, value: string | number }[]>([])

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
/** 获取年级列表 */
async function axiosGetGradesApi(schoolId: number) {
  try {
    const { code, data } = await getGradesApi(schoolId)
    if (code === 0) {
      gradeOptions.value = data?.grades?.map(item => ({
        label: item.name,
        value: item.id,
      }))
    }
  }
  catch (error) {
    console.log(error)
  }
}
/** 获取班级列表 */
async function axiosGetClassesApi(gradeId: number) {
  try {
    const { code, data } = await getClassesApi(gradeId)
    if (code === 0) {
      classOptions.value = data?.classes?.map(item => ({
        label: item.name,
        value: item.id,
      }))
    }
  }
  catch (error) {
    console.log(error)
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

const contentHeight = computed(() => {
  return getContentHeight('164rpx')
})

// 隐藏搜索结果
function hideSearchResult() {
  searchResult.value = { type: null }
}

// 学校变化处理
async function onSchoolChange(schoolId: number) {
  const selectedSchool = rawSchoolOptions.value.find(s => s.id === schoolId)
  formData.value.tenantId = selectedSchool ? selectedSchool.tenantId : ''

  console.log(formData.value)
  formData.value.grade = ''
  formData.value.class = ''
  formData.value.studentName = ''
  gradeOptions.value = []
  classOptions.value = []
  hideSearchResult()
  if (schoolId) {
    await axiosGetGradesApi(schoolId)
  }
}
// 年级变化处理
async function onGradeChange(gradeId: number) {
  formData.value.class = ''
  formData.value.studentName = ''
  classOptions.value = []
  hideSearchResult()

  if (gradeId) {
    await axiosGetClassesApi(gradeId)
  }
}
// 班级变化处理
function onClassChange() {
  formData.value.studentName = ''
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
    const { valid } = await validate(['school', 'grade', 'class', 'studentName'])
    if (!valid) {
      scrollToFirstError()
      return
    }

    submitLoading.value = true
    const { school, grade, class: className, studentName, tenantId } = formData.value

    await axiosPostPublicStudentApi({
      schoolId: +school,
      tenantId: +tenantId,
      gradeId: +grade,
      classId: +className,
      searchType: 'name',
      searchValue: studentName.trim(),
    })

    selectedStudent.value = null
    showStudentInfoModal.value = true
  }
  catch (error) {
    console.error('搜索学生失败:', error)
    toast.error('搜索失败，请重试')
  }
  finally {
    submitLoading.value = false
  }
}

// 确认绑定
async function confirmBinding() {
  if (!selectedStudent.value) {
    toast.warning('请先选择学生')
    return
  }

  try {
    submitLoading.value = true
    // 执行绑定操作
    const { code } = await getWxCode()
    if (!code) {
      toast.error('获取凭证失败，请稍后重试')
      return
    }

    const params = {
      loginCode: code,
      children: [{ studentId: selectedStudent.value.id }],
      chooseChildUserId: selectedStudent.value.id,
    }

    const regResult = await postParentRegisterApi(params)

    if (regResult.code === 0) {
      userStore.setToken(regResult.data.token)
      toast.show('绑定成功！')

      const result = await userStore.getUserInfo()
      if (result.code === 0) {
        userStore.setUserInfo(result.data)
      }
      // 跳转到首页
      // uni.redirectTo({
      //   url: `${TABBAR_HOME_PATH}?role=${ROLE_TYPE.PARENT}`,
      // })
    }
  }
  catch (error) {
    console.error('绑定失败:', error)
    toast.error('绑定失败，请稍后重试')
  }
  finally {
    submitLoading.value = false
  }
}

// 显示帮助弹框
function showHelp() {
  showHelpModal.value = true
}

async function onLoginSuccess() {
  Promise.all([axiosGetSchoolsApi()]).then((res) => {
    // 检查每个响应对象的 code 字段是否都等于 0
    const allSuccess = res.every(item => item?.code === 0)

    pageLoading.value = false
    pageError.value = allSuccess ? '' : '网络异常，请稍后重试'
  })
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

              <!-- 年级选择 -->
              <Cell id="grade" required label="年级" prop="grade">
                <Picker
                  v-model="formData.grade"
                  :options="gradeOptions"
                  title="选择年级"
                  placeholder="请选择年级"
                  :disabled="!formData.school"
                  @change="onGradeChange"
                />
              </Cell>

              <!-- 班级选择 -->
              <Cell id="class" required label="班级" prop="class">
                <Picker
                  v-model="formData.class"
                  :options="classOptions"
                  title="选择班级"
                  placeholder="请选择班级"
                  :disabled="!formData.school || !formData.grade"
                  @change="onClassChange"
                />
              </Cell>

              <!-- 学生姓名输入 -->
              <Cell id="studentName" required label="学生姓名" prop="studentName">
                <wd-input
                  v-model="formData.studentName"
                  placeholder="请输入学生姓名"
                  :disabled="!formData.class"
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
        block
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
          :class="selectedStudent?.id === student.id ? 'border-primary' : 'border-bg-muted'"
          @click="selectedStudent = student"
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
                {{ student.schoolName }} · {{ student.grade }} · {{ student.className }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <template v-if="searchResult.type === 'found'" #footer>
        <view p-4>
          <TButton
            type="primary"
            size="large"
            block
            :disabled="!selectedStudent"
            :loading="submitLoading"
            @click="confirmBinding"
          >
            绑定
          </TButton>
        </view>
      </template>
    </BottomPopup>
  </Page>
</template>
