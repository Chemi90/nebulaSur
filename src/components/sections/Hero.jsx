import { useLanguage } from '../../context/LanguageContext'
import logoMark from '../../assets/logo-mark.jpeg'

export default function Hero() {
  const { t } = useLanguage()
  const chips = t('hero.chips')
  const chipItems = Array.isArray(chips) ? chips : []

  return (
    <section id="home" className="section hero-section">
      <div className="container hero-grid">
        <div className="hero-content">
          <p className="eyebrow">{t('hero.eyebrow')}</p>
          <h1 className="hero-title">{t('hero.title')}</h1>
          <p className="hero-subtitle">{t('hero.subtitle')}</p>
          <p className="hero-description">{t('hero.description')}</p>

          <div className="hero-actions">
            <a href="#services" className="btn btn-primary">{t('hero.primaryCta')}</a>
            <a href="#contact" className="btn btn-ghost">{t('hero.secondaryCta')}</a>
          </div>

          <ul className="hero-chips" aria-label="Capabilities">
            {chipItems.map((chip) => (
              <li key={chip}>{chip}</li>
            ))}
          </ul>
        </div>

        <aside className="hero-visual" aria-label="Nebula Sur brand panel">
          <img src={logoMark} alt="Nebula Sur symbol" className="hero-logo" />
          <h3 className="hero-visual-brand">Nebula Sur</h3>
          <p>{t('hero.visualCaption')}</p>
        </aside>
      </div>
    </section>
  )
}
