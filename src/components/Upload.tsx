import { useState, useCallback, useRef } from 'react'
import { Upload as UploadIcon, Layers, CheckCircle2, ImageIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  PROGRESS_INTERVAL_MS,
  PROGRESS_INCREMENT,
  REDIRECT_DELAY_MS,
  ACCEPTED_EXTENSIONS,
  ACCEPTED_TYPES,
} from '../lib/constants'

interface UploadProps {
  onComplete: (base64Image: string) => Promise<boolean>
}

export default function Upload({ onComplete }: UploadProps) {
  const { isSignedIn } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cleanup = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [])

  const processFile = useCallback(
    (f: File) => {
      if (!isSignedIn) return
      setFile(f)
      setProgress(0)

      const reader = new FileReader()
      reader.onerror = () => console.error('Erro ao ler o arquivo')
      reader.onload = (e) => {
        const b64 = e.target?.result as string
        intervalRef.current = setInterval(() => {
          setProgress((p) => {
            if (p >= 95) {
              if (intervalRef.current) clearInterval(intervalRef.current)
              return 95
            }
            return p + PROGRESS_INCREMENT
          })
        }, PROGRESS_INTERVAL_MS)

        timeoutRef.current = setTimeout(() => {
          cleanup()
          setProgress(100)
          setTimeout(() => onComplete(b64), REDIRECT_DELAY_MS)
        }, 1800)
      }
      reader.readAsDataURL(f)
    },
    [isSignedIn, onComplete, cleanup]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (isSignedIn) setIsDragging(true)
  }
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!isSignedIn) return
    const dropped = e.dataTransfer.files[0]
    if (dropped && ACCEPTED_TYPES.includes(dropped.type)) processFile(dropped)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0])
  }

  return (
    <div className="upload-shell" id="upload">
      <div className="grid-overlay" />
      <div className="upload-card">
        <div className="upload-head">
          <div className="upload-icon">
            <Layers size={22} color="var(--accent)" />
          </div>
          <div>
            <h3>Envie sua planta baixa</h3>
            <p>Suporta JPEG, PNG, WEBP — até 50MB</p>
          </div>
        </div>

        {!file ? (
          <div
            className={`drop-zone${isDragging ? ' is-dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="drop-input"
              accept={ACCEPTED_EXTENSIONS}
              disabled={!isSignedIn}
              onChange={handleChange}
            />
            <div className="drop-content">
              <div className="drop-icon">
                <UploadIcon size={22} color="var(--accent)" />
              </div>
              <p>
                {isSignedIn
                  ? 'Clique para enviar ou arraste o arquivo'
                  : 'Entre com sua conta Puter para enviar'}
              </p>
              <p className="help">Tamanho máximo: 50MB</p>
            </div>
          </div>
        ) : (
          <div className="upload-status">
            <div className="status-content">
              <div className={`status-icon ${progress === 100 ? 'done' : 'loading'}`}>
                {progress === 100
                  ? <CheckCircle2 size={28} color="var(--success, #5ec97c)" />
                  : <ImageIcon size={28} color="var(--accent)" />}
              </div>
              <h3>{file.name}</h3>
              <div className="progress" style={{ width: '100%' }}>
                <div className="bar" style={{ width: `${progress}%` }} />
              </div>
              <p className="status-text">
                {progress < 100 ? 'Analisando planta...' : 'Redirecionando...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}