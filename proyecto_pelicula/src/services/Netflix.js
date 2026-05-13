const TMDB_BASE  = 'https://api.themoviedb.org/3'
const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN

const HEADERS = {
  Authorization: `Bearer ${TMDB_TOKEN}`,
  'Content-Type': 'application/json',
}

const IMG          = 'https://image.tmdb.org/t/p/w500'
const IMG_BACKDROP = 'https://image.tmdb.org/t/p/w780'

function adaptItem(item) {
  const isMovie = !!item.title
  return {
    id:          item.id,
    netflix_id:  item.id,
    title:       item.title || item.name,
    type:        isMovie ? 'movie' : 'tv',
    year:        (item.release_date || item.first_air_date || '').slice(0, 4),
    img:         item.poster_path   ? `${IMG}${item.poster_path}`            : null,
    backdrop:    item.backdrop_path ? `${IMG_BACKDROP}${item.backdrop_path}` : null,
    imdb_rating: item.vote_average  ? item.vote_average.toFixed(1)           : null,
    synopsis:    item.overview || '',
    popularity:  item.popularity || 0,
    genre_ids:   item.genre_ids || [],
  }
}

export async function fetchImdbId(tmdbId, type = 'movie') {
  const endpoint = type === 'movie'
    ? `${TMDB_BASE}/movie/${tmdbId}/external_ids`
    : `${TMDB_BASE}/tv/${tmdbId}/external_ids`
  const res = await fetch(endpoint, { headers: HEADERS })
  if (!res.ok) return null
  const data = await res.json()
  return data.imdb_id || null
}

async function fetchPage(url) {
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}

async function fetchMultiplePages(baseUrl, pages = 3) {
  const requests = Array.from({ length: pages }, (_, i) =>
    fetchPage(`${baseUrl}&page=${i + 1}`)
  )
  const results = await Promise.all(requests)
  return results.flatMap(r => (r.results || []).map(adaptItem))
}

// lang: 'es-ES' | 'en-US'
export async function fetchNetflixTrending(lang = 'es-ES') {
  const items = await fetchMultiplePages(
    `${TMDB_BASE}/trending/movie/week?language=${lang}`, 4
  )
  return { results: items }
}

export async function fetchNetflixSeries(lang = 'es-ES') {
  const [trending, topRated, popular] = await Promise.all([
    fetchMultiplePages(`${TMDB_BASE}/trending/tv/week?language=${lang}`, 2),
    fetchMultiplePages(`${TMDB_BASE}/tv/top_rated?language=${lang}`, 2),
    fetchMultiplePages(`${TMDB_BASE}/tv/popular?language=${lang}`, 2),
  ])
  const seen = new Set()
  const all  = [...trending, ...topRated, ...popular].filter(item => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
  return { results: all }
}

export async function fetchNetflixNew(lang = 'es-ES') {
  const [nowPlaying, upcoming] = await Promise.all([
    fetchMultiplePages(`${TMDB_BASE}/movie/now_playing?language=${lang}`, 3),
    fetchMultiplePages(`${TMDB_BASE}/movie/upcoming?language=${lang}`,    2),
  ])
  const seen = new Set()
  const all  = [...nowPlaying, ...upcoming].filter(item => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
  return { results: all }
}