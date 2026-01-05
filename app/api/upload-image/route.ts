import crypto from 'crypto'
import { NextResponse } from 'next/server'

const hash = (value: string | Buffer) =>
  crypto.createHash('sha256').update(value).digest('hex')

const hmac = (key: Buffer | string, value: string, encoding?: crypto.BinaryToTextEncoding) => {
  const result = crypto.createHmac('sha256', key).update(value).digest()
  return encoding ? result.toString(encoding) : result
}

const getSigningKey = (
  secret: string,
  dateStamp: string,
  region: string,
  service: string,
) => {
  const kDate = hmac(`AWS4${secret}`, dateStamp)
  const kRegion = hmac(kDate, region)
  const kService = hmac(kRegion, service)
  return hmac(kService, 'aws4_request')
}

const encodeKey = (key: string) =>
  encodeURIComponent(key).replace(/%2F/g, '/')

const buildS3Target = (key: string) => {
  const bucket = process.env.S3_BUCKET
  const region = process.env.S3_REGION
  const endpoint = process.env.S3_ENDPOINT
  const pathStyle = process.env.S3_PATH_STYLE === 'true'

  if (!bucket || !region) {
    throw new Error('Missing S3 configuration')
  }

  const encodedKey = encodeKey(key)

  if (!endpoint) {
    const host = `${bucket}.s3.${region}.amazonaws.com`
    const url = `https://${host}/${encodedKey}`
    return { host, url, canonicalUri: `/${encodedKey}` }
  }

  const endpointUrl = new URL(endpoint)
  if (pathStyle) {
    const canonicalUri = `/${bucket}/${encodedKey}`
    const url = new URL(canonicalUri, endpointUrl).toString()
    return { host: endpointUrl.host, url, canonicalUri }
  }

  const host = `${bucket}.${endpointUrl.host}`
  const url = new URL(`/${encodedKey}`, `${endpointUrl.protocol}//${host}`).toString()
  return { host, url, canonicalUri: `/${encodedKey}` }
}

const buildPublicUrl = (key: string) => {
  const publicBase = process.env.S3_PUBLIC_URL
  if (publicBase) {
    return `${publicBase.replace(/\/$/, '')}/${key}`
  }

  const bucket = process.env.S3_BUCKET
  const region = process.env.S3_REGION
  if (!bucket || !region) {
    throw new Error('Missing S3 bucket configuration')
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`
}

export async function POST(request: Request) {
  try {
    const accessKeyId = process.env.S3_ACCESS_KEY_ID
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
    const region = process.env.S3_REGION
    const bucket = process.env.S3_BUCKET

    if (!accessKeyId || !secretAccessKey || !region || !bucket) {
      return NextResponse.json(
        { error: 'Missing S3 configuration' },
        { status: 500 },
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const safeName = file.name.replace(/[^\w.-]/g, '-')
    const key = `uploads/${Date.now()}-${crypto.randomUUID()}-${safeName}`

    const { host, url, canonicalUri } = buildS3Target(key)
    const contentType = file.type || 'application/octet-stream'
    const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '')
    const dateStamp = amzDate.slice(0, 8)
    const payloadHash = hash(fileBuffer)

    const canonicalHeaders =
      `content-type:${contentType}\n` +
      `host:${host}\n` +
      `x-amz-content-sha256:${payloadHash}\n` +
      `x-amz-date:${amzDate}\n`
    const signedHeaders =
      'content-type;host;x-amz-content-sha256;x-amz-date'
    const canonicalRequest = [
      'PUT',
      canonicalUri,
      '',
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join('\n')

    const stringToSign = [
      'AWS4-HMAC-SHA256',
      amzDate,
      `${dateStamp}/${region}/s3/aws4_request`,
      hash(canonicalRequest),
    ].join('\n')

    const signingKey = getSigningKey(secretAccessKey, dateStamp, region, 's3')
    const signature = hmac(signingKey, stringToSign, 'hex')

    const authorizationHeader =
      `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${dateStamp}/${region}/s3/aws4_request, ` +
      `SignedHeaders=${signedHeaders}, Signature=${signature}`

    const uploadResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'content-type': contentType,
        'x-amz-content-sha256': payloadHash,
        'x-amz-date': amzDate,
        authorization: authorizationHeader,
        host,
      },
      body: fileBuffer,
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('S3 upload failed', uploadResponse.status, errorText)
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 502 },
      )
    }

    return NextResponse.json({ url: buildPublicUrl(key) })
  } catch (error) {
    console.error('S3 upload failed', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 },
    )
  }
}
