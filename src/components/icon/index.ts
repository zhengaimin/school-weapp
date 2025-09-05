import {
  ADD_CIRCLE_LINE,
  ADD_LINE,
  ALARM_WARNING_FILL,
  ALARM_WARNING_LINE,
  ARROW_DOWN_S_LINE,
  ARROW_LEFT_LINE,
  ARROW_LEFT_RIGHT_FILL,
  ARROW_RIGHT_S_LINE,
  ARROW_UP_S_LINE,
  BILL_LINE,
  CHECK_LINE,
  CHECKBOX_CIRCLE_LINE,
  CLOSE_CIRCLE_LINE,
  COUPON_LINE,
  DELETE_BIN_LINE,
  EDIT_LINE,
  ERROR_WARNING_LINE,
  FEEDBACK_LINE,
  FILE_COPY_LINE,
  FILE_LIST_3_LINE,
  FORBID_LINE,
  HEART_3_LINE,
  HISTORY_LINE,
  HOME_3_LINE,
  INFORMATION_LINE,
  KEYBOARD_LINE,
  LANDSCAPE_AI_LINE,
  LOCK_LINE,
  LOCK_UNLOCK_LINE,
  MESSAGE_3_LINE,
  MONEY_CNY_CIRCLE_LINE,
  PARENT_LINE,
  PAUSE_CIRCLE_LINE,
  PLAY_CIRCLE_FILL,
  PLAY_CIRCLE_LINE,
  QUESTION_LINE,
  REFUND_2_LINE,
  REFUND_LINE,
  RESET_LEFT_LINE,
  SEARCH_LINE,
  SETTINGS_3_LINE,
  SHIELD_CHECK_LINE,
  SHOPPING_CART_LINE,
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
  VOICEPRINT_LINE,
  WALLET_3_LINE,
} from './modules'

const svgMap = {
  // arrows
  'arrow-left-right-fill': ARROW_LEFT_RIGHT_FILL,
  'arrow-right-s-line': ARROW_RIGHT_S_LINE,
  'arrow-left-line': ARROW_LEFT_LINE,
  'arrow-down-s-line': ARROW_DOWN_S_LINE,
  'arrow-up-s-line': ARROW_UP_S_LINE,

  // buildings
  'home-3-line': HOME_3_LINE,

  // business

  // communication
  'feedback-line': FEEDBACK_LINE,
  'message-3-line': MESSAGE_3_LINE,

  // document
  'file-list-3-line': FILE_LIST_3_LINE,
  'file-copy-line': FILE_COPY_LINE,
  'bill-line': BILL_LINE,

  // design
  'edit-line': EDIT_LINE,

  // device
  'smartphone-line': SMARTPHONE_LINE,
  'tablet-line': TABLET_LINE,
  'keyboard-line': KEYBOARD_LINE,

  // media
  'stop-circle-line': STOP_CIRCLE_LINE,
  'landscape-ai-line': LANDSCAPE_AI_LINE,
  'play-circle-line': PLAY_CIRCLE_LINE,
  'play-circle-fill': PLAY_CIRCLE_FILL,
  'pause-circle-line': PAUSE_CIRCLE_LINE,
  'voiceprint-line': VOICEPRINT_LINE,

  // finance
  'refund-2-line': REFUND_2_LINE,
  'wallet-3-line': WALLET_3_LINE,
  'money-cny-circle-line': MONEY_CNY_CIRCLE_LINE,
  'coupon-line': COUPON_LINE,
  'shopping-cart-line': SHOPPING_CART_LINE,
  'refund-line': REFUND_LINE,

  // health
  'heart-3-line': HEART_3_LINE,

  // system
  'add-line': ADD_LINE,
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
  'forbid-line': FORBID_LINE,
  'reset-left-line': RESET_LEFT_LINE,
  'lock-line': LOCK_LINE,
  'lock-unlock-line': LOCK_UNLOCK_LINE,
  'alarm-warning-line': ALARM_WARNING_LINE,
  'alarm-warning-fill': ALARM_WARNING_FILL,

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
