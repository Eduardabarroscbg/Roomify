import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { X, Download, Share2, RefreshCw } from 'lucide-react'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { Box } from 'lucide-react'
import Button from '../components/ui/Button'
import { generate3DView } from '../lib/ai.action'
import { createProject, getProjectById } from '../lib/puter.action'
import { useAuth } from '../context/AuthContext'

export default function Visualizer() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { userId } = useAuth()

  const [project, setProject] = useState<DesignItem | null>(null)
  const [isProjectLoading, setIsProjectLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)

  const hasGeneratedRef = useRef(false)
  const hasMountedRef = useRef(false)

  // Load project from KV (or from navigation state)
  useEffect(() => {
    if (hasMountedRef.current) return
    hasMountedRef.current = true

    const loadProject = async () => {
      setIsProjectLoading(true)
      try {
        // Try KV first
        if (id) {
          const found = await getProjectById(id)
          if (found) {
            setProject(found)
            if (found.renderedImage) setCurrentImage(found.renderedImage)
            setIsProjectLoading(false)
            return
          }
        }
        // Fallback to navigation state
        const state = location.state as { initialImage?: string; name?: string } | null
        if (state?.initialImage && id) {
          const fallback: DesignItem = {
            id,
            name: state.name ?? `Residence ${id.slice(-4)}`,
            sourceImage: state.initialImage,
            timestamp: Date.now(),
            ownerId: userId,
          }
          setProject(fallback)
        }
      } finally {
        setIsProjectLoading(false)
      }
    }
    loadProject()
  }, [id, location.state, userId])

  // Auto-generate if no rendered image
  useEffect(() => {
    if (isProjectLoading) return
    if (!project?.sourceImage) return
    if (hasGeneratedRef.current) return

    if (project.renderedImage) {
      setCurrentImage(project.renderedImage)
      hasGeneratedRef.current = true
      return
    }

    // Generate
    hasGeneratedRef.current = true
    runGeneration(project)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProjectLoading, project])

  const runGeneration = async (item: DesignItem) => {
    if (!item.sourceImage) return
    setIsProcessing(true)
    try {
      const { renderedImage } = await generate3DView({ sourceImage: item.sourceImage })
      if (renderedImage) {
        setCurrentImage(renderedImage)
        // Persist rendered image
        const updated: DesignItem = {
          ...item,
          renderedImage,
          updatedAt: Date.now(),
          ownerId: item.ownerId ?? userId,
        }
        const saved = await createProject({ item: updated, visibility: 'private' })
        if (saved) setProject(saved)
        else setProject(updated)
      }
    } catch (e) {
      console.error('Generation failed', e)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleExport = () => {
    if (!currentImage) return
    const a = document.createElement('a')
    a.href = currentImage
    a.download = `${(project?.name ?? 'roomify').replace(/\s+/g, '_')}_render.jpg`
    a.target = '_blank'
    a.click()
  }

  const handleShare = () => alert('Share feature — coming soon!')

  const handleBack = () => navigate('/')

  if (isProjectLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="visualizer-page">
      {/* Top bar */}
      <nav className="top-bar">
        <div className="brand">
          <div className="logo-icon">
            <Box size={14} color="#1a1209" />
          </div>
          Roomify
        </div>
        <Button variant="ghost" size="sm" className="exit" onClick={handleBack}>
          <X size={14} className="icon" /> Exit Editor
        </Button>
      </nav>

      {/* Layout */}
      <div className="content">
        {/* Left panel */}
        <div className="panel">
          <div className="panel-header">
            <p>Project</p>
            <h2>{project?.name ?? `Residence ${id?.slice(-4)}`}</h2>
            <p className="note">Created by you</p>
          </div>
          <div className="panel-actions">
            <Button
              variant="ghost"
              size="sm"
              className="export"
              onClick={handleExport}
              disabled={!currentImage}
            >
              <Download size={14} /> Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              disabled={!currentImage}
            >
              <Share2 size={14} /> Share
            </Button>
          </div>
          {isProcessing && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>
              <span className="spinner-sm" style={{ display: 'inline-block', marginRight: 6 }} />
              Generating AI render...
            </p>
          )}
        </div>

        {/* Main area */}
        <div className="viz-main">
          {/* Render area */}
          <div className={`render-area${isProcessing ? ' is-processing' : ''}`}>
            {currentImage ? (
              <img src={currentImage} alt="AI render" className="render-img" />
            ) : (
              <div className="render-placeholder">
                {project?.sourceImage && (
                  <img src={project.sourceImage} alt="original" className="render-fallback" />
                )}
              </div>
            )}

            {isProcessing && (
              <div className="render-overlay">
                <div className="rendering-card">
                  <div className="spinner" />
                  <span className="title">Rendering...</span>
                  <span className="subtitle">Generating your 3D visualization</span>
                </div>
              </div>
            )}
          </div>

          {/* Before / After comparison */}
          {project?.sourceImage && currentImage && (
            <div className="compare-panel">
              <div className="compare-header">
                <div>
                  <p>Comparison</p>
                  <h3>Before &amp; After</h3>
                </div>
                <span className="hint">Drag to compare</span>
              </div>
              <div className="compare-stage">
                <ReactCompareSlider
                  defaultValue={50}
                  style={{ width: '100%', height: 'auto' }}
                  itemOne={
                    <ReactCompareSliderImage
                      src={project.sourceImage}
                      alt="before"
                      className="compare-img"
                    />
                  }
                  itemTwo={
                    <ReactCompareSliderImage
                      src={currentImage}
                      alt="after"
                      className="compare-img"
                    />
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
