import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { buildEmbedUrl, saveProgress, getProgress } from '../services/api'
import ServerSelector from '../components/ServerSelector'
import styles from './WatchPage.module.css'

export default function SeriesDetailPage() {
  const { id }  = useParams()
  const [sp]    = useSearchParams()
  const imdbId  = sp.get('imdb') || (id?.startsWith('tt') ? id : null)
  const tmdbId  = sp.get('tmdb') || (!id?.startsWith('tt') ? id : null)

  const [server,  setServer]  = useState('multiembed')
  const [season,  setSeason]  = useState(1)
  const [episode, setEpisode] = useState(1)

  const progressKey   = `${imdbId || tmdbId}_s${season}_e${episode}`
  const savedProgress = getProgress(progressKey)
  const embedUrl      = buildEmbedUrl({ server, isTV: true, tmdbId, imdbId, season, episode })

  useEffect(() => {
    const h = (e) => {
      if (e.data?.type !== 'PLAYER_EVENT') return
      const { player_status, player_progress } = e.data.data
      if (player_status === 'playing') saveProgress(progressKey, player_progress)
      if (player_status === 'completed') setEpisode(ep => ep + 1)
    }
    window.addEventListener('message', h)
    return () => window.removeEventListener('message', h)
  }, [progressKey])

  return (
    <main className={styles.page}>
      <div className={styles.backRow}>
        <Link to="/series" className={styles.back}>← Series</Link>
      </div>

      <div className={styles.tvControls}>
        <div className={styles.selectorGroup}>
          <span className={styles.selectorLabel}>Temporada</span>
          <div className={styles.selectorScroll}>
            {Array.from({ length: 20 }, (_, i) => i + 1).map(s => (
              <button key={s}
                className={`${styles.selectorBtn} ${season === s ? styles.selectorActive : ''}`}
                onClick={() => { setSeason(s); setEpisode(1) }}>{s}</button>
            ))}
          </div>
        </div>
        <div className={styles.selectorGroup}>
          <span className={styles.selectorLabel}>Episodio</span>
          <div className={styles.selectorScroll}>
            {Array.from({ length: 30 }, (_, i) => i + 1).map(ep => (
              <button key={ep}
                className={`${styles.selectorBtn} ${episode === ep ? styles.selectorActive : ''}`}
                onClick={() => setEpisode(ep)}>{ep}</button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <ServerSelector value={server} onChange={setServer} imdbId={imdbId} tmdbId={tmdbId} />
        <span className={styles.currentInfo}>
          T{String(season).padStart(2,'0')}·E{String(episode).padStart(2,'0')}
        </span>
        {savedProgress && (
          <span className={styles.resumeHint}>
            ↻ Desde {Math.floor(savedProgress/60)}m {Math.round(savedProgress%60)}s
          </span>
        )}
      </div>

      <div className={styles.playerWrapper}>
        {embedUrl
          ? <iframe
              key={`${server}-${imdbId}-${tmdbId}-${season}-${episode}`}
              src={embedUrl}
              className={styles.player}
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; scripts"
              referrerPolicy="no-referrer-when-downgrade"
              title="Player"
            />
          : <div className={styles.noEmbed}>
              <span>⚠</span><p>Cambia de servidor para ver este título.</p>
            </div>
        }
      </div>
    </main>
  )
}