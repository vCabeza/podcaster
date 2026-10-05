import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'

export interface LoadingContextValue {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined)

interface LoadingProviderProps {
  children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [pendingCount, setPendingCount] = useState(0)

  const startLoading = useCallback(() => {
    setPendingCount((count) => count + 1)
  }, [])

  const stopLoading = useCallback(() => {
    setPendingCount((count) => Math.max(0, count - 1))
  }, [])

  const value: LoadingContextValue = {
    isLoading: pendingCount > 0,
    startLoading,
    stopLoading,
  }

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  )
}

export function useLoading(): LoadingContextValue {
  const context = useContext(LoadingContext)

  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }

  return context
}
