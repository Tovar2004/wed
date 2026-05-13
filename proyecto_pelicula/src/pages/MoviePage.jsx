import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { buildEmbedUrl, saveProgress, getProgress } from '../services/api'
import ServerSelector from '../components/ServerSelector'
import styles from './WatchPage.module.css'

export default function MoviePage() {
  const { id }         = useParams()
  const [sp]           = useSearchParams()
  const imdbId = sp.get('imdb') || (id?.startsWith('tt') ? id : null)
  const tmdbId = sp.get('tmdb') || (!id?.startsWith('tt') ? id : null)

  const [server, setServer] = useState('multiembed')

  const progressKey   = imdbId || tmdbId
  const savedProgress = getProgress(progressKey)
  const embedUrl      = buildEmbedUrl({ server, isTV: false, tmdbId, imdbId })

  useEffect(() => {
    const h = (e) => {
      if (e.data?.type !== 'PLAYER_EVENT') return
      if (e.data.data.player_status === 'playing')
        saveProgress(progressKey, e.data.data.player_progress)
    }
    window.addEventListener('message', h)
    return () => window.removeEventListener('message', h)
  }, [progressKey])

  return (
    <main className={styles.page}>
      <div className={styles.backRow}>
        <Link to="/" className={styles.back}>← Películas</Link>
      </div>
      <div className={styles.controls}>
        <ServerSelector value={server} onChange={setServer} imdbId={imdbId} tmdbId={tmdbId} />
        {savedProgress && (
          <span className={styles.resumeHint}>
            ↻ Desde {Math.floor(savedProgress/60)}m {Math.round(savedProgress%60)}s
          </span>
        )}
      </div>
      <div className={styles.playerWrapper}>
        {embedUrl
          ? <iframe
              key={`${server}-${imdbId}-${tmdbId}`}
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