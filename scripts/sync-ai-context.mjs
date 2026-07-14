#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

/**
 * 解析命令行参数。
 * 支持：
 * --project-root <path>
 * --target-root <path>
 * --project-name <name>
 * --commit-message <message>
 * --clean
 * --dry-run
 * --json
 * --no-auto-commit
 * --no-init-git
 */
function parseArgs(argv) {
  // 默认参数：面向本地 ai 上下文同步。
  const args = {
    projectRoot: process.cwd(),
    targetRoot: 'D:\\Code\\ai',
    projectName: '',
    clean: false,
    dryRun: false,
    json: false,
    autoCommit: true,
    initGitIfMissing: true,
    commitMessage: '',
  }

  for (let i = 0; i < argv.length; i += 1) {
    // 当前参数键。
    const key = argv[i]
    // 当前参数值。
    const value = argv[i + 1]

    // 自定义项目根目录。
    if (key === '--project-root' && value) {
      args.projectRoot = value
      i += 1
      continue
    }

    // 自定义目标根目录。
    if (key === '--target-root' && value) {
      args.targetRoot = value
      i += 1
      continue
    }

    // 自定义项目名。
    if (key === '--project-name' && value) {
      args.projectName = value
      i += 1
      continue
    }

    // 自定义提交信息。
    if (key === '--commit-message' && value) {
      args.commitMessage = value
      i += 1
      continue
    }

    // 同步前清空目标 .aimin-skill。
    if (key === '--clean') {
      args.clean = true
      continue
    }

    // 仅打印计划，不落盘。
    if (key === '--dry-run') {
      args.dryRun = true
      continue
    }

    // 使用 JSON 输出结果。
    if (key === '--json') {
      args.json = true
      continue
    }

    // 关闭自动提交。
    if (key === '--no-auto-commit') {
      args.autoCommit = false
      continue
    }

    // 目标目录缺少 git 仓库时不自动初始化。
    if (key === '--no-init-git') {
      args.initGitIfMissing = false
    }
  }

  return args
}

/**
 * 归一化项目名称。
 */
function resolveProjectName(projectRoot, projectNameArg) {
  // 显式传入优先。
  const explicitName = String(projectNameArg || '').trim()
  if (explicitName) {
    return explicitName
  }

  // 回退为项目目录名。
  return path.basename(path.resolve(projectRoot))
}

/**
 * 保证路径存在。
 */
function ensurePathExists(targetPath, label) {
  // 路径不存在直接报错。
  if (!fs.existsSync(targetPath)) {
    throw new Error(`${label} not found: ${targetPath}`)
  }
}

/**
 * 执行 git 命令。
 */
