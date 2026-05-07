import { useLanguage } from '../../context/LanguageContext'
import { seoServices } from '../../data/seoServices'

export default function Services() {
  const { t } = useLanguage()
  const items = t('services.items')
  const services = Array.isArray(items) ? items : []
  const detailCta = t('services.detailCta')

  return (
    <section id="services" className="section services-section">
      <div className="container">
        <p className="eyebrow">{t('services.eyebrow')}</p>
        <h2 className="section-title">{t('services.title')}</h2>
        <p className="section-subtitle">{t('services.subtitle')}</p>

        <div className="services-grid">
          {services.map((service, index) => {
            const seoService = seoServices[index]

            return (
              <article key={service.title} className="service-card">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <p className="service-outcome">{service.outcome}</p>
                {seoService && (
                  <a className="service-detail-link" href={`/servicios/${seoService.slug}/`}>
                    {detailCta}
                  </a>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
