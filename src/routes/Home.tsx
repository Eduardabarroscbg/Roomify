import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Clock, ArrowUpRight } from 'lucide-react'
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
  const isCreatingRef = useRef(false)

  // Load projects on mount / when auth changes
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
      const name = `Residence ${id.slice(-4)}`
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
      console.error('Failed to create project', e)
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
          Introducing Roomify 2.0
        </div>
        <h1>Build beautiful spaces<br />at the speed of thought</h1>
        <p className="subtitle">
          Roomify is an AI-first design environment that helps you visualize,
          render, and ship architectural projects faster than ever.
        </p>
        <div className="actions">
          <a href="#upload" className="btn-cta">
            Start Building <ArrowRight size={18} className="icon" />
          </a>
          <Button variant="outline" size="lg">Watch Demo</Button>
        </div>
      </section>

      {/* Upload */}
      <Upload onComplete={handleUploadComplete} />

      {/* Projects */}
      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Projects</h2>
              <p>Your latest work and shared community projects — all in one place</p>
            </div>
          </div>

          <div className="projects-grid">
            {projects.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🏛️</p>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                  {isSignedIn
                    ? 'No projects yet — upload your first floor plan above'
                    : 'Sign in to see your projects'}
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
                      alt="project"
                      loading="lazy"
                    />
                    <span className="badge">mine</span>
                  </div>
                  <div className="card-body">
                    <h3>{project.name}</h3>
                    <div className="meta">
                      <Clock size={12} />
                      <span>{formatDate(project.timestamp)}</span>
                      <span>· by you</span>
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
