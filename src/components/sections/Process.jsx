import { useLanguage } from '../../context/LanguageContext'

export default function Process() {
  const { t } = useLanguage()
  const steps = t('process.steps')
  const stepItems = Array.isArray(steps) ? steps : []

  return (
    <section id="process" className="section process-section">
      <div className="container">
        <p className="eyebrow">{t('process.eyebrow')}</p>
        <h2 className="section-title">{t('process.title')}</h2>

        <div className="process-grid">
          {stepItems.map((step, index) => (
            <article key={step.title} className="process-card">
              <span className="process-step">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
