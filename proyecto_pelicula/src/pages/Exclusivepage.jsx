import { useReducer, useEffect, useMemo } from 'react'
import { fetchNetflixTrending, fetchNetflixSeries, fetchNetflixNew } from '../services/netflix'
import { SkeletonGrid } from '../components/Skeleton'
import SearchBar from '../components/SearchBar'
import NetflixCard from '../components/NetflixCard'
import styles from './ExclusivePage.module.css'

const TABS = [
  { id: 'trending', label: '🔥 Tendencia' },
  { id: 'series',   label: '📺 Series'    },
  { id: 'new',      label: '✨ Novedades' },
]

const LANGS = [
  { code: 'es-ES', label: '🇪🇸 Español' },
  { code: 'en-US', label: '🇺🇸 English' },
]

const initialState = { items: [], loading: true, error: null }

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START': return { items: [],           loading: true,  error: null           }
    case 'FETCH_OK':    return { items: action.payload, loading: false, error: null           }
    case 'FETCH_ERROR': return { items: [],           loading: false, error: action.payload  }
    default:            return state
  }
}

function getFetchFn(tabId) {
  if (tabId === 'series')   return fetchNetflixSeries
  if (tabId === 'new')      return fetchNetflixNew
  return fetchNetflixTrending
}

export default function ExclusivePage() {
  const [activeTab, dispatchTab]               = useReducer((_, id) => id, 'trending')
  const [lang, dispatchLang]                   = useReducer((_, l) => l, 'es-ES')
  const [{ items, loading, error }, dispatch]  = useReducer(reducer, initialState)
  const [query, dispatchQuery]                 = useReducer((_, q) => q, '')

  useEffect(() => {
    let cancelled = false
    dispatch({ type: 'FETCH_START' })

    getFetchFn(activeTab)(lang)
      .then(data => {
        if (cancelled) return
        const raw = data?.results || []
        dispatch({ type: 'FETCH_OK', payload: Array.isArray(raw) ? raw : [] })
      })
      .catch(e => {
        if (!cancelled) dispatch({ type: 'FETCH_ERROR', payload: e.message })
      })

    return () => { cancelled = true }
  }, [activeTab, lang])   // ← se re-fetcha cuando cambia pestaña O idioma

  const filtered = useMemo(() => {
    if (!query || query.length < 2) return items
    return items.filter(item =>
      (item.title || '').toLowerCase().includes(query.toLowerCase())
    )
  }, [items, query])

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <span className={styles.exclusiveTag}>EXCLUSIVO</span>
          <h1 className={styles.heroTitle}>Contenido Netflix</h1>
          <p className={styles.heroSub}>
            Descubre lo más popular, series originales y novedades de Netflix
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.toolbar}>
          {/* Tabs */}
          <div className={styles.tabs}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => { dispatchTab(tab.id); dispatchQuery('') }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Selector de idioma */}
          <div className={styles.langGroup}>
            <span className={styles.langLabel}>Idioma</span>
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                className={`${styles.langBtn} ${lang === code ? styles.langActive : ''}`}
                onClick={() => dispatchLang(code)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Buscador */}
          <SearchBar onSearch={dispatchQuery} placeholder="Buscar en exclusivos…" />
        </div>

        {!loading && !error && (
          <p className={styles.count}>
            {filtered.length} títulos
            {query.length >= 2 && ` para "${query}"`}
          </p>
        )}

        {error && (
          <div className={styles.errorBox}>
            <span>⚠</span>
            <p>{error}</p>
          </div>
        )}

        {loading
          ? <SkeletonGrid count={24} />
          : filtered.length === 0
            ? <div className={styles.empty}>
                <span className={styles.emptyIcon}>🎬</span>
                <p>No encontramos resultados.</p>
              </div>
            : <div className={styles.grid}>
                {filtered.map((item, i) => (
                  <NetflixCard key={item.netflix_id || item.id || i} item={item} />
                ))}
              </div>
        }
      </div>
    </main>
  )
}