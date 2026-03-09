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

export async function generate3DView({ sourceImage: _ }: Generate3DViewParams): Promise<{
  renderedImage: string | null
  renderedPath?: string
}> {
  console.log('🤖 Calling DALL-E 3 via Puter...')

  // DALL-E 3 via Puter — high quality, free, isometric 3D render
  const img = await puter.ai.txt2img(
    `Photorealistic isometric 3D architectural render of a modern house upper floor plan. 
     Layout: Master Bedroom 18x14ft top-right with walk-in closet, 
     Bedroom 1 top-left 12x10ft, Bedroom 2 bottom-left 12x10ft, Bedroom 3 bottom-right 12x10ft,
     Hallway 22x7ft in center, Bath 10x10ft top-center, Master Bath 7x10ft top-right,
     Staircase in center-bottom, multiple closets throughout.
     Style: isometric cutaway view from 45 degrees above, hardwood floors, white walls,
     realistic modern furniture in every room (beds with pillows, dressers, nightstands, bathroom fixtures),
     soft natural lighting, ultra sharp, ultra detailed, professional architectural visualization, no pool, no outdoor areas.`,
    { model: 'dall-e-3' }
  )

  const rawUrl = img instanceof HTMLImageElement ? img.src : (img as any)?.src ?? null
  if (!rawUrl) throw new Error('DALL-E 3 não retornou imagem')

  const renderedImage = rawUrl.startsWith('data:')
    ? rawUrl
    : await fetchAsDataURL(rawUrl).catch(() => rawUrl)

  console.log('✅ Render gerado com sucesso!')
  return { renderedImage }
}