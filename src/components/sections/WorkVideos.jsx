import { useLanguage } from '../../context/LanguageContext'
import workVideos from '../../data/workVideos'
import VideoWorkCard from '../ui/VideoWorkCard'

export default function WorkVideos() {
  const { t } = useLanguage()

  return (
    <section id="projects" className="section videos-section">
      <div className="container">
        <p className="eyebrow">{t('Projects.eyebrow')}</p>
        <h2 className="section-title">{t('Projects.title')}</h2>

        <div className="videos-stack">
          {workVideos.map((video) => (
            <VideoWorkCard
              key={video.id}
              video={video}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
