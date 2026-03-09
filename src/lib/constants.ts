// Storage paths
export const STORAGE_PATHS = {
  projects: 'projects',
  source: 'source',
  rendered: 'rendered',
} as const

// Timing constants
export const PROGRESS_INTERVAL_MS = 40
export const PROGRESS_INCREMENT = 3
export const REDIRECT_DELAY_MS = 600

// UI constants
export const MAX_FILE_SIZE_MB = 50
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp'

// Image dimensions
export const IMAGE_WIDTH = 1024
export const IMAGE_HEIGHT = 1024

// KV keys
export const HOSTING_CONFIG_KEY = 'roomify_hosting_config'
export const PROJECT_KV_PREFIX = 'roomify_project_'

// Worker URL (from env)
export const PUTER_WORKER_URL = import.meta.env.VITE_PUTER_WORKER_URL as string | undefined

// Roomify render prompt
export const ROOMIFY_RENDER_PROMPT = `Convert this 2D floor plan into a photorealistic top-down 3D architectural render.

Strict requirements — do not violate them:
1. Remove ALL text from the render. Do not render any letters, numbers, labels, dimensions, or annotations.
2. Geometry must match exactly — walls, rooms, doors, and windows must follow the exact lines and positions in the plan. Do not shift or resize any elements.
3. Clean, realistic output with crisp edges, balanced lighting, and realistic materials.
4. Do not add anything not present in the 2D plan. All walls, doors, and windows must be copied from the 2D render.
5. Add furniture and room-specific elements where the room type is clearly identifiable (bedroom → bed + nightstands, kitchen → appliances + sink, living room → sofa + table, bathroom → fixtures).
6. Make the lighting bright and neutral — well-lit interior photography style.
7. Top-down perspective, looking straight down at a slight isometric angle.`
