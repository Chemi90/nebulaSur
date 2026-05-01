import { useLanguage } from '../../context/LanguageContext'

export default function LocalPresence() {
  const { t } = useLanguage()
  const locationsValue = t('areas.locations')
  const queriesValue = t('areas.queries')
  const faqsValue = t('areas.faqs')

  const locations = Array.isArray(locationsValue) ? locationsValue : []
  const queries = Array.isArray(queriesValue) ? queriesValue : []
  const faqs = Array.isArray(faqsValue) ? faqsValue : []

  return (
    <section id="areas" className="section areas-section">
      <div className="container areas-layout">
        <div className="areas-content">
          <p className="eyebrow">{t('areas.eyebrow')}</p>
          <h2 className="section-title">{t('areas.title')}</h2>
          <p className="section-subtitle align-left">{t('areas.subtitle')}</p>

          <div className="areas-grid">
            {locations.map((area) => {
              const services = Array.isArray(area.services) ? area.services : []

              return (
                <article key={area.name} className="area-card">
                  <h3>{area.name}</h3>
                  <p>{area.description}</p>
                  <ul>
                    {services.map((service) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
        </div>

        <aside className="area-search-panel" aria-label={t('areas.searchesAria')}>
          <h3>{t('areas.searchesTitle')}</h3>
          <ul className="area-query-list">
            {queries.map((query) => (
              <li key={query}>{query}</li>
            ))}
          </ul>

          <div className="area-faq-list">
            {faqs.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
