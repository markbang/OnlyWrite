import { onCleanup, onMount, ParentProps } from 'solid-js'
import { useI18n } from '@/components/i18n-provider'
import { ToastViewport } from '@/components/toast-viewport'

export default function RootLayout(props: ParentProps) {
  const { t } = useI18n()

  onMount(() => {
    const timer = window.setTimeout(() => {
      document.body.classList.remove('preload')
    }, 100)

    onCleanup(() => window.clearTimeout(timer))
  })

  return (
    <>
      <a href="#main-content" class="skip-to-content">
        {t('a11y.skipToContent')}
      </a>
      <div id="aria-live-region" aria-live="polite" aria-atomic="true" class="sr-only" />
      <div id="aria-live-assertive" aria-live="assertive" aria-atomic="true" class="sr-only" />
      <main id="main-content">{props.children}</main>
      <ToastViewport />
    </>
  )
}
