import { useState, useEffect, useRef } from 'react'

const SEARCH_PAGES = 8

export function useSearch(fetchFn, query) {
  const [results, setResults]     = useState([])
  const [searching, setSearching] = useState(false)
  const [error, setError]         = useState(null)
  const abortRef                  = useRef(null)

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]); setSearching(false); return
    }
    if (abortRef.current) abortRef.current.aborted = true
    const token = { aborted: false }
    abortRef.current = token

    setSearching(true); setError(null)

    const pages = Array.from({ length: SEARCH_PAGES }, (_, i) => fetchFn(i + 1))

    Promise.all(pages)
      .then(responses => {
        if (token.aborted) return
        const q = query.toLowerCase()
        const all = responses.flatMap(r => r.items || [])
        const filtered = all.filter(item => {
          const title = (item.title || item.show_title || item.episode_title || '').toLowerCase()
          return title.includes(q)
        })
        setResults(filtered)
      })
      .catch(e => { if (!token.aborted) setError(e.message) })
      .finally(()=> { if (!token.aborted) setSearching(false) })
  }, [fetchFn, query])

  return { results, searching, error }
}