import { useNavigation } from 'react-router-dom'
import { useLoading } from '../context/LoadingContext'

/**
 * Combines React Router navigation transitions with programmatic async loading.
 */
export function useNavigationLoading(): boolean {
  const navigation = useNavigation()
  const { isLoading } = useLoading()

  return navigation.state === 'loading' || isLoading
}
