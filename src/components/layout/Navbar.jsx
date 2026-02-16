import { useMemo, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import logoMark from '../../assets/logo-mark.jpeg'

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'it', label: 'IT' },
  { code: 'es', label: 'ES' }
]

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = useMemo(() => ([
    { id: 'home', label: t('nav.home') },
    { id: 'services', label: t('nav.services') },
    { id: 'projects', label: t('nav.Projects') },
    { id: 'contact', label: t('nav.contact') }
  ]), [t])

  const handleAnchorClick = (event, id) => {
    event.preventDefault()
    setMenuOpen(false)

    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#home" onClick={(event) => handleAnchorClick(event, 'home')}>
          <img src={logoMark} alt="Nebula Sur symbol" className="brand-logo" />
          <span className="brand-name">Nebula Sur</span>
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`}>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={(event) => handleAnchorClick(event, item.id)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <label className="language-picker">
            <svg
              className="language-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18" />
              <path d="M12 3c2.2 2.4 3.3 5.4 3.3 9s-1.1 6.6-3.3 9c-2.2-2.4-3.3-5.4-3.3-9s1.1-6.6 3.3-9z" />
            </svg>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              aria-label={t('nav.selectLanguage')}
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>{item.label}</option>
              ))}
            </select>
          </label>
        </nav>
      </div>
    </header>
  )
}
