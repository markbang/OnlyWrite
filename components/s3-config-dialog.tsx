'use client'

import React, { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { toast } from 'sonner'

interface S3Config {
  bucket_name: string
  region: string
  access_key_id: string
  secret_access_key: string
  endpoint_url?: string
  path_prefix?: string
}

interface S3ConfigDialogProps {
  trigger?: React.ReactNode
  onConfigSaved?: () => void
}

export function S3ConfigDialog({ trigger, onConfigSaved }: S3ConfigDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasConfig, setHasConfig] = useState(false)
  const [formData, setFormData] = useState<S3Config>({
    bucket_name: '',
    region: 'us-east-1',
    access_key_id: '',
    secret_access_key: '',
    endpoint_url: '',
    path_prefix: '',
  })

  const loadConfig = async () => {
    try {
      const config = await invoke<S3Config | null>('load_s3_config')
      if (config) {
        setFormData(config)
        setHasConfig(true)
      } else {
        setHasConfig(false)
      }
    } catch (error) {
      console.error('Failed to load S3 config:', error)
    }
  }

  useEffect(() => {
    if (open) {
      loadConfig()
    }
  }, [open])

  const handleSave = async () => {
    if (!formData.bucket_name || !formData.region || !formData.access_key_id || !formData.secret_access_key) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      await invoke('save_s3_config', { config: formData })
      toast.success('S3 configuration saved successfully')
      setHasConfig(true)
      onConfigSaved?.()
      setOpen(false)
    } catch (error) {
      toast.error(`Failed to save S3 config: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete the S3 configuration?')) {
      return
    }

    setLoading(true)
    try {
      await invoke('delete_s3_config')
      toast.success('S3 configuration deleted')
      setHasConfig(false)
      setFormData({
        bucket_name: '',
        region: 'us-east-1',
        access_key_id: '',
        secret_access_key: '',
        endpoint_url: '',
        path_prefix: '',
      })
      onConfigSaved?.()
    } catch (error) {
      toast.error(`Failed to delete S3 config: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof S3Config, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>S3 Configuration</DialogTitle>
          <DialogDescription>
            Configure your S3-compatible storage for automatic image uploads.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="bucket-name">Bucket Name *</Label>
            <Input
              id="bucket-name"
              value={formData.bucket_name}
              onChange={(e) => handleInputChange('bucket_name', e.target.value)}
              placeholder="my-bucket"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="region">Region *</Label>
            <Input
              id="region"
              value={formData.region}
              onChange={(e) => handleInputChange('region', e.target.value)}
              placeholder="us-east-1"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="access-key-id">Access Key ID *</Label>
            <Input
              id="access-key-id"
              value={formData.access_key_id}
              onChange={(e) => handleInputChange('access_key_id', e.target.value)}
              placeholder="AKIAIOSFODNN7EXAMPLE"
              type="password"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="secret-access-key">Secret Access Key *</Label>
            <Input
              id="secret-access-key"
              value={formData.secret_access_key}
              onChange={(e) => handleInputChange('secret_access_key', e.target.value)}
              placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
              type="password"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="endpoint-url">
              Endpoint URL <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="endpoint-url"
              value={formData.endpoint_url || ''}
              onChange={(e) => handleInputChange('endpoint_url', e.target.value)}
              placeholder="https://s3.amazonaws.com"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for AWS S3. Use this for S3-compatible services like MinIO, Wasabi, etc.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="path-prefix">
              Path Prefix <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="path-prefix"
              value={formData.path_prefix || ''}
              onChange={(e) => handleInputChange('path_prefix', e.target.value)}
              placeholder="images/blog"
            />
            <p className="text-xs text-muted-foreground">
              Uploads will be stored under this prefix in the bucket
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {hasConfig && (
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              Delete Configuration
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
