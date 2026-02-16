import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '../../context/LanguageContext'

const OPEN_ANIMATION_MS = 620
const CLOSE_ANIMATION_MS = 420

const MODAL_PHASE = {
  CLOSED: 'closed',
  OPENING: 'opening',
  OPEN: 'open',
  CLOSING: 'closing'
}

function VideoWorkCard({ video }) {
  const { t } = useLanguage()
  const [modalPhase, setModalPhase] = useState(MODAL_PHASE.CLOSED)
  const [morphMetrics, setMorphMetrics] = useState(null)
  const [mountVideo, setMountVideo] = useState(false)
  const cardRef = useRef(null)
  const openTimerRef = useRef(null)
  const closeTimerRef = useRef(null)
  const openingFrameRef = useRef(null)

  const modalTitleId = `video-modal-title-${video.id}`
  const description = t(video.descriptionKey)
  const details = video.detailsKey ? t(video.detailsKey) : null
  const detailItems = Array.isArray(details) ? details : []
  const frameStyle = video.frameRatio
    ? { '--video-aspect-ratio': video.frameRatio }
    : undefined

  const clearTimers = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    if (openingFrameRef.current) {
      cancelAnimationFrame(openingFrameRef.current)
      openingFrameRef.current = null
    }
  }, [])

  const getMorphMetrics = useCallback((rect) => {
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const isMobile = viewportWidth <= 768

    const viewportMargin = (isMobile ? 1.4 : 3.2) * rootFontSize
    const finalWidth = isMobile
      ? Math.max(viewportWidth - viewportMargin, 280)
      : Math.max(Math.min(980, viewportWidth - viewportMargin), 320)
    const finalHeight = isMobile
      ? Math.max(Math.min(viewportHeight * 0.9, viewportHeight - viewportMargin), 280)
      : Math.max(Math.min(viewportHeight * 0.9, viewportHeight - viewportMargin), 360)

    const sourceCenterX = rect.left + rect.width / 2
    const sourceCenterY = rect.top + rect.height / 2
    const viewportCenterX = viewportWidth / 2
    const viewportCenterY = viewportHeight / 2

    return {
      finalWidth,
      finalHeight,
      translateX: sourceCenterX - viewportCenterX,
      translateY: sourceCenterY - viewportCenterY,
      scaleX: rect.width / finalWidth,
      scaleY: rect.height / finalHeight
    }
  }, [])

  const handleOpenModal = () => {
    if (modalPhase !== MODAL_PHASE.CLOSED) {
      return
    }

    const rect = cardRef.current?.getBoundingClientRect()
    if (rect) {
      setMorphMetrics(getMorphMetrics(rect))
    }

    clearTimers()
    setMountVideo(false)

    // Start opening on next frame to ensure morph metrics are committed first.
    openingFrameRef.current = requestAnimationFrame(() => {
      setModalPhase(MODAL_PHASE.OPENING)

      openTimerRef.current = setTimeout(() => {
        setModalPhase(MODAL_PHASE.OPEN)
        setMountVideo(true)
      }, OPEN_ANIMATION_MS)
    })
  }

  const handleCloseModal = useCallback(() => {
    if (modalPhase === MODAL_PHASE.CLOSED || modalPhase === MODAL_PHASE.CLOSING) {
      return
    }

    clearTimers()
    setModalPhase(MODAL_PHASE.CLOSING)

    closeTimerRef.current = setTimeout(() => {
      setModalPhase(MODAL_PHASE.CLOSED)
      setMorphMetrics(null)
      setMountVideo(false)
    }, CLOSE_ANIMATION_MS)
  }, [clearTimers, modalPhase])

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  useEffect(() => {
    if (modalPhase === MODAL_PHASE.CLOSED) {
      return
    }

    const previousOverflow = document.body.style.overflow
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleCloseModal()
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [handleCloseModal, modalPhase])

  const isModalVisible = modalPhase !== MODAL_PHASE.CLOSED
  const isAnimating = modalPhase === MODAL_PHASE.OPENING || modalPhase === MODAL_PHASE.CLOSING

  const modalStyle = morphMetrics
    ? {
        '--video-modal-final-width': `${morphMetrics.finalWidth}px`,
        '--video-modal-final-height': `${morphMetrics.finalHeight}px`,
        '--video-morph-translate-x': `${morphMetrics.translateX}px`,
        '--video-morph-translate-y': `${morphMetrics.translateY}px`,
        '--video-morph-scale-x': `${Math.max(morphMetrics.scaleX, 0.001)}`,
        '--video-morph-scale-y': `${Math.max(morphMetrics.scaleY, 0.001)}`
      }
    : undefined

  return (
    <>
      <article
        ref={cardRef}
        className={`video-work-card ${isModalVisible ? 'is-morph-source-hidden' : ''}`}
      >
        <button
          type="button"
          className="video-work-trigger"
          onClick={handleOpenModal}
          aria-haspopup="dialog"
          aria-expanded={isModalVisible}
        >
          <div className="video-work-header">
            <h3>{t(video.titleKey)}</h3>
          </div>

          <p>{description}</p>
          <span className="video-work-open-hint">{t('Projects.openDetails')}</span>
        </button>
      </article>

      {isModalVisible && createPortal(
        <div
          className={`video-modal-overlay ${isAnimating ? 'is-animating' : ''}`}
          onClick={handleCloseModal}
          role="presentation"
        >
          <div
            className={`video-morph-shell is-${modalPhase}`}
            style={modalStyle}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={`video-morph-flipper is-${modalPhase}`}>
              <div className="video-morph-face video-morph-face-front" aria-hidden="true">
                <div className="video-morph-front-content">
                  <div className="video-work-header">
                    <h3>{t(video.titleKey)}</h3>
                  </div>
                  <p>{description}</p>
                  <span className="video-work-open-hint">{t('Projects.openDetails')}</span>
                </div>
              </div>

              <div
                className="video-morph-face video-morph-face-back"
                role="dialog"
                aria-modal="true"
                aria-labelledby={modalTitleId}
              >
                <button
                  type="button"
                  className="video-modal-close"
                  aria-label={t('Projects.closeModalAria')}
                  onClick={handleCloseModal}
                >
                  ×
                </button>

                <div className="video-modal-body">
                  <div className="video-work-header">
                    <h3 id={modalTitleId}>{t(video.titleKey)}</h3>
                  </div>

                  <p className="video-modal-description">{description}</p>

                  {detailItems.length > 0 && (
                    <ul className="video-modal-highlights" aria-label={t('Projects.highlightsAria')}>
                      {detailItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {mountVideo ? (
                    <div className="video-frame-wrapper video-frame-wrapper-modal" style={frameStyle}>
                      <iframe
                        src={video.embedUrl}
                        title={`${t(video.titleKey)} - ${t('Projects.iframeTitleSuffix')}`}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="video-frame-placeholder" style={frameStyle} aria-hidden="true" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default VideoWorkCard
