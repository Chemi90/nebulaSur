import { useLanguage } from '../../context/LanguageContext'

export default function Services() {
  const { t } = useLanguage()
  const items = t('services.items')
  const services = Array.isArray(items) ? items : []

  return (
    <section id="services" className="section services-section">
      <div className="container">
        <p className="eyebrow">{t('services.eyebrow')}</p>
        <h2 className="section-title">{t('services.title')}</h2>
        <p className="section-subtitle">{t('services.subtitle')}</p>

        <div className="services-grid">
          {services.map((service) => (
            <article key={service.title} className="service-card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <p className="service-outcome">{service.outcome}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
