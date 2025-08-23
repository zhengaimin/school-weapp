import {
  ADD_CIRCLE_LINE,
  ARROW_DOWN_S_LINE,
  ARROW_LEFT_LINE,
  ARROW_LEFT_RIGHT_FILL,
  ARROW_RIGHT_S_LINE,
  ARROW_UP_S_LINE,
  CHECK_LINE,
  CHECKBOX_CIRCLE_LINE,
  CLOSE_CIRCLE_LINE,
  DELETE_BIN_LINE,
  EDIT_LINE,
  ERROR_WARNING_LINE,
  FEEDBACK_LINE,
  FILE_COPY_LINE,
  FILE_LIST_3_LINE,
  HEART_3_LINE,
  HISTORY_LINE,
  INFORMATION_LINE,
  LANDSCAPE_AI_LINE,
  MONEY_CNY_CIRCLE_LINE,
  PARENT_LINE,
  QUESTION_LINE,
  REFUND_2_LINE,
  SEARCH_LINE,
  SETTINGS_3_LINE,
  SHIELD_CHECK_LINE,
  SMARTPHONE_LINE,
  STOP_CIRCLE_LINE,
  TABLET_LINE,
  TIME_LINE,
  UPLOAD_2_LINE,
  USER_5_LINE,
  USER_ADD_LINE,
  USER_LINE,
  USER_SETTINGS_LINE,
  USER_SMILE_LINE,
  WALLET_3_LINE,
} from './modules'

const svgMap = {
  // arrows
  'arrow-left-right-fill': ARROW_LEFT_RIGHT_FILL,
  'arrow-right-s-line': ARROW_RIGHT_S_LINE,
  'arrow-left-line': ARROW_LEFT_LINE,
  'arrow-down-s-line': ARROW_DOWN_S_LINE,
  'arrow-up-s-line': ARROW_UP_S_LINE,

  // business

  // communication
  'feedback-line': FEEDBACK_LINE,

  // document
  'file-list-3-line': FILE_LIST_3_LINE,
  'file-copy-line': FILE_COPY_LINE,

  // design
  'edit-line': EDIT_LINE,

  // device
  'smartphone-line': SMARTPHONE_LINE,
  'tablet-line': TABLET_LINE,

  // media
  'stop-circle-line': STOP_CIRCLE_LINE,
  'landscape-ai-line': LANDSCAPE_AI_LINE,

  // finance
  'refund-2-line': REFUND_2_LINE,
  'wallet-3-line': WALLET_3_LINE,
  'money-cny-circle-line': MONEY_CNY_CIRCLE_LINE,

  // health
  'heart-3-line': HEART_3_LINE,

  // system
  'add-circle-line': ADD_CIRCLE_LINE,
  'error-warning-line': ERROR_WARNING_LINE,
  'information-line': INFORMATION_LINE,
  'settings-3-line': SETTINGS_3_LINE,
  'history-line': HISTORY_LINE,
  'checkbox-circle-line': CHECKBOX_CIRCLE_LINE,
  'close-circle-line': CLOSE_CIRCLE_LINE,
  'check-line': CHECK_LINE,
  'upload-2-line': UPLOAD_2_LINE,
  'search-line': SEARCH_LINE,
  'time-line': TIME_LINE,
  'shield-check-line': SHIELD_CHECK_LINE,
  'question-line': QUESTION_LINE,
  'delete-bin-line': DELETE_BIN_LINE,

  // user
  'user-settings-line': USER_SETTINGS_LINE,
  'parent-line': PARENT_LINE,
  'user-5-line': USER_5_LINE,
  'user-smile-line': USER_SMILE_LINE,
  'user-add-line': USER_ADD_LINE,
  'user-line': USER_LINE,
}

export function loadSvg(name: string, color: string) {
  try {
    const svg = svgMap[name] || ''

    if (!svg) {
      console.error(`缺少 ${name} 图标，请引入`)
      return ''
    }

    const _svg = svg.replace('currentColor', color)

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(_svg)}`
  }
  catch (error) {
    console.error('加载图标失败:', name, error)
  }
}
