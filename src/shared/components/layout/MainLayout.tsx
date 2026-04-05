import React from 'react'
import MainNavigation from '../../../components/navigation/MainNavigation'
import Footer from '../../../components/layout/footer'
import { Outlet } from 'react-router-dom'

/**
 * Main layout component used for most pages
 * Contains header, footer, and main content area
 */
export function MainLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MainNavigation />
      <main id="main-content" role="main" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
