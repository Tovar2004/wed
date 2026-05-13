import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './NetflixCard.module.css'

export default function NetflixCard({ item }) {
  const id       = item.netflix_id || item.id
  const isMovie  = item.type === 'movie'
  const poster   = item.img || item.poster || item.artwork
  const backdrop = item.backdrop
  const year     = item.year
  const rating   = item.imdb_rating || item.rating
  const synopsis = item.synopsis

  const [hovered, setHovered]       = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const hoverTimer  = useRef(null)
  const playerTimer = useRef(null)
  const navigate    = useNavigate()

  const handleEnter = () => {
    hoverTimer.current = setTimeout(() => {
      setHovered(true)
      playerTimer.current = setTimeout(() => setShowPlayer(true), 350)
    }, 400)
  }

  const handleLeave = () => {
    clearTimeout(hoverTimer.current)
    clearTimeout(playerTimer.current)
    setHovered(false)
    setShowPlayer(false)
  }

  const goToWatch = (e) => {
    e.stopPropagation()
    const params = new URLSearchParams({
      type:     item.type,
      title:    item.title || '',
      backdrop: backdrop || '',
    })
    navigate(`/exclusivo/watch/${id}?${params}`)
  }

  return (
    <div
      className={`${styles.wrapper} ${hovered ? styles.expanded : ''}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* ── Card base ── */}
      <div className={styles.card}>
        <div className={styles.poster}>
          {poster
            ? <img src={poster} alt={item.title} loading="lazy" className={styles.posterImg} />
            : <div className={styles.posterFallback}><span>{item.title?.[0]}</span></div>
          }
          {!hovered && (
            <div className={styles.overlay}>
              <span className={styles.playBtn}>▶</span>
            </div>
          )}
          {rating && (
            <div className={styles.rating}>
              <span className={styles.star}>★</span>{rating}
            </div>
          )}
          <div className={styles.typeBadge}>{isMovie ? 'Film' : 'TV'}</div>
        </div>

        <div className={styles.info}>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.year}>{year}</p>
        </div>
      </div>

      {/* ── Panel expandido ARRIBA ── */}
      {hovered && (
        <div className={styles.expandPanel}>
          <div className={styles.previewArea}>
            {showPlayer ? (
              /* preview pequeño sin audio — solo visual */
              <img
                src={backdrop || poster}
                alt={item.title}
                className={styles.backdropImg}
              />
            ) : (
              <img
                src={backdrop || poster}
                alt={item.title}
                className={styles.backdropImg}
              />
            )}

            <div className={styles.previewGradient} />

            <div className={styles.previewInfo}>
              <h4 className={styles.expandTitle}>{item.title}</h4>
              <div className={styles.expandMeta}>
                {year   && <span className={styles.metaChip}>{year}</span>}
                {rating && (
                  <span className={styles.metaChip}>
                    <span className={styles.starSmall}>★</span> {rating}
                  </span>
                )}
                <span className={styles.metaChip}>{isMovie ? 'Película' : 'Serie'}</span>
              </div>

              {/* Botón Ver completa — siempre visible */}
              <button className={styles.watchBtn} onClick={goToWatch}>
                ▶ Ver completa
              </button>
            </div>
          </div>

          {synopsis && (
            <p className={styles.synopsis}>
              {synopsis.length > 120 ? synopsis.slice(0, 120) + '…' : synopsis}
            </p>
          )}
        </div>
      )}
    </div>
  )
}