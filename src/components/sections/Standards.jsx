import { useLanguage } from '../../context/LanguageContext'

export default function Standards() {
  const { t } = useLanguage()
  const items = t('standards.items')
  const standards = Array.isArray(items) ? items : []

  return (
    <section id="standards" className="section standards-section">
      <div className="container">
        <p className="eyebrow">{t('standards.eyebrow')}</p>
        <h2 className="section-title">{t('standards.title')}</h2>

        <div className="standards-grid">
          {standards.map((item) => (
            <article key={item.title} className="standard-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
