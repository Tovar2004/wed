const VIDLINK_BASE    = 'https://player.autoembed.cc/embed'
const MULTIEMBED_BASE = 'https://embed.su/embed'
const VIDSRC_BASE     = 'https://embed.su/embed'

// ── Catálogo VidAPI ───────────────────────────────────────────────────
export async function fetchLatestMovies(page = 1) {
  const res = await fetch(`https://vidapi.ru/movies/latest/page-${page}.json`)
  if (!res.ok) throw new Error('Error al cargar películas')
  return res.json()
}
export async function fetchLatestTVShows(page = 1) {
  const res = await fetch(`https://vidapi.ru/tvshows/latest/page-${page}.json`)
  if (!res.ok) throw new Error('Error al cargar series')
  return res.json()
}
export async function fetchLatestEpisodes(page = 1) {
  const res = await fetch(`https://vidapi.ru/episodes/latest/page-${page}.json`)
  if (!res.ok) throw new Error('Error al cargar episodios')
  return res.json()
}

// ── vidlink  →  usa TMDB ID (Servidor 1) ─────────────────────────────
function vidlinkMovie(tmdbId) {
  return `${VIDLINK_BASE}/movie/${tmdbId}`
}
function vidlinkTV(tmdbId, season, episode) {
  return `${VIDLINK_BASE}/tv/${tmdbId}/${season}/${episode}`
}

// ── multiembed  →  usa IMDB ID (Servidor 2) ──────────────────────────
function multiembedMovie(imdbId) {
  return `${MULTIEMBED_BASE}/?video_id=${imdbId}`
}
function multiembedTV(imdbId, season, episode) {
  return `${MULTIEMBED_BASE}/?video_id=${imdbId}&s=${season}&e=${episode}`
}

// ── vidsrc.cc  →  usa IMDB ID (Servidor 3) ───────────────────────────
function vidsrcMovie(imdbId) {
  return `${VIDSRC_BASE}/movie/${imdbId}`
}
function vidsrcTV(imdbId, season, episode) {
  return `${VIDSRC_BASE}/tv/${imdbId}/${season}/${episode}`
}

// ── Builder maestro ───────────────────────────────────────────────────
export function buildEmbedUrl({
  server,
  isTV    = false,
  tmdbId  = null,
  imdbId  = null,
  season  = 1,
  episode = 1,
}) {
  if (!isTV) {
    if (server === 'letsembed'  && tmdbId) return vidlinkMovie(tmdbId)
    if (server === 'multiembed' && imdbId) return multiembedMovie(imdbId)
    if (server === 'vaplayer'   && imdbId) return vidsrcMovie(imdbId)
  } else {
    if (server === 'letsembed'  && tmdbId) return vidlinkTV(tmdbId, season, episode)
    if (server === 'multiembed' && imdbId) return multiembedTV(imdbId, season, episode)
    if (server === 'vaplayer'   && imdbId) return vidsrcTV(imdbId, season, episode)
  }
  return null
}

// ── Progreso ──────────────────────────────────────────────────────────
export function saveProgress(id, seconds) {
  localStorage.setItem(`sv_progress_${id}`, seconds)
}
export function getProgress(id) {
  return localStorage.getItem(`sv_progress_${id}`)
}
export function clearProgress(id) {
  localStorage.removeItem(`sv_progress_${id}`)
}