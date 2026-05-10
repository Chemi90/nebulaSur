import { lazy, Suspense, useEffect, useState } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import Metrics from './components/sections/Metrics'

const CosmicNeuralBackground = lazy(() => import('./components/background/CosmicNeuralBackground'))
const Services = lazy(() => import('./components/sections/Services'))
const WorkVideos = lazy(() => import('./components/sections/WorkVideos'))
const Process = lazy(() => import('./components/sections/Process'))
const Standards = lazy(() => import('./components/sections/Standards'))
const LocalPresence = lazy(() => import('./components/sections/LocalPresence'))
const Contact = lazy(() => import('./components/sections/Contact'))
const Footer = lazy(() => import('./components/layout/Footer'))

const DEFERRED_SECTION_DELAY_MS = 4200
const DEFERRED_BACKGROUND_DELAY_MS = 1800

function DeferredBackground() {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (shouldRender) {
      return undefined
    }

    const reveal = () => setShouldRender(true)
    const timeoutId = window.setTimeout(reveal, DEFERRED_BACKGROUND_DELAY_MS)
    const listenerOptions = { once: true, passive: true }

    window.addEventListener('pointermove', reveal, listenerOptions)
    window.addEventListener('scroll', reveal, listenerOptions)
    window.addEventListener('touchstart', reveal, listenerOptions)

    return () => {
      window.clearTimeout(timeoutId)
      window.removeEventListener('pointermove', reveal, listenerOptions)
      window.removeEventListener('scroll', reveal, listenerOptions)
      window.removeEventListener('touchstart', reveal, listenerOptions)
    }
  }, [shouldRender])

  if (!shouldRender) {
    return <div className="cosmic-background" aria-hidden="true" />
  }

  return (
    <Suspense fallback={<div className="cosmic-background" aria-hidden="true" />}>
      <CosmicNeuralBackground />
    </Suspense>
  )
}

function DeferredContent() {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (shouldRender) {
      return undefined
    }

    let timeoutId = 0
    let idleId = 0

    const reveal = () => {
      setShouldRender(true)
    }

    const revealOnIdle = () => {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(reveal, { timeout: DEFERRED_SECTION_DELAY_MS })
      } else {
        timeoutId = window.setTimeout(reveal, DEFERRED_SECTION_DELAY_MS)
      }
    }

    const events = ['scroll', 'wheel', 'touchstart', 'keydown', 'nebula:reveal-sections']
    const listenerOptions = { once: true, passive: true }

    events.forEach((eventName) => {
      window.addEventListener(eventName, reveal, listenerOptions)
    })

    revealOnIdle()

    return () => {
      window.clearTimeout(timeoutId)
      if (idleId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId)
      }

      events.forEach((eventName) => {
        window.removeEventListener(eventName, reveal, listenerOptions)
      })
    }
  }, [shouldRender])

  if (!shouldRender) {
    return null
  }

  return (
    <Suspense fallback={null}>
      <Services />
      <WorkVideos />
      <Process />
      <Standards />
      <LocalPresence />
      <Contact />
      <Footer />
    </Suspense>
  )
}

function App() {
  return (
    <LanguageProvider>
      <div className="app-shell">
        <DeferredBackground />
        <Navbar />

        <main className="site-main">
          <Hero />
          <Metrics />
          <DeferredContent />
        </main>

      </div>
    </LanguageProvider>
  )
}

export default App
