import { useMemo } from 'react'
import { useLanguage } from '../../context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  const footerLinks = useMemo(() => ([
    { id: 'home', label: t('nav.home') },
    { id: 'services', label: t('nav.services') },
    { id: 'projects', label: t('nav.Projects') },
    { id: 'contact', label: t('nav.contact') }
  ]), [t])

  const year = new Date().getFullYear()

  const handleAnchorClick = (event, id) => {
    event.preventDefault()

    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-brand">Nebula Sur</p>
          <p className="footer-note">{t('footer.note')}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="footer-links">
            {footerLinks.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={(event) => handleAnchorClick(event, item.id)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="footer-rights">© {year} Nebula Sur. {t('footer.rights')}</p>
      </div>
    </footer>
  )
}
