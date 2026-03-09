import { HOSTING_CONFIG_KEY, createHostingSlug, getHostedURL, getImageExtension, fetchBlobFromURL } from './utils'

export const getOrCreateHostingConfig = async (): Promise<HostingConfig | null> => {
  try {
    let existing: HostingConfig | null = null
    try {
      existing = await puter.kv.get(HOSTING_CONFIG_KEY) as HostingConfig | null
    } catch {}

    if (existing?.subdomain) return { subdomain: existing.subdomain }

    const subdomain = createHostingSlug()
    try {
      await puter.hosting.create(subdomain, '.')
    } catch {}

    const record: HostingConfig = { subdomain }
    await puter.kv.set(HOSTING_CONFIG_KEY, record)
    return record
  } catch (e) {
    console.warn('Failed creating hosting config', e)
    return null
  }
}

export const uploadImageToHosting = async ({
  hosting,
  url,
  projectId,
  label,
}: StoreHostedImageParams): Promise<HostedAsset | null> => {
  try {
    if (!hosting || !url) return null

    // Check if already hosted
    if (url.startsWith('https://') && url.includes(hosting.subdomain)) {
      return { url }
    }

    let blob: Blob
    let contentType: string

    if (url.startsWith('data:')) {
      const res = await fetch(url)
      blob = await res.blob()
      contentType = blob.type
    } else {
      const result = await fetchBlobFromURL(url)
      if (!result) return null
      blob = result.blob
      contentType = result.contentType
    }

    const ext = getImageExtension(contentType, url)
    const dir = `projects/${projectId}`
    const filePath = `${dir}/${label}.${ext}`
    const uploadFile = new File([blob], `${label}.${ext}`, { type: contentType })

    try {
      await puter.fs.mkdir(dir, { createMissingParents: true })
    } catch {}

    await puter.fs.write(filePath, uploadFile)

    const hostedURL = getHostedURL(hosting.subdomain, filePath)
    return { url: hostedURL }
  } catch (e) {
    console.warn('Failed to store hosted image', e)
    return null
  }
}
