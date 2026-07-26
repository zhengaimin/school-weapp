import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
// eslint-disable-next-line test/no-import-node-test -- 使用 Node VM 直接执行转译后的 VOIP 状态机
import test from 'node:test'
import vm from 'node:vm'

/** 当前测试文件的 CommonJS require */
const require = createRequire(import.meta.url)
/** TypeScript 编译器 */
const typescript = require('typescript')
/** 微信 VOIP 状态机源码 */
const VOIP_SOURCE = readFileSync(new URL('../src/utils/voip.ts', import.meta.url), 'utf8')
/** 可在 Node VM 中执行的 CommonJS 源码 */
const VOIP_COMMONJS_SOURCE = typescript.transpileModule(
  VOIP_SOURCE.replaceAll('import.meta.env', 'globalThis.__TEST_ENV'),
  {
    compilerOptions: {
      module: typescript.ModuleKind.CommonJS,
      target: typescript.ScriptTarget.ES2020,
    },
  },
).outputText
/** 有效的建房参数 */
const INIT_PARAMS = {
  roomType: 'voice',
  caller: { id: 'device-sn' },
  listener: { id: 'listener-open-id' },
}

/**
 * 创建隔离的 VOIP 状态机运行环境。
 * @param options WMPF 插件与 UniApp 行为开关
 * @returns 状态机导出、调用记录和可控定时器
 */
function createVoipHarness(options = {}) {
  /** 当前用例的调用记录 */
  const calls = {
    channelInvoke: [],
    channelInvokeSync: [],
    exitMiniProgram: 0,
    forceHangUp: [],
    initByCaller: 0,
    redirectTo: 0,
  }
  /** WMPF Channel 事件监听 */
  const channelListeners = new Map()
  /** 插件 VOIP 事件监听 */
  let voipEventListener
  /** 自增定时器 ID */
  let timerSequence = 0
  /** 可控定时器列表 */
  const timers = []

  /** 注册可控定时器 */
  function setControlledTimeout(callback, delayMs) {
    const timer = {
      callback,
      cleared: false,
      delayMs,
      id: ++timerSequence,
    }
    timers.push(timer)
    return timer.id
  }
  /** 清除可控定时器 */
  function clearControlledTimeout(timerId) {
    const timer = timers.find(item => item.id === timerId)
    if (timer) {
      timer.cleared = true
    }
  }
  /** 执行指定延迟的待处理定时器 */
  function runTimersByDelay(delayMs) {
    const pendingTimers = timers.filter(item => !item.cleared && item.delayMs === delayMs)
    for (const timer of pendingTimers) {
      timer.cleared = true
      timer.callback()
    }
  }
  /** 执行全部待处理定时器 */
  function runAllTimers() {
    let runCount = 0
    while (true) {
      const timer = timers.find(item => !item.cleared)
      if (!timer) {
        return
      }
      timer.cleared = true
      timer.callback()
      runCount += 1
      assert.ok(runCount < 20, '定时器执行次数异常')
    }
  }
  /** 统计指定延迟的待处理定时器 */
  function pendingTimerCount(delayMs) {
    return timers.filter(item => !item.cleared && item.delayMs === delayMs).length
  }

  /** WMPF VOIP 插件 mock */
  const plugin = {
    CALL_PAGE_PATH: 'plugin://wmpf-voip/call',
    forceHangUpVoip(roomId) {
      calls.forceHangUp.push(roomId)
    },
    getPluginEnterOptions() {
      return {}
    },
    getPluginOnloadOptions() {
      return {}
    },
    initByCaller(params) {
      calls.initByCaller += 1
      if (options.initByCaller) {
        return options.initByCaller(params)
      }
      return Promise.resolve({ isSuccess: true, roomId: 'room-id' })
    },
    onVoipEvent(listener) {
      if (options.failVoipEventBinding) {
        throw new Error('bind failed')
      }
      voipEventListener = listener
      return () => {
        voipEventListener = undefined
      }
    },
    setUIConfig() {},
  }
  /** WMPF Invoke Channel mock */
  const channel = {
    invoke(invokeOptions) {
      calls.channelInvoke.push(invokeOptions)
      invokeOptions.success?.({})
    },
    invokeSync(invokeOptions) {
      calls.channelInvokeSync.push(invokeOptions)
      return {}
    },
    off(eventName) {
      channelListeners.delete(eventName)
    },
    on(eventName, listener) {
      channelListeners.set(eventName, listener)
    },
    registerEvent(registerOptions) {
      registerOptions.success?.({})
    },
    unregisterEvent() {},
  }
  /** Node VM 沙箱 */
  const context = vm.createContext({
    __TEST_ENV: {},
    __UNI_PLATFORM__: 'mp-weixin',
    clearTimeout: clearControlledTimeout,
    console: {
      error() {},
      log() {},
      warn() {},
    },
    exports: {},
    requirePlugin() {
      return { default: plugin }
    },
    setTimeout: setControlledTimeout,
    uni: {
      exitMiniProgram() {
        calls.exitMiniProgram += 1
      },
      onAppHide() {},
      redirectTo(redirectOptions) {
        calls.redirectTo += 1
        if (options.redirectFails) {
          redirectOptions.fail?.(new Error('redirect failed'))
          return
        }
        redirectOptions.success?.()
      },
    },
    wmpf: { Channel: channel },
  })
  vm.runInContext(VOIP_COMMONJS_SOURCE, context, { filename: 'voip.ts' })

  return {
    api: context.exports,
    calls,
    emitDeviceHangup(payload) {
      channelListeners.get('deviceHangup')?.({ data: payload })
    },
    emitVoipEvent(event) {
      assert.ok(voipEventListener, 'VOIP 事件监听尚未绑定')
      voipEventListener(event)
    },
    pendingTimerCount,
    runAllTimers,
    runTimersByDelay,
  }
}

