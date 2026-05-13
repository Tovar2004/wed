import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { buildEmbedUrl, saveProgress, getProgress } from '../services/api'
import ServerSelector from '../components/ServerSelector'
import styles from './WatchPage.module.css'

export default function EpisodeWatchPage() {
  const { id, season, episode: epParam } = useParams()
  const [sp]   = useSearchParams()
  const imdbId = sp.get('imdb') || (id?.startsWith('tt') ? id : null)
  const tmdbId = sp.get('tmdb') || (!id?.startsWith('tt') ? id : null)

  const [server,  setServer]  = useState('multiembed')
  const [episode, setEpisode] = useState(parseInt(epParam))

  const progressKey   = `${imdbId || tmdbId}_s${season}_e${episode}`
  const savedProgress = getProgress(progressKey)
  const embedUrl      = buildEmbedUrl({ server, isTV: true, tmdbId, imdbId, season: parseInt(season), episode })

  useEffect(() => {
    const h = (e) => {
      if (e.data?.type !== 'PLAYER_EVENT') return
      if (e.data.data.player_status === 'playing')
        saveProgress(progressKey, e.data.data.player_progress)
      if (e.data.data.player_status === 'completed')
        setEpisode(ep => ep + 1)
    }
    window.addEventListener('message', h)
    return () => window.removeEventListener('message', h)
  }, [progressKey])

  return (
    <main className={styles.page}>
      <div className={styles.backRow}>
        <Link to="/episodes" className={styles.back}>← Episodios</Link>
      </div>
      <div className={styles.controls}>
        <ServerSelector value={server} onChange={setServer} imdbId={imdbId} tmdbId={tmdbId} />
        <span className={styles.currentInfo}>
          T{String(season).padStart(2,'0')}·E{String(episode).padStart(2,'0')}
        </span>
        <div className={styles.epNav}>
          <button className={styles.epBtn} disabled={episode <= 1}
            onClick={() => setEpisode(ep => ep - 1)}>← Anterior</button>
          <button className={styles.epBtn}
            onClick={() => setEpisode(ep => ep + 1)}>Siguiente →</button>
        </div>
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