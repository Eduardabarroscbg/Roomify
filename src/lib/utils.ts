export const HOSTING_DOMAIN_SUFFIX = 'puter.site'

export const HOSTING_CONFIG_KEY = 'roomify_hosting_config'

export function createHostingSlug(): string {
  return `roomify-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function getHostedURL(subdomain: string, filePath: string): string {
  return `https://${subdomain}.${HOSTING_DOMAIN_SUFFIX}/${filePath}`
}

export function isHostedURL(url: string): boolean {
  return url.startsWith('https://') && url.includes(HOSTING_DOMAIN_SUFFIX)
}

export function getImageExtension(contentType: string, fallbackUrl?: string): string {
  if (contentType.includes('png')) return 'png'
  if (contentType.includes('webp')) return 'webp'
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg'
  if (fallbackUrl) {
    const ext = fallbackUrl.split('.').pop()?.split('?')[0]?.toLowerCase()
    if (ext && ['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return ext
  }
  return 'jpg'
}

export async function fetchBlobFromURL(url: string): Promise<{ blob: Blob; contentType: string } | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const blob = await res.blob()
    return { blob, contentType: blob.type }
  } catch {
    return null
  }
}

export async function imageURLToPNGBlob(url: string): Promise<Blob | null> {
  try {
    const result = await fetchBlobFromURL(url)
    return result?.blob ?? null
  } catch {
    return null
  }
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export function generateProjectId(): string {
  return Date.now().toString()
}
