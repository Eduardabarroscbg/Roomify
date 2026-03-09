import { createContext, useContext } from 'react'

export const AuthContext = createContext<AuthContext>({
  isSignedIn: false,
  username: null,
  userId: null,
  refreshAuth: async () => false,
  signIn: async () => false,
  signOut: async () => false,
})

export const useAuth = () => useContext(AuthContext)
