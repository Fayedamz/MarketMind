import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

export function useAuth() {
  const { user, token, setAuth, clearAuth, isAuthenticated } = useAuthStore()
  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authAPI.login(email, password),
    onSuccess: (response) => {
      const { user, token } = response.data
      setAuth(user, token)
      router.push('/portfolio')
    },
  })

  const registerMutation = useMutation({
    mutationFn: ({ email, password, name }: { email: string; password: string; name: string }) =>
      authAPI.register(email, password, name),
    onSuccess: (response) => {
      const { user, token } = response.data
      setAuth(user, token)
      router.push('/academy')
    },
  })

  const logout = () => {
    clearAuth()
    router.push('/')
  }

  return {
    user,
    token,
    isAuthenticated: isAuthenticated(),
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  }
}
