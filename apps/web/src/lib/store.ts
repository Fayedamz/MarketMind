import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('token', token)
        set({ user, token })
      },
      clearAuth: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null })
      },
      isAuthenticated: () => {
        return get().token !== null
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)

interface Portfolio {
  id: string
  name: string
  type: string
  balance: number
  totalValue?: number
}

interface PortfolioState {
  currentPortfolio: Portfolio | null
  setCurrentPortfolio: (portfolio: Portfolio) => void
  clearCurrentPortfolio: () => void
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  currentPortfolio: null,
  setCurrentPortfolio: (portfolio) => set({ currentPortfolio: portfolio }),
  clearCurrentPortfolio: () => set({ currentPortfolio: null }),
}))
