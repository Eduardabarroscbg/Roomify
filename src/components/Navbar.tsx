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
          <Box size={16} color="#1a1209" />
        </div>
        Roomify
      </a>

      <ul className="links">
        <li><a href="#">Product</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="#">Community</a></li>
        <li><a href="#">Enterprise</a></li>
      </ul>

      <div className="actions">
        {isSignedIn ? (
          <>
            <span className="greeting">Hi, {username ?? 'user'}</span>
            <Button variant="ghost" size="sm" onClick={handleAuthClick}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={handleAuthClick}>
              Log in
            </Button>
            <a href="#upload" className="btn btn-primary btn-sm">
              Get Started
            </a>
          </>
        )}
      </div>
    </header>
  )
}
