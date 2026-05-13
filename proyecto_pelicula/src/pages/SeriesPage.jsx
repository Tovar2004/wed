import { useCallback, useState, useMemo } from 'react'
import { usePaginatedFetch }  from '../hooks/usePaginatedFetch'
import { useSearch }          from '../hooks/useSearch'
import { fetchLatestTVShows } from '../services/api'
import MediaCard              from '../components/MediaCard'
import Pagination             from '../components/Pagination'
import SearchBar              from '../components/SearchBar'
import GenreFilter from '../components/GenreFilter'
import { extractGenres } from '../utils/genreUtils'
import SortBar                from '../components/SortBar'
import LangSelector           from '../components/LangSelector'
import { SkeletonGrid }       from '../components/Skeleton'
import styles                 from './CatalogPage.module.css'

export default function SeriesPage() {
  const [page, setPage]   = useState(1)
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState(null)
  const [sort, setSort]   = useState('recent')
  const [lang, setLang]   = useState('es')

  const fetchFn = useCallback((p) => fetchLatestTVShows(p), [])
  const { data, loading, error }              = usePaginatedFetch(fetchFn, page)
  const { results: searchResults, searching } = useSearch(fetchFn, query)

  const isSearchMode = query.length >= 2
  const baseItems    = isSearchMode ? searchResults : (data?.items ?? [])

  const afterGenre = useMemo(() => {
    if (!genre) return baseItems
    return baseItems.filter(item => item.genre?.toLowerCase().includes(genre.toLowerCase()))
  }, [baseItems, genre])

  const sorted = useMemo(() => {
    const arr = [...afterGenre]
    if (sort === 'rating')     return arr.sort((a,b) => parseFloat(b.rating||0)     - parseFloat(a.rating||0))
    if (sort === 'popularity') return arr.sort((a,b) => parseFloat(b.popularity||0) - parseFloat(a.popularity||0))
    return arr
  }, [afterGenre, sort])

  const genres = useMemo(() => extractGenres(data?.items ?? []), [data])

  const handlePage   = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const handleSearch = useCallback((q) => { setQuery(q); setGenre(null); setPage(1) }, [])
  const handleGenre  = (g) => { setGenre(g); setPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Series</h1>
        <p className={styles.heroSub}>
          {data ? `${data.total.toLocaleString()} series disponibles` : '…'}
        </p>
      </div>

      <div className={styles.container}>
        <div className={styles.toolbar}>
          <SearchBar onSearch={handleSearch} placeholder="Buscar serie por título…" isSearching={searching} />
          <SortBar value={sort} onChange={setSort} />
          <LangSelector value={lang} onChange={setLang} />
        </div>

        {!isSearchMode && (
          <GenreFilter genres={genres} selected={genre} onChange={handleGenre} />
        )}

        {(genre || isSearchMode) && (
          <div className={styles.activeFilters}>
            {isSearchMode && (
              <span className={styles.filterTag}>
                «{query}» <span className={styles.resultCount}>{sorted.length} resultados</span>
              </span>
            )}
            {genre && (
              <button className={styles.filterTag} onClick={() => setGenre(null)}>{genre} ✕</button>
            )}
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
                {sorted.map(item => (
                  <MediaCard key={item.tmdb_id || item.imdb_id} item={item} lang={lang} />
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