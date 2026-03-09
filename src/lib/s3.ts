import { invokeCommand } from '@/lib/tauri'

export interface S3Config {
  bucket_name: string
  region: string
  access_key_id: string
  secret_access_key: string
  endpoint_url?: string
  path_prefix?: string
}

export async function loadS3Config() {
  return invokeCommand<S3Config | null>('load_s3_config')
}

export async function saveS3Config(config: S3Config) {
  return invokeCommand('save_s3_config', { config })
}

export async function deleteS3Config() {
  return invokeCommand('delete_s3_config')
}

export async function uploadImageToS3(fileName: string, fileData: Uint8Array) {
  return invokeCommand<string>('upload_image_to_s3', {
    fileName,
    fileData: Array.from(fileData),
  })
}