function runGit(cwd, gitArgs, allowFailure = false) {
  // 执行 git 子进程。
  const result = spawnSync('git', gitArgs, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  // 非允许失败时，任何非零退出都视为异常。
  if (result.status !== 0 && !allowFailure) {
    // 归一化错误输出。
    const stderr = String(result.stderr || '').trim()
    throw new Error(`git ${gitArgs.join(' ')} failed: ${stderr || 'unknown error'}`)
  }

  return result
}

/**
 * 判断目录是否为 git 仓库。
 */
function isGitRepo(cwd) {
  // 使用 rev-parse 快速探测仓库状态。
  const result = runGit(cwd, ['rev-parse', '--is-inside-work-tree'], true)
  return result.status === 0
}

/**
 * 确保目标目录是 git 仓库。
 */
function ensureGitRepo(cwd, initGitIfMissing) {
  // 已是仓库，直接返回。
  if (isGitRepo(cwd)) {
    return 'existing'
  }

  // 不允许自动初始化时，直接报错。
  if (!initGitIfMissing) {
    throw new Error(`target is not a git repo: ${cwd}`)
  }

  // 初始化仓库。
  runGit(cwd, ['init'])
  return 'initialized'
}

/**
 * 判断 staged 区是否存在目标文件变更。
 */
function hasStagedChanges(cwd) {
  // 仅检查 .aimin-skill 与 AGENTS.md。
  const result = runGit(cwd, ['diff', '--cached', '--quiet', '--', '.aimin-skill', 'AGENTS.md'], true)

  // 0: 无差异。
  if (result.status === 0) {
    return false
  }

  // 1: 有差异。
  if (result.status === 1) {
    return true
  }

  // 其余状态视为执行异常。
  const stderr = String(result.stderr || '').trim()
  throw new Error(`git diff --cached --quiet failed: ${stderr || 'unknown error'}`)
}

/**
 * 生成默认提交信息。
 */
function buildDefaultCommitMessage(projectName) {
  return `chore(ai-context): sync ${projectName} context`
}

/**
 * 打印文本结果。
 */
function printTextResult(result) {
  console.log('[sync-ai-context] done')
  console.log(`target: ${result.target.root}`)
  if (result.commit.enabled) {
    console.log(`[sync-ai-context] git: ${result.commit.action} (${result.commit.repoState})`)
  }
}

/**
 * 主流程。
 */
function main() {
  // 读取命令行参数。
  const args = parseArgs(process.argv.slice(2))
  // 归一化项目根目录。
  const projectRoot = path.resolve(args.projectRoot)
  // 归一化项目名。
  const projectName = resolveProjectName(projectRoot, args.projectName)

  // 源目录 .aimin-skill。
  const sourceAiminPath = path.join(projectRoot, '.aimin-skill')
  // 源文件 AGENTS.md。
  const sourceAgentsPath = path.join(projectRoot, 'AGENTS.md')
  ensurePathExists(sourceAiminPath, '.aimin-skill')
  ensurePathExists(sourceAgentsPath, 'AGENTS.md')

  // 归一化目标根目录。
  const targetRoot = path.resolve(args.targetRoot)
  // 目标项目目录。
  const targetProjectRoot = path.join(targetRoot, projectName)
  // 目标 .aimin-skill 目录。
  const targetAiminPath = path.join(targetProjectRoot, '.aimin-skill')
  // 目标 AGENTS.md 文件。
  const targetAgentsPath = path.join(targetProjectRoot, 'AGENTS.md')

  // 计划信息，用于 dry-run 或结果输出。
  const plan = {
    source: {
      aimin: sourceAiminPath,
      agents: sourceAgentsPath,
    },
    target: {
      root: targetProjectRoot,
      aimin: targetAiminPath,
      agents: targetAgentsPath,
    },
    options: {
      clean: args.clean,
      dryRun: args.dryRun,
      autoCommit: args.autoCommit,
      initGitIfMissing: args.initGitIfMissing,
    },
  }

  // dry-run 直接返回计划。
  if (args.dryRun) {
    if (args.json) {
      console.log(JSON.stringify(plan, null, 2))
    } else {
      console.log('[sync-ai-context] dry-run')
      console.log(`from: ${sourceAiminPath}`)
      console.log(`from: ${sourceAgentsPath}`)
      console.log(`to:   ${targetProjectRoot}`)
      console.log(`auto-commit: ${args.autoCommit ? 'enabled' : 'disabled'}`)
    }
    return
  }

  // 确保目标项目目录存在。
  fs.mkdirSync(targetProjectRoot, { recursive: true })

  // 需要 clean 且目标 .aimin-skill 已存在时先清理。
  if (args.clean && fs.existsSync(targetAiminPath)) {
    fs.rmSync(targetAiminPath, { recursive: true, force: true })
  }

  // 复制 .aimin-skill。
  fs.cpSync(sourceAiminPath, targetAiminPath, { recursive: true, force: true })
  // 复制 AGENTS.md。
  fs.copyFileSync(sourceAgentsPath, targetAgentsPath)

  // 基础结果对象。
  const result = {
    status: 'ok',
    ...plan,
    commit: {
      enabled: args.autoCommit,
      repo: targetProjectRoot,
      repoState: 'skipped',
      action: 'skipped',
      message: '',
    },
  }

  // 开启自动提交时，执行仓库初始化与提交。
  if (args.autoCommit) {
    result.commit.repoState = ensureGitRepo(targetProjectRoot, args.initGitIfMissing)
    runGit(targetProjectRoot, ['add', '--', '.aimin-skill', 'AGENTS.md'])

    // 仅 staged 有变更时才 commit。
    if (hasStagedChanges(targetProjectRoot)) {
      // 优先使用自定义提交信息。
      const message = args.commitMessage.trim() || buildDefaultCommitMessage(projectName)
      runGit(targetProjectRoot, ['commit', '-m', message])
      result.commit.action = 'committed'
      result.commit.message = message
    } else {
      result.commit.action = 'no_changes'
      result.commit.message = 'nothing to commit'
    }
  }

  // 输出结果。
  if (args.json) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    printTextResult(result)
  }
}

main()
