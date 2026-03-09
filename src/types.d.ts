// ---- Auth ----
interface AuthState {
  isSignedIn: boolean
  username: string | null
  userId: string | null
}

interface AuthContext extends AuthState {
  refreshAuth: () => Promise<boolean>
  signIn: () => Promise<boolean>
  signOut: () => Promise<boolean>
}

// ---- Projects ----
interface DesignItem {
  id: string
  name: string
  sourceImage: string
  sourcePath?: string
  renderedImage?: string | null
  renderedPath?: string
  publicPath?: string
  timestamp: number
  updatedAt?: number
  ownerId?: string | null
  isPublic?: boolean
}

type ProjectStatus = 'idle' | 'uploading' | 'generating' | 'done' | 'error'

// ---- Hosting ----
interface HostingConfig {
  subdomain: string
}

interface HostedAsset {
  url: string
}

interface StoreHostedImageParams {
  hosting: HostingConfig
  url: string
  projectId: string
  label: string
}

// ---- Params ----
interface CreateProjectParams {
  item: DesignItem
  visibility?: 'public' | 'private'
}

interface Generate3DViewParams {
  sourceImage: string
}

// ---- Puter global (from CDN) ----
declare const puter: any
