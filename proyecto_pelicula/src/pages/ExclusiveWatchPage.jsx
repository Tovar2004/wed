import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useState, useEffect, useReducer } from 'react'
import { fetchImdbId } from '../services/netflix'
import { buildEmbedUrl } from '../services/api'
import ServerSelector from '../components/ServerSelector'
import styles from './ExclusiveWatchPage.module.css'

const initialState = { imdbId: null, loading: true, error: false }

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START': return { imdbId: null,           loading: true,  error: false }
    case 'FETCH_OK':    return { imdbId: action.payload, loading: false, error: false }
    case 'FETCH_ERROR': return { imdbId: null,           loading: false, error: true  }
    default:            return state
  }
}

export default function ExclusiveWatchPage() {
  const { id }   = useParams()
  const [sp]     = useSearchParams()
  const type     = sp.get('type')     || 'movie'
  const title    = sp.get('title')    || ''
  const backdrop = sp.get('backdrop') || ''

  const [{ imdbId, loading }, dispatch] = useReducer(reducer, initialState)
  const [server,  setServer]  = useState('multiembed')
  const [season,  setSeason]  = useState(1)
  const [episode, setEpisode] = useState(1)

  useEffect(() => {
    let cancelled = false
    dispatch({ type: 'FETCH_START' })
    fetchImdbId(id, type)
      .then(iid => { if (!cancelled) dispatch({ type: 'FETCH_OK',    payload: iid }) })
      .catch(()  => { if (!cancelled) dispatch({ type: 'FETCH_ERROR' }) })
    return () => { cancelled = true }
  }, [id, type])

  const embedUrl = buildEmbedUrl({
    server,
    isTV:   type === 'tv',
    tmdbId: id,
    imdbId,
    season,
    episode,
  })

  return (
    <main className={styles.page}>
      {backdrop && (
        <div className={styles.bgBackdrop} style={{ backgroundImage: `url(${backdrop})` }} />
      )}
      <div className={styles.bgOverlay} />

      <div className={styles.inner}>
        <div className={styles.header}>
          <Link to="/exclusivo" className={styles.back}>← Exclusivo</Link>
          {title && <h1 className={styles.titleText}>{title}</h1>}
        </div>

        {type === 'tv' && (
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
        )}

        <div className={styles.serverBar}>
          <ServerSelector value={server} onChange={setServer} tmdbId={id} imdbId={imdbId} />
          {!loading && !imdbId && (
            <span className={styles.imdbNote}>
              ⚠ IMDB ID no encontrado — Servidor 1 disponible
            </span>
          )}
        </div>

        <div className={styles.playerShell}>
          {loading && (
            <div className={styles.loadingState}>
              <span className={styles.loadingSpinner} />
              <p>Cargando reproductor…</p>
            </div>
          )}
          {!loading && !embedUrl && (
            <div className={styles.errorState}>
              <span>⚠</span>
              <p>Cambia de servidor para ver este título.</p>
            </div>
          )}
          {!loading && embedUrl && (
            <iframe
              key={`${server}-${id}-${imdbId}-${season}-${episode}`}
              src={embedUrl}
              className={styles.player}
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; scripts"
              referrerPolicy="no-referrer-when-downgrade"
              title={title}
            />
          )}
        </div>
      </div>
    </main>
  )
}