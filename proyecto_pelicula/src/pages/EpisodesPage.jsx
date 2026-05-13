import { useCallback, useState, useMemo } from 'react'
import { usePaginatedFetch }    from '../hooks/usePaginatedFetch'
import { useSearch }            from '../hooks/useSearch'
import { fetchLatestEpisodes }  from '../services/api'
import MediaCard                from '../components/MediaCard'
import Pagination               from '../components/Pagination'
import SearchBar                from '../components/SearchBar'
import SortBar                  from '../components/SortBar'
import LangSelector             from '../components/LangSelector'
import { SkeletonGrid }         from '../components/Skeleton'
import styles                   from './CatalogPage.module.css'

export default function EpisodesPage() {
  const [page, setPage]   = useState(1)
  const [query, setQuery] = useState('')
  const [sort, setSort]   = useState('recent')
  const [lang, setLang]   = useState('es')

  const fetchFn = useCallback((p) => fetchLatestEpisodes(p), [])
  const { data, loading, error }              = usePaginatedFetch(fetchFn, page)
  const { results: searchResults, searching } = useSearch(fetchFn, query)

  const isSearchMode = query.length >= 2
  const baseItems    = isSearchMode ? searchResults : (data?.items ?? [])

  const sorted = useMemo(() => {
    const arr = [...baseItems]
    if (sort === 'rating')     return arr.sort((a,b) => parseFloat(b.rating||0)     - parseFloat(a.rating||0))
    if (sort === 'popularity') return arr.sort((a,b) => parseFloat(b.popularity||0) - parseFloat(a.popularity||0))
    return arr
  }, [baseItems, sort])

  const handlePage   = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const handleSearch = useCallback((q) => { setQuery(q); setPage(1) }, [])

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Episodios</h1>
        <p className={styles.heroSub}>
          {data ? `${data.total.toLocaleString()} episodios disponibles` : '…'}
        </p>
      </div>

      <div className={styles.container}>
        <div className={styles.toolbar}>
          <SearchBar onSearch={handleSearch} placeholder="Buscar por título de episodio o serie…" isSearching={searching} />
          <SortBar value={sort} onChange={setSort} />
          <LangSelector value={lang} onChange={setLang} />
        </div>

        {isSearchMode && (
          <div className={styles.activeFilters}>
            <span className={styles.filterTag}>
              «{query}» <span className={styles.resultCount}>{sorted.length} resultados</span>
            </span>
          </div>
        )}

        {error && <p className={styles.error}>⚠ {error}</p>}

        {(loading || searching)
          ? <SkeletonGrid count={24} />
          : sorted.length === 0
            ? <div className={styles.empty}>
                <span className={styles.emptyIcon}>📺</span>
                <p>No encontramos resultados.</p>
              </div>
            : <div className={styles.grid}>
                {sorted.map((item, i) => (
                  <MediaCard
                    key={`${item.show_tmdb_id}-${item.season_number}-${item.episode_number}-${i}`}
                    item={item}
                    lang={lang}
                  />
                ))}
              </div>
        }

        {!isSearchMode && data && (
          <Pagination page={page} totalPages={data.total_pages} onPageChange={handlePage} />
        )}
      </div>
    </main>
  )
}