import { useState, useEffect } from 'react'

export function usePaginatedFetch(fetchFn, page) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchFn(page)
      .then(d  => { if (!cancelled) setData(d) })
      .catch(e => { if (!cancelled) setError(e.message) })
      .finally(()=> { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [fetchFn, page])

  return { data, loading, error }
}
