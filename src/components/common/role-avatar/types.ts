// Avatar 组件相关类型定义

// 定义头像的类型
export type AvatarType = 'parent' | 'teacher' | 'student'

// 定义头像的尺寸
export type AvatarSize = 'small' | 'medium' | 'large'

// 组件属性接口
export interface AvatarProps {
  /**
   * 头像类型，用于显示默认图标
   * @default 'student'
   */
  type?: AvatarType
  /**
   * 图片地址，如果提供，将优先显示图片
   */
  src?: string
  /**
   * 头像尺寸
   * @default 'medium'
   */
  size?: AvatarSize
  /**
   * 自定义样式
   */
  customStyle?: string
  /**
   * 自定义类名
   */
  customClass?: string
}
