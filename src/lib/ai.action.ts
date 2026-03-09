import { ROOMIFY_RENDER_PROMPT } from './constants'

export async function fetchAsDataURL(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('FileReader error'))
    reader.readAsDataURL(blob)
  })
}

export async function generate3DView({ sourceImage }: Generate3DViewParams): Promise<{
  renderedImage: string | null
  renderedPath?: string
}> {
  // Ensure we have a data URL
  const dataUrl = sourceImage.startsWith('data:')
    ? sourceImage
    : await fetchAsDataURL(sourceImage)

  const base64Data = dataUrl.split(',')[1]
  const mimeType = dataUrl.split(';')[0].split(':')[1]

  if (!mimeType || !base64Data) {
    throw new Error('Invalid source image payload')
  }

  const response = await puter.ai.txt2img(ROOMIFY_RENDER_PROMPT, {
    provider: 'google',
    model: 'gemini-2.0-flash-preview-image-generation',
    input_image: base64Data,
    input_image_type: mimeType,
    ratio: { width: 1024, height: 1024 },
  })

  const rawUrl: string | null =
    response instanceof HTMLImageElement ? response.src : response?.src ?? null

  if (!rawUrl) {
    return { renderedImage: null, renderedPath: undefined }
  }

  const renderedImage = rawUrl.startsWith('data:')
    ? rawUrl
    : await fetchAsDataURL(rawUrl)

  return { renderedImage, renderedPath: undefined }
}
