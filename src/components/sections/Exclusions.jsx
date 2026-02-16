import { useLanguage } from '../../context/LanguageContext'

export default function Exclusions() {
  const { t } = useLanguage()
  const items = t('exclusions.items')
  const exclusions = Array.isArray(items) ? items : []

  return (
    <section id="exclusions" className="section exclusions-section">
      <div className="container">
        <p className="eyebrow">{t('exclusions.eyebrow')}</p>
        <h2 className="section-title">{t('exclusions.title')}</h2>

        <div className="exclusions-grid">
          {exclusions.map((item) => (
            <article key={item.title} className="exclusion-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
