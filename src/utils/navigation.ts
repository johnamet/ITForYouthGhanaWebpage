import { NavigateFunction } from 'react-router-dom'

let navigateFunction: NavigateFunction | null = null

export const setNavigateFunction = (navigate: NavigateFunction) => {
  navigateFunction = navigate
}

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

export const navigateToPage = (path: string) => {
  if (navigateFunction) {
    navigateFunction(path)
  } else {
    console.warn('Navigate function not set. Use setNavigateFunction in your root component.')
    window.location.href = path
  }
}

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}