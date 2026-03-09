import { PROJECT_KV_PREFIX } from './constants'
import { getOrCreateHostingConfig, uploadImageToHosting } from './puter.hosting'
import { isHostedURL } from './utils'

// ---- Auth ----
export const signIn = async (): Promise<void> => {
  await puter.auth.signIn()
}

export const signOut = (): void => {
  puter.auth.signOut()
}

export const getCurrentUser = async (): Promise<any | null> => {
  try {
    return await puter.auth.getUser()
  } catch {
    return null
  }
}

// ---- Projects ----

export const createProject = async ({
  item,
  visibility = 'private',
}: CreateProjectParams): Promise<DesignItem | null> => {
  try {
    const hosting = await getOrCreateHostingConfig()

    // Upload source image
    const hostedSource = item.id && item.sourceImage
      ? await uploadImageToHosting({
          hosting: hosting!,
          url: item.sourceImage,
          projectId: item.id,
          label: 'source',
        })
      : null

    // Upload rendered image if available
    const hostedRender = item.id && item.renderedImage
      ? await uploadImageToHosting({
          hosting: hosting!,
          url: item.renderedImage,
          projectId: item.id,
          label: 'rendered',
        })
      : null

    const resolvedSource = hostedSource?.url
      ?? (isHostedURL(item.sourceImage) ? item.sourceImage : item.sourceImage)

    if (!resolvedSource) {
      console.warn('Failed to host source image, skipping save')
      return null
    }

    const resolvedRender = hostedRender?.url
      ?? (item.renderedImage && isHostedURL(item.renderedImage) ? item.renderedImage : item.renderedImage)

    const payload: DesignItem = {
      id: item.id,
      name: item.name,
      sourceImage: resolvedSource,
      renderedImage: resolvedRender ?? undefined,
      timestamp: item.timestamp,
      updatedAt: Date.now(),
      ownerId: item.ownerId,
      isPublic: visibility === 'public',
    }

    // Save to KV
    const key = `${PROJECT_KV_PREFIX}${item.id}`
    await puter.kv.set(key, JSON.stringify(payload))

    return payload
  } catch (e) {
    console.error('Failed to save project', e)
    return null
  }
}

export const getProjects = async (): Promise<DesignItem[]> => {
  try {
    const keys = await puter.kv.list(PROJECT_KV_PREFIX, true)
    if (!Array.isArray(keys)) return []
    return keys
      .map((k: any) => {
        try {
          const val = typeof k.value === 'string' ? JSON.parse(k.value) : k.value
          return val as DesignItem
        } catch {
          return null
        }
      })
      .filter(Boolean) as DesignItem[]
  } catch (e) {
    console.warn('Failed to get projects', e)
    return []
  }
}

export const getProjectById = async (id: string): Promise<DesignItem | null> => {
  try {
    const key = `${PROJECT_KV_PREFIX}${id}`
    const raw = await puter.kv.get(key)
    if (!raw) return null
    return typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch (e) {
    console.warn('Failed to get project by id', e)
    return null
  }
}
