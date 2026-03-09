import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import { getCurrentUser, signIn as puterSignIn, signOut as puterSignOut } from './lib/puter.action'
import Home from './routes/Home'
import Visualizer from './routes/Visualizer'

const DEFAULT_AUTH: AuthState = { isSignedIn: false, username: null, userId: null }

export default function App() {
  const [authState, setAuthState] = useState<AuthState>(DEFAULT_AUTH)

  const refreshAuth = async (): Promise<boolean> => {
    try {
      const user = await getCurrentUser()
      setAuthState({
        isSignedIn: !!user,
        username: user?.username ?? null,
        userId: user?.uuid ?? null,
      })
      return !!user
    } catch {
      setAuthState(DEFAULT_AUTH)
      return false
    }
  }

  const signIn = async (): Promise<boolean> => {
    try {
      await puterSignIn()
      return refreshAuth()
    } catch (e) {
      console.error('Puter sign in failed', e)
      return false
    }
  }

  const signOut = async (): Promise<boolean> => {
    try {
      puterSignOut()
      return refreshAuth()
    } catch (e) {
      console.error('Puter sign out failed', e)
      return false
    }
  }

  useEffect(() => { refreshAuth() }, [])

  return (
    <AuthContext.Provider value={{ ...authState, refreshAuth, signIn, signOut }}>
      <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/visualizer/:id" element={<Visualizer />} />
        </Routes>
      </main>
    </AuthContext.Provider>
  )
}
