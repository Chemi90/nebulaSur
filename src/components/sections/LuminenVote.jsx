import { useLanguage } from '../../context/LanguageContext'

const VOTE_URL = 'https://granadavalley.es/1o-premios-luminen/#:~:text=N%C3%A9bula%20Sur%20nace%20en%20Granada'

export default function LuminenVote() {
  const { t } = useLanguage()

  return (
    <section id="vote" className="section vote-section">
      <div className="container vote-layout">
        <div className="vote-copy">
          <p className="eyebrow">{t('luminen.eyebrow')}</p>
          <h2 className="section-title">{t('luminen.title')}</h2>
          <p className="section-subtitle">{t('luminen.subtitle')}</p>
        </div>

        <div className="vote-action">
          <p className="vote-award">{t('luminen.award')}</p>
          <a
            className="btn btn-lumen"
            href={VOTE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('luminen.cta')}
          </a>
        </div>
      </div>
    </section>
  )
}
