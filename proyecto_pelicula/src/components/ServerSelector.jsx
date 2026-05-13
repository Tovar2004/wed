import styles from './ServerSelector.module.css'
import { SERVERS } from './servers'

export default function ServerSelector({ value, onChange, imdbId, tmdbId }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Servidor</span>
      <div className={styles.options}>
        {SERVERS.map(s => {
          const disabled = (s.needsTmdb && !tmdbId) || (s.needsImdb && !imdbId)
          return (
            <button
              key={s.id}
              className={`${styles.btn} ${value === s.id ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
              onClick={() => !disabled && onChange(s.id)}
              title={disabled ? 'ID no disponible para este servidor' : s.note}
            >
              {s.label}
              {s.badge && <span className={styles.badge}>{s.badge}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}