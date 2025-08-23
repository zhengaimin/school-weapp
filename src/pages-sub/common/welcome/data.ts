import type { IdentityOption } from './components/IdentityCard.vue'
import { ROLE_TYPE } from '@/constant/modules/user'

// 身份选择选项
import { TABBAR_HOME_PATH } from '@/constant/router'

// 身份选择选项
export const identityOptions: IdentityOption[] = [
  {
    id: ROLE_TYPE.PARENT,
    title: '我是家长',
    description: '有孩子在校，管理孩子账户',
    icon: 'parent-line',
    iconColor: '#44bbdd',
    iconBgColor: 'rgba(68, 187, 221, 0.1)',
    route: TABBAR_HOME_PATH,
  },
  // {
  //   id: 'teacher',
  //   title: '我是老师',
  //   description: '在学校任职，管理班级学生',
  //   icon: 'user-5-line',
  //   iconColor: '#3269dd',
  //   iconBgColor: 'rgba(50, 105, 221, 0.1)',
  //   route: PARENT_STUDENT_BIND_PATH,
  // },
]
