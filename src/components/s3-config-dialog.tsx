import { Show, createEffect, createSignal, onCleanup } from 'solid-js'
import { createStore } from 'solid-js/store'
import { useI18n } from '@/components/i18n-provider'
import { Button, Input, Label } from '@/components/ui'
import { deleteS3Config, loadS3Config, saveS3Config, type S3Config } from '@/lib/s3'
import { getErrorMessage } from '@/lib/utils'
import { showConfirm } from '@/lib/tauri'
import { toast } from '@/state/toast'

interface S3ConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: () => void
}

const emptyConfig: S3Config = {
  bucket_name: '',
  region: 'us-east-1',
  access_key_id: '',
  secret_access_key: '',
  endpoint_url: '',
  path_prefix: '',
}

export function S3ConfigDialog(props: S3ConfigDialogProps) {
  const { t } = useI18n()
  const [loading, setLoading] = createSignal(false)
  const [hasConfig, setHasConfig] = createSignal(false)
  const [form, setForm] = createStore<S3Config>({ ...emptyConfig })

  createEffect(() => {
    if (!props.open) return

    void (async () => {
      try {
        const config = await loadS3Config()
        if (config) {
          setForm({ ...emptyConfig, ...config })
          setHasConfig(true)
          return
        }

        setForm({ ...emptyConfig })
        setHasConfig(false)
      } catch (error) {
        toast.error(getErrorMessage(error))
      }
    })()
  })

  createEffect(() => {
    if (!props.open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading()) {
        props.onOpenChange(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    onCleanup(() => window.removeEventListener('keydown', handleKeyDown))
  })

  const handleSave = async () => {
    if (
      !form.bucket_name ||
      !form.region ||
      !form.access_key_id ||
      !form.secret_access_key
    ) {
      toast.error(t('s3.required'))
      return
    }

    setLoading(true)
    try {
      await saveS3Config(form)
      setHasConfig(true)
      toast.success(t('s3.saved'))
      props.onSaved?.()
      props.onOpenChange(false)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = await showConfirm(t('s3.confirmDelete'), t('s3.title'))
    if (!confirmed) return

    setLoading(true)
    try {
      await deleteS3Config()
      setForm({ ...emptyConfig })
      setHasConfig(false)
      toast.success(t('s3.deleted'))
      props.onSaved?.()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Show when={props.open}>
      <div class="modal-overlay fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div class="w-full max-w-2xl border border-foreground bg-background">
          <div class="border-b border-foreground p-6">
            <div class="text-lg font-semibold">{t('s3.title')}</div>
            <p class="mt-2 text-sm text-muted-foreground">{t('s3.description')}</p>
          </div>

          <div class="grid gap-4 p-6">
            <div class="grid gap-2">
              <Label for="bucket-name">{t('s3.bucketName')} *</Label>
              <Input
                id="bucket-name"
                value={form.bucket_name}
                onInput={(event) => setForm('bucket_name', event.currentTarget.value)}
                placeholder="my-bucket"
              />
            </div>

            <div class="grid gap-2">
              <Label for="region">{t('s3.region')} *</Label>
              <Input
                id="region"
                value={form.region}
                onInput={(event) => setForm('region', event.currentTarget.value)}
                placeholder="us-east-1"
              />
            </div>

            <div class="grid gap-2">
              <Label for="access-key-id">{t('s3.accessKeyId')} *</Label>
              <Input
                id="access-key-id"
                type="password"
                value={form.access_key_id}
                onInput={(event) => setForm('access_key_id', event.currentTarget.value)}
              />
            </div>

            <div class="grid gap-2">
              <Label for="secret-access-key">{t('s3.secretAccessKey')} *</Label>
              <Input
                id="secret-access-key"
                type="password"
                value={form.secret_access_key}
                onInput={(event) => setForm('secret_access_key', event.currentTarget.value)}
              />
            </div>

            <div class="grid gap-2">
              <Label for="endpoint-url">{t('s3.endpointUrl')}</Label>
              <Input
                id="endpoint-url"
                value={form.endpoint_url || ''}
                onInput={(event) => setForm('endpoint_url', event.currentTarget.value)}
                placeholder="https://s3.amazonaws.com"
              />
              <p class="text-xs text-muted-foreground">{t('s3.endpointHint')}</p>
            </div>

            <div class="grid gap-2">
              <Label for="path-prefix">{t('s3.pathPrefix')}</Label>
              <Input
                id="path-prefix"
                value={form.path_prefix || ''}
                onInput={(event) => setForm('path_prefix', event.currentTarget.value)}
                placeholder="images/blog"
              />
              <p class="text-xs text-muted-foreground">{t('s3.pathPrefixHint')}</p>
            </div>
          </div>

          <div class="flex flex-col gap-3 border-t border-foreground p-6 sm:flex-row sm:items-center">
            <Show when={hasConfig()}>
              <Button variant="danger" onClick={handleDelete} disabled={loading()}>
                {t('s3.deleteAction')}
              </Button>
            </Show>
            <div class="flex flex-1 justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => props.onOpenChange(false)}
                disabled={loading()}
              >
                {t('actions.cancel')}
              </Button>
              <Button onClick={handleSave} disabled={loading()}>
                {loading() ? t('actions.saving') : t('s3.saveAction')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Show>
  )
}
