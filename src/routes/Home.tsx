import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Clock, ArrowUpRight, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import Upload from '../components/Upload'
import Button from '../components/ui/Button'
import { createProject, getProjects } from '../lib/puter.action'
import { formatDate, generateProjectId } from '../lib/utils'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const navigate = useNavigate()
  const { isSignedIn, userId } = useAuth()
  const [projects, setProjects] = useState<DesignItem[]>([])
  const [showDemo, setShowDemo] = useState(false)
  const isCreatingRef = useRef(false)

  // Fecha com ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowDemo(false)
    }
    if (showDemo) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [showDemo])

  // Trava scroll quando modal aberto
  useEffect(() => {
    document.body.style.overflow = showDemo ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showDemo])

  useEffect(() => {
    if (!isSignedIn) { setProjects([]); return }
    const fetchProjects = async () => {
      const items = await getProjects()
      const sorted = items.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))
      setProjects(sorted)
    }
    fetchProjects()
  }, [isSignedIn])

  const handleUploadComplete = async (base64Image: string): Promise<boolean> => {
    if (isCreatingRef.current) return false
    isCreatingRef.current = true
    try {
      const id = generateProjectId()
      const name = `Residência ${id.slice(-4)}`
      const newItem: DesignItem = {
        id,
        name,
        sourceImage: base64Image,
        renderedImage: undefined,
        timestamp: Date.now(),
        isPublic: false,
        ownerId: userId,
      }
      const saved = await createProject({ item: newItem, visibility: 'private' })
      const project = saved ?? newItem
      setProjects((prev) => [project, ...prev])
      navigate(`/visualizer/${id}`, {
        state: { initialImage: project.sourceImage, name: project.name },
      })
      return true
    } catch (e) {
      console.error('Falha ao criar projeto', e)
      return false
    } finally {
      isCreatingRef.current = false
    }
  }

  return (
    <div className="home">
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="announce">
          <div className="dot" />
          Apresentando o Roomify 2.0
        </div>
        <h1>Visualize espaços incríveis<br />na velocidade do pensamento</h1>
        <p className="subtitle">
          Roomify é uma plataforma de design com inteligência artificial que transforma
          plantas baixas 2D em renders 3D fotorrealistas em segundos.
        </p>
        <div className="actions">
          <a href="#upload" className="btn-cta">
            Começar agora <ArrowRight size={18} className="icon" />
          </a>
          <Button variant="outline" size="lg" onClick={() => setShowDemo(true)}>
            Ver demonstração
          </Button>
        </div>
      </section>

      {/* Modal de demonstração */}
      {showDemo && (
        <div
          className="demo-overlay"
          onClick={() => setShowDemo(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(6px)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            className="demo-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '900px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
              background: '#000',
              animation: 'scaleIn 0.25s ease',
            }}
          >
            {/* Botão fechar */}
            <button
              onClick={() => setShowDemo(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 10,
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#fff',
                backdropFilter: 'blur(4px)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.6)')}
            >
              <X size={18} />
            </button>

            {/* Vídeo */}
            <video
              src="/demostração do roomify.mp4"
              controls
              autoPlay
              style={{
                width: '100%',
                display: 'block',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      )}

      {/* Animações */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        @keyframes scaleIn {
          from { transform: scale(0.93); opacity: 0 }
          to   { transform: scale(1);    opacity: 1 }
        }
      `}</style>

      {/* Upload */}
      <Upload onComplete={handleUploadComplete} />

      {/* Projects */}
      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Projetos</h2>
              <p>Seus últimos trabalhos — todos em um só lugar</p>
            </div>
          </div>

          <div className="projects-grid">
            {projects.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🏛️</p>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                  {isSignedIn
                    ? 'Nenhum projeto ainda — envie sua primeira planta acima'
                    : 'Entre na sua conta para ver seus projetos'}
                </p>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="project-card group"
                  onClick={() => navigate(`/visualizer/${project.id}`)}
                >
                  <div className="preview">
                    <img
                      src={project.renderedImage ?? project.sourceImage}
                      alt="projeto"
                      loading="lazy"
                    />
                    <span className="badge">meu</span>
                  </div>
                  <div className="card-body">
                    <h3>{project.name}</h3>
                    <div className="meta">
                      <Clock size={12} />
                      <span>{formatDate(project.timestamp)}</span>
                      <span>· por você</span>
                    </div>
                  </div>
                  <div className="arrow">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}