'use client'

import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'

export interface S3Config {
  bucket_name: string
  region: string
  access_key_id: string
  secret_access_key: string
  endpoint_url?: string
  path_prefix?: string
}

export function useS3Config() {
  const [config, setConfig] = useState<S3Config | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadConfig = async () => {
    setLoading(true)
    try {
      const configData = await invoke<S3Config | null>('load_s3_config')
      setConfig(configData)
      setError(null)
    } catch (err) {
      setError(err as string)
    } finally {
      setLoading(false)
    }
  }

  const hasConfig = () => {
    return config !== null
  }

  const uploadImage = async (fileName: string, fileData: ArrayBuffer): Promise<string> => {
    try {
      const url = await invoke<string>('upload_image_to_s3', {
        fileName,
        fileData: Array.from(new Uint8Array(fileData)),
      })
      return url
    } catch (err) {
      throw new Error(err as string)
    }
  }

  useEffect(() => {
    loadConfig()
  }, [])

  return {
    config,
    loading,
    error,
    hasConfig,
    uploadImage,
    reloadConfig: loadConfig,
  }
}
