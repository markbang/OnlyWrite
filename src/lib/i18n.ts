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
      efficiencyTitle: 'Efficiency-first design',
      efficiencyScanTitle: 'Fast navigation',
      efficiencyScanBody: 'Folder browsing, split preview, and a focused editor toolbar.',
      efficiencySafeTitle: 'Reliable saving',
      efficiencySafeBody: 'Manual save, autosave, and quick restore whenever you need it.',
      efficiencyCrossTitle: 'Desktop-first',
      efficiencyCrossBody: 'Built for Tauri with a lightweight Solid interface.',
    },
    actions: {
      selectFolder: 'Select folder',
      switchFolder: 'Switch folder',
      refresh: 'Refresh',
      checkUpdates: 'Check updates',
      checking: 'Checking...',
      language: 'Language',
      theme: 'Theme',
      switchToDark: 'Switch to dark theme',
      switchToLight: 'Switch to light theme',
      edit: 'Edit',
      render: 'Render',
      split: 'Split',
      save: 'Save',
      saving: 'Saving...',
      restore: 'Restore',
      cancel: 'Cancel',
      delete: 'Delete',
      close: 'Close',
      learnMore: 'Learn more',
      dashboard: 'Dashboard',
      home: 'Home',
    },
    file: {
      folderLabel: 'Folder',
      noFolder: 'No folder selected',
      filesCount: '{count} files',
      newFile: 'New',
      newFileContent: 'Start writing...',
      emptyFolder: 'Folder is empty',
      chooseFolder: 'Select a folder to begin',
      chooseFolderDesktop: 'Folder access is available in the Tauri desktop app.',
      created: 'File created',
      createFailed: 'Failed to create file.',
      loadFailed: 'Failed to load files.',
      loading: 'Loading files...',
      retry: 'Retry',
    },
    editor: {
      untitled: 'Untitled',
      saved: 'Saved',
      unsaved: 'Unsaved',
      loading: 'Loading...',
      loadingFile: 'Loading file...',
      wordCount: '{count} words',
      notSavedToDisk: 'Not saved to disk',
      placeholder: 'Start writing...',
      previewEmpty: 'Nothing to render yet.',
      saveFailed: 'Failed to save file.',
      savedToast: 'File saved.',
      restoreFailed: 'Failed to restore file.',
      restored: 'File restored.',
      loadFailed: 'Failed to load file.',
      autosave: 'Autosave enabled',
      autosaveOff: 'Autosave off',
      toolbarHeading: 'Heading',
      toolbarBold: 'Bold',
      toolbarItalic: 'Italic',
      toolbarQuote: 'Quote',
      toolbarCode: 'Code block',
      toolbarLink: 'Link',
      toolbarImage: 'Image',
      linkPrompt: 'Enter a link URL',
      imageInserted: 'Image inserted.',
      imageFailed: 'Failed to insert image.',
      imageNeedsWorkspace: 'Select a workspace folder or configure S3 first.',
      placeholderBold: 'bold text',
      placeholderItalic: 'italic text',
      placeholderQuote: 'quote',
      placeholderCode: 'code',
      placeholderHeading: 'Heading',
      placeholderLink: 'link text',
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
      shortcutSave: 'Ctrl + S saves instantly',
      viewModes: 'Switch between Edit / Render / Split',
      restoreHint: 'Restore reloads the last saved version',
      lastSaved: 'Last saved {time}',
    },
    dashboard: {
      welcome: 'Welcome back!',
      welcomeSubtitle: 'A quick look at your current workspace',
      createNew: 'Create New',
      totalFiles: 'Total Files',
      totalFolders: 'Open Folders',
      recentActivity: 'Recent Files',
      streak: 'Autosave',
      recentFiles: 'Recent Files',
      recentFilesDesc: 'Continue where you left off',
      quickActions: 'Quick Actions',
      quickActionsDesc: 'Fast access to common tasks',
      newDocument: 'New Document',
      newDocumentDesc: 'Go back to the editor and start a new note',
      openFolder: 'Open Folder',
      openFolderDesc: 'Choose a workspace folder in the desktop app',
      editorHome: 'Editor Home',
      editorHomeDesc: 'Return to the main writing workspace',
      settings: 'S3 Settings',
      settingsDesc: 'Manage image upload storage',
      proFeatureTitle: 'Solid desktop migration',
      proFeatureDesc: 'This dashboard now runs on Solid + Vite and stays compatible with Tauri desktop flows.',
      learnMore: 'Learn More',
      noRecentFiles: 'No recent files yet.',
      openInEditor: 'Open in editor',
    },
    s3: {
      title: 'S3 Configuration',
      description: 'Configure S3-compatible storage for image uploads.',
      bucketName: 'Bucket Name',
      region: 'Region',
      accessKeyId: 'Access Key ID',
      secretAccessKey: 'Secret Access Key',
      endpointUrl: 'Endpoint URL',
      endpointHint: 'Leave empty for AWS S3. Use this for MinIO, Wasabi, and other compatible services.',
      pathPrefix: 'Path Prefix',
      pathPrefixHint: 'Optional folder path inside the bucket.',
      saved: 'S3 configuration saved.',
      deleted: 'S3 configuration deleted.',
      required: 'Please fill in all required fields.',
      saveAction: 'Save Configuration',
      deleteAction: 'Delete Configuration',
      confirmDelete: 'Delete the current S3 configuration?',
    },
    system: {
      desktopOnly: 'This feature is only available in the Tauri desktop app.',
      latestVersion: 'You are already on the latest version.',
      updateReady: 'Update {version} is available. Install it now?',
      updateInstalled: 'Update installed. The app will relaunch.',
      noRoot: 'The app root element was not found.',
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
      efficiencyTitle: '效率优先设计',
      efficiencyScanTitle: '快速定位',
      efficiencyScanBody: '文件浏览、分屏预览和更轻量的编辑工具栏。',
      efficiencySafeTitle: '可靠保存',
      efficiencySafeBody: '支持手动保存、自动保存和快速恢复。',
      efficiencyCrossTitle: '桌面优先',
      efficiencyCrossBody: '基于 Tauri 的 Solid 桌面写作界面。',
    },
    actions: {
      selectFolder: '选择文件夹',
      switchFolder: '切换文件夹',
      refresh: '刷新',
      checkUpdates: '检查更新',
      checking: '检查中...',
      language: '语言',
      theme: '主题',
      switchToDark: '切换到深色主题',
      switchToLight: '切换到浅色主题',
      edit: '编辑',
      render: '预览',
      split: '分屏',
      save: '保存',
      saving: '保存中...',
      restore: '恢复',
      cancel: '取消',
      delete: '删除',
      close: '关闭',
      learnMore: '了解更多',
      dashboard: '仪表盘',
      home: '主页',
    },
    file: {
      folderLabel: '文件夹',
      noFolder: '未选择文件夹',
      filesCount: '{count} 个文件',
      newFile: '新建',
      newFileContent: '开始写作...',
      emptyFolder: '文件夹为空',
      chooseFolder: '请选择一个文件夹开始使用',
      chooseFolderDesktop: '文件夹访问仅在 Tauri 桌面应用中可用。',
      created: '文件已创建',
      createFailed: '创建文件失败。',
      loadFailed: '加载文件失败。',
      loading: '正在加载文件列表...',
      retry: '重试',
    },
    editor: {
      untitled: '未命名文档',
      saved: '已保存',
      unsaved: '未保存',
      loading: '加载中...',
      loadingFile: '正在加载文件...',
      wordCount: '{count} 字',
      notSavedToDisk: '尚未保存到磁盘',
      placeholder: '开始写作...',
      previewEmpty: '暂无可预览内容。',
      saveFailed: '保存文件失败。',
      savedToast: '文件已保存。',
      restoreFailed: '恢复文件失败。',
      restored: '文件已恢复。',
      loadFailed: '加载文件失败。',
      autosave: '自动保存已开启',
      autosaveOff: '自动保存已关闭',
      toolbarHeading: '标题',
      toolbarBold: '加粗',
      toolbarItalic: '斜体',
      toolbarQuote: '引用',
      toolbarCode: '代码块',
      toolbarLink: '链接',
      toolbarImage: '图片',
      linkPrompt: '请输入链接地址',
      imageInserted: '图片已插入。',
      imageFailed: '插入图片失败。',
      imageNeedsWorkspace: '请先选择工作区文件夹或配置 S3。',
      placeholderBold: '加粗文本',
      placeholderItalic: '斜体文本',
      placeholderQuote: '引用内容',
      placeholderCode: '代码内容',
      placeholderHeading: '标题',
      placeholderLink: '链接文本',
    },
    login: {
      title: '登录 OnlyWrite',
      subtitle: '登录后可同步文档和设置',
      apple: '使用 Apple 登录',
      google: '使用 Google 登录',
      orEmail: '或使用邮箱登录',
      email: '邮箱',
      password: '密码',
      forgot: '忘记密码？',
      login: '登录',
      noAccount: '还没有账号？',
      signup: '注册',
      terms: '点击继续即表示你同意我们的 ',
      termsLink: '服务条款',
      privacyLink: '隐私政策',
      termsJoin: ' 和 ',
      termsEnd: '。',
    },
    status: {
      version: '版本',
      year: '© {year} OnlyWrite',
      shortcutSave: 'Ctrl + S 立即保存',
      viewModes: '可切换 编辑 / 预览 / 分屏',
      restoreHint: '恢复会重新载入最近一次保存内容',
      lastSaved: '最近保存于 {time}',
    },
    dashboard: {
      welcome: '欢迎回来！',
      welcomeSubtitle: '快速查看当前工作区状态',
      createNew: '创建新文档',
      totalFiles: '文件总数',
      totalFolders: '已打开文件夹',
      recentActivity: '最近文件',
      streak: '自动保存',
      recentFiles: '最近文件',
      recentFilesDesc: '继续上次未完成的写作',
      quickActions: '快捷操作',
      quickActionsDesc: '快速访问常用功能',
      newDocument: '新建文档',
      newDocumentDesc: '回到编辑器创建新的笔记',
      openFolder: '打开文件夹',
      openFolderDesc: '在桌面应用里选择工作区文件夹',
      editorHome: '返回编辑器',
      editorHomeDesc: '回到主写作工作区',
      settings: 'S3 设置',
      settingsDesc: '管理图片上传存储',
      proFeatureTitle: 'Solid 桌面迁移完成',
      proFeatureDesc: '当前仪表盘已切换到 Solid + Vite，同时保留 Tauri 桌面工作流。',
      learnMore: '了解更多',
      noRecentFiles: '暂时没有最近文件。',
      openInEditor: '在编辑器中打开',
    },
    s3: {
      title: 'S3 配置',
      description: '配置兼容 S3 的图片上传存储。',
      bucketName: 'Bucket 名称',
      region: '区域',
      accessKeyId: 'Access Key ID',
      secretAccessKey: 'Secret Access Key',
      endpointUrl: 'Endpoint URL',
      endpointHint: 'AWS S3 可留空；MinIO、Wasabi 等兼容服务请填写。',
      pathPrefix: '路径前缀',
      pathPrefixHint: '可选，上传到 bucket 内部的子目录。',
      saved: 'S3 配置已保存。',
      deleted: 'S3 配置已删除。',
      required: '请填写所有必填项。',
      saveAction: '保存配置',
      deleteAction: '删除配置',
      confirmDelete: '确定删除当前 S3 配置吗？',
    },
    system: {
      desktopOnly: '该功能仅在 Tauri 桌面应用中可用。',
      latestVersion: '当前已经是最新版本。',
      updateReady: '发现新版本 {version}，现在安装吗？',
      updateInstalled: '更新已安装，应用即将重启。',
      noRoot: '未找到应用根节点。',
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

  const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null
  if (stored === 'en' || stored === 'zh') return stored

  const languages = window.navigator.languages ?? [window.navigator.language]
  const hasZh = languages.some((language) =>
    language.toLowerCase().startsWith('zh')
  )

  return hasZh ? 'zh' : 'en'
}

export function persistLocale(locale: Locale) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, locale)
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
