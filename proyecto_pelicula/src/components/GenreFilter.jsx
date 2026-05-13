import styles from './GenreFilter.module.css'

export default function GenreFilter({ genres, selected, onChange }) {
  if (!genres.length) return null
  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.pill} ${selected === null ? styles.active : ''}`}
        onClick={() => onChange(null)}
      >
        Todos
      </button>
      {genres.map(genre => (
        <button
          key={genre}
          className={`${styles.pill} ${selected === genre ? styles.active : ''}`}
          onClick={() => onChange(selected === genre ? null : genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  )
}