import { Link } from 'react-router-dom'
import styles from './MediaCard.module.css'

export default function MediaCard({ item }) {
  const {
    tmdb_id, imdb_id, title, show_title, year, air_date,
    poster_url, rating, genre, type,
    season_number, episode_number, episode_title,
  } = item

  const isEpisode = type === 'episode'
  const isTV      = type === 'tv'

  // Ambos IDs en query params para el selector de servidores
  const q = (tmdb, imdb) => {
    const p = new URLSearchParams()
    if (tmdb) p.set('tmdb', tmdb)
    if (imdb) p.set('imdb', imdb)
    return p.toString() ? `?${p}` : ''
  }

  let to, displayTitle, subtitle
  if (isEpisode) {
    const showId = item.show_imdb_id || item.show_tmdb_id
    to = `/watch/tv/${showId}/${season_number}/${episode_number}${q(item.show_tmdb_id, item.show_imdb_id)}`
    displayTitle = episode_title || `E${episode_number}`
    subtitle = `${show_title} · T${season_number}E${episode_number}`
  } else if (isTV) {
    const id = imdb_id || tmdb_id
    to = `/series/${id}${q(tmdb_id, imdb_id)}`
    displayTitle = title
    subtitle = year
  } else {
    const id = imdb_id || tmdb_id
    to = `/movie/${id}${q(tmdb_id, imdb_id)}`
    displayTitle = title
    subtitle = year
  }

  return (
    <Link to={to} className={styles.card}>
      <div className={styles.poster}>
        {poster_url
          ? <img src={poster_url} alt={displayTitle} loading="lazy" />
          : <div className={styles.posterFallback}><span>{displayTitle?.[0]}</span></div>
        }
        <div className={styles.overlay}>
          <span className={styles.playBtn}>▶</span>
        </div>
        {rating && (
          <div className={styles.rating}>
            <span className={styles.star}>★</span>
            {parseFloat(rating).toFixed(1)}
          </div>
        )}
        <div className={styles.typeBadge}>
          {isEpisode ? 'EP' : isTV ? 'TV' : 'Film'}
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{displayTitle}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
        {genre && !isEpisode && (
          <p className={styles.genre}>{genre.split(',')[0].trim()}</p>
        )}
        {air_date && isEpisode && (
          <p className={styles.genre}>{air_date}</p>
        )}
      </div>
    </Link>
  )
}