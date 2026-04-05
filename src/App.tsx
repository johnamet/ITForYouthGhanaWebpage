import { BrowserRouter as Router, useRoutes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { SkipLinks } from './components/accessibility'
import ScrollToTop from './components/ScrollToTop'
import { routes } from './app/routes'

/**
 * Main App component
 * 
 * Now much simpler - uses centralized route configuration
 * All routing logic is defined in app/routes.tsx
 */
function App() {
  const routeElements = useRoutes(routes)

  return (
    <HelmetProvider>
      <Router
        basename=""
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="min-h-screen bg-white">
          <ScrollToTop />
          <SkipLinks />
          {routeElements}
        </div>
      </Router>
    </HelmetProvider>
  )
}

export default App
