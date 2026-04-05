import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Custom navigation hook for enhanced navigation capabilities
 */
export function useNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  return {
    navigate,
    location,
    goBack: () => navigate(-1),
    goForward: () => navigate(1),
    currentPath: location.pathname,
    isActive: (path: string) => location.pathname === path,
  }
}
