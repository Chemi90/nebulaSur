import { LanguageProvider } from './context/LanguageContext'
import CosmicNeuralBackground from './components/background/CosmicNeuralBackground'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Metrics from './components/sections/Metrics'
import Services from './components/sections/Services'
import WorkVideos from './components/sections/WorkVideos'
import Process from './components/sections/Process'
import Standards from './components/sections/Standards'
import Contact from './components/sections/Contact'

function App() {
  return (
    <LanguageProvider>
      <div className="app-shell">
        <CosmicNeuralBackground />
        <Navbar />

        <main className="site-main">
          <Hero />
          <Metrics />
          <Services />
          <WorkVideos />
          <Process />
          <Standards />
          <Contact />
        </main>

        <Footer />
      </div>
    </LanguageProvider>
  )
}

export default App
