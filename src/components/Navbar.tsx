import { Box } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from './ui/Button'

export default function Navbar() {
  const { isSignedIn, username, signIn, signOut } = useAuth()

  const handleAuthClick = async () => {
    try {
      if (isSignedIn) await signOut()
      else await signIn()
    } catch (e) {
      console.error('Auth failed', e)
    }
  }

  return (
    <header className="navbar">
      <a href="/" className="brand">
        <div className="logo-icon">
          <Box size={16} color="#fff" />
        </div>
        Roomify
      </a>

      <ul className="links">
        <li><a href="#">Produto</a></li>
        <li><a href="#">Preços</a></li>
        <li><a href="#">Comunidade</a></li>
        <li><a href="#">Empresas</a></li>
      </ul>

      <div className="actions">
        {isSignedIn ? (
          <>
            <span className="greeting">Olá, {username ?? 'usuário'}</span>
            <Button variant="ghost" size="sm" onClick={handleAuthClick}>
              Sair
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={handleAuthClick}>
              Entrar
            </Button>
            <a href="#upload" className="btn btn-primary btn-sm">
              Começar
            </a>
          </>
        )}
      </div>
    </header>
  )
}