/** 统计指定 Channel command 的异步调用次数 */
function countInvokeCommand(calls, command) {
  return calls.channelInvoke.filter(item => item.command === command).length
}

/** 创建可手动结算的 Promise */
function createDeferred() {
  /** Promise resolve */
  let resolve
  /** 可手动结算的 Promise */
  const promise = new Promise((promiseResolve) => {
    resolve = promiseResolve
  })
  return { promise, resolve }
}

test('VOIP 事件监听绑定失败时禁止建房', async () => {
  const harness = createVoipHarness({ failVoipEventBinding: true })

  await assert.rejects(
    harness.api.initWmpfVoipByCaller(INIT_PARAMS, 'app-session'),
    /VOIP 通话事件监听绑定失败/,
  )
  assert.equal(harness.calls.initByCaller, 0)
})

test('立即关闭小程序时通知 App 并最终退出', async () => {
  const harness = createVoipHarness()
  await harness.api.initWmpfVoipByCaller(INIT_PARAMS, 'app-session')

  harness.api.closeVoipMiniProgram('manual_close')

  assert.equal(countInvokeCommand(harness.calls, 'voipEnded'), 1)
  assert.equal(harness.calls.exitMiniProgram, 0)
  harness.runAllTimers()
  assert.equal(countInvokeCommand(harness.calls, 'voipEnded'), 2)
  assert.equal(harness.calls.exitMiniProgram, 1)
})

test('插件正常终态时不强制挂断且会通知关闭', async () => {
  const harness = createVoipHarness()
  await harness.api.initWmpfVoipByCaller(INIT_PARAMS, 'app-session')

  harness.emitVoipEvent({ eventName: 'endVoip', data: { keepTime: 0 } })

  assert.equal(harness.calls.forceHangUp.length, 0)
  assert.equal(countInvokeCommand(harness.calls, 'voipEnded'), 1)
})

test('插件页跳转失败时返回失败结果', async () => {
  const harness = createVoipHarness({ redirectFails: true })
  await harness.api.initWmpfVoipByCaller(INIT_PARAMS, 'app-session')

  assert.equal(await harness.api.redirectToWmpfVoipCallPage(), false)
})

test('迟到的建房成功不得重新激活已结束会话', async (testContext) => {
  /** 执行迟到结果并按页面规则决定是否跳转 */
  async function settleLateInit(harness, deferred, initPromise, voipSessionId) {
    deferred.resolve({ isSuccess: true, roomId: 'late-room-id' })
    const result = await initPromise
    if (harness.api.guardVoipInitResult(voipSessionId, result)) {
      await harness.api.redirectToWmpfVoipCallPage()
    }
  }

  await testContext.test('主动关闭后返回成功', async () => {
    const deferred = createDeferred()
    const harness = createVoipHarness({ initByCaller: () => deferred.promise })
    const voipSessionId = harness.api.markVoipSessionActive(undefined, 'app-session')
    const initPromise = harness.api.initWmpfVoipByCaller(INIT_PARAMS, 'app-session')
    harness.api.closeVoipMiniProgram('manual_close')
    harness.runAllTimers()

    await settleLateInit(harness, deferred, initPromise, voipSessionId)

    assert.equal(harness.api.isVoipSessionCurrent(voipSessionId), false)
    assert.equal(harness.calls.redirectTo, 0)
    assert.deepEqual(harness.calls.forceHangUp, ['late-room-id'])
  })
  await testContext.test('插件终态后返回成功', async () => {
    const deferred = createDeferred()
    const harness = createVoipHarness({ initByCaller: () => deferred.promise })
    const voipSessionId = harness.api.markVoipSessionActive(undefined, 'app-session')
    const initPromise = harness.api.initWmpfVoipByCaller(INIT_PARAMS, 'app-session')
    harness.emitVoipEvent({ eventName: 'endVoip', data: { keepTime: 0 } })

    await settleLateInit(harness, deferred, initPromise, voipSessionId)

    assert.equal(harness.api.isVoipSessionCurrent(voipSessionId), false)
    assert.equal(harness.calls.redirectTo, 0)
    assert.deepEqual(harness.calls.forceHangUp, ['late-room-id'])
  })
  await testContext.test('设备挂断后返回成功', async () => {
    const deferred = createDeferred()
    const harness = createVoipHarness({ initByCaller: () => deferred.promise })
    const voipSessionId = harness.api.markVoipSessionActive(undefined, 'app-session')
    const initPromise = harness.api.initWmpfVoipByCaller(INIT_PARAMS, 'app-session')
    harness.api.bindDeviceHangupListener()
    harness.emitDeviceHangup({ reason: 'handset' })

    await settleLateInit(harness, deferred, initPromise, voipSessionId)

    assert.equal(harness.api.isVoipSessionCurrent(voipSessionId), false)
    assert.equal(harness.calls.redirectTo, 0)
    assert.deepEqual(harness.calls.forceHangUp, [undefined, 'late-room-id'])
  })
})
