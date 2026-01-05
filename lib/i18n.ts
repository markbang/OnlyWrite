export type Locale = 'en' | 'zh'

type MessageTree = string | { [key: string]: MessageTree }

type MessagesByLocale = Record<Locale, MessageTree>

const STORAGE_KEY = 'onlywrite-locale'

export const messages: MessagesByLocale = {
  en: {
    app: {
      title: 'OnlyWrite',
      subtitle: 'Efficiency first · Modern writing workspace',
      welcomeTitle: 'OnlyWrite Writing Console',
      welcomeLead:
        'Focus on fast editing, quick rendering, and reliable restore. Open a workspace folder to begin.',
      efficiencyTitle: 'Efficiency-first design',
      efficiencyScanTitle: 'Fast navigation',
      efficiencyScanBody: 'File list, split preview, and a focused action bar.',
      efficiencySafeTitle: 'Safe saving',
      efficiencySafeBody: 'Autosave, manual save, and restore at any time.',
      efficiencyCrossTitle: 'Cross-platform',
      efficiencyCrossBody: 'Desktop split view with mobile file drawer.',
    },
    actions: {
      selectFolder: 'Select folder',
      switchFolder: 'Switch folder',
      openFiles: 'Files',
      checkUpdates: 'Check updates',
      checking: 'Checking...',
      language: 'Language',
      switchToDark: 'Switch to dark theme',
      switchToLight: 'Switch to light theme',
      edit: 'Edit',
      render: 'Render',
      split: 'Split',
      save: 'Save (Ctrl+S)',
      saving: 'Saving...',
      restore: 'Restore',
    },
    file: {
      folderLabel: 'Folder',
      noFolder: 'No folder selected',
      filesCount: '{count} files',
      newFile: 'New',
      newFileContent: 'Start writing...',
      emptyFolder: 'Folder is empty',
      chooseFolder: 'Select a folder to begin',
      promptName: 'Enter file name (e.g. new-note.md)',
      createFailed: 'Failed to create file: ',
      loadFailed: 'Failed to load files: ',
    },
    editor: {
      untitled: 'Untitled',
      saved: 'Saved',
      unsaved: 'Unsaved',
      wordCount: '{count} words',
      notSavedToDisk: 'Not saved to disk',
      placeholder: 'Start writing...',
      previewEmpty: 'Nothing to render yet.',
      saveFailed: 'Failed to save: ',
      restoreFailed: 'Failed to restore: ',
      autosave: 'Autosave: 5 seconds',
    },
    login: {
      title: 'Sign in to OnlyWrite',
      subtitle: 'Sign in to sync documents and settings',
      apple: 'Sign in with Apple',
      google: 'Sign in with Google',
      orEmail: 'Or sign in with email',
      email: 'Email',
      password: 'Password',
      forgot: 'Forgot your password?',
      login: 'Sign in',
      noAccount: "Don't have an account?",
      signup: 'Sign up',
      terms: 'By clicking continue, you agree to our ',
      termsLink: 'Terms of Service',
      privacyLink: 'Privacy Policy',
      termsJoin: ' and ',
      termsEnd: '.',
    },
    status: {
      version: 'Version',
      year: '© {year} OnlyWrite',
      shortcutsTitle: 'Shortcuts:',
      shortcutSave: 'Ctrl + S Save',
      viewModes: 'Views: Edit / Render / Split',
      restoreHint: 'Restore: revert to last saved state',
    },
    a11y: {
      skipToContent: 'Skip to main content',
    },
  },
  zh: {
    app: {
      title: 'OnlyWrite',
      subtitle: '效率优先 · 现代写作工作台',
      welcomeTitle: 'OnlyWrite 写作控制台',
      welcomeLead:
        '专注高效编辑、快速渲染与可恢复的写作流程。打开一个工作文件夹开始。',
      efficiencyTitle: '效率导向设计',
      efficiencyScanTitle: '快速定位',
      efficiencyScanBody: '文件列表、分屏预览、顶部动作栏。',
      efficiencySafeTitle: '安全保存',
      efficiencySafeBody: '自动保存 + 手动保存 + 恢复机制。',
      efficiencyCrossTitle: '跨平台一致',
      efficiencyCrossBody: '桌面分栏、移动抽屉式文件管理。',
    },
    actions: {
      selectFolder: '选择文件夹',
      switchFolder: '切换文件夹',
      openFiles: '文件',
      checkUpdates: '检查更新',
      checking: '检查中...',
      language: '语言',
      switchToDark: '切换到深色主题',
      switchToLight: '切换到浅色主题',
      edit: '编辑',
      render: '渲染',
      split: '分屏',
      save: '保存 (Ctrl+S)',
      saving: '保存中...',
      restore: '恢复',
    },
    file: {
      folderLabel: '文件夹',
      noFolder: '未选择文件夹',
      filesCount: '{count} 个文件',
      newFile: '新建',
      newFileContent: '开始写作...',
      emptyFolder: '文件夹为空',
      chooseFolder: '请先选择一个文件夹',
      promptName: '请输入文件名 (例如: new-note.md)',
      createFailed: '创建文件失败: ',
      loadFailed: '加载文件失败: ',
    },
    editor: {
      untitled: '未命名文档',
      saved: '已保存',
      unsaved: '未保存',
      wordCount: '{count} 字',
      notSavedToDisk: '尚未保存到磁盘',
      placeholder: '开始写作...',
      previewEmpty: '暂无内容可渲染。',
      saveFailed: '保存失败: ',
      restoreFailed: '恢复失败: ',
      autosave: '自动保存：5 秒',
    },
    login: {
      title: '登录 OnlyWrite',
      subtitle: '使用账号登录以同步文档与设置',
      apple: '使用 Apple 登录',
      google: '使用 Google 登录',
      orEmail: '或使用邮箱登录',
      email: '邮箱',
      password: '密码',
      forgot: '忘记密码？',
      login: '登录',
      noAccount: '还没有账号？',
      signup: '注册',
      terms: '点击继续即表示同意 ',
      termsLink: '服务条款',
      privacyLink: '隐私政策',
      termsJoin: ' 与 ',
      termsEnd: '。',
    },
    status: {
      version: '版本',
      year: '© {year} OnlyWrite',
      shortcutsTitle: '快捷键：',
      shortcutSave: 'Ctrl + S 保存',
      viewModes: '视图：编辑 / 渲染 / 分屏',
      restoreHint: '恢复：回到最近保存状态',
    },
    a11y: {
      skipToContent: '跳转到主要内容',
    },
  },
}

export function formatMessage(
  message: string,
  params?: Record<string, string | number>
) {
  if (!params) return message
  return message.replace(/\{(\w+)\}/g, (_, key) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`
  )
}

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
  if (stored === 'en' || stored === 'zh') return stored
  const langs = navigator.languages ?? [navigator.language]
  const hasZh = langs.some((lang) => lang.toLowerCase().startsWith('zh'))
  return hasZh ? 'zh' : 'en'
}

export function persistLocale(locale: Locale) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, locale)
}

function getNestedMessageValue(root: unknown, parts: readonly string[]): unknown {
  let current: unknown = root

  for (const part of parts) {
    if (typeof current !== 'object' || current === null) return undefined
    current = (current as Record<string, unknown>)[part]
  }

  return current
}

export function getMessage(locale: Locale, key: string) {
  const parts = key.split('.')

  const value = getNestedMessageValue(messages[locale], parts)
  if (typeof value === 'string') return value

  const fallback = getNestedMessageValue(messages.en, parts)
  return typeof fallback === 'string' ? fallback : key
}
