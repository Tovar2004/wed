import styles from './SortBar.module.css'

const OPTIONS = [
  { value: 'recent',     label: '🕒 Recientes' },
  { value: 'rating',     label: '★ Mejor valoradas' },
  { value: 'popularity', label: '🔥 Populares' },
]

export default function SortBar({ value, onChange }) {
  return (
    <div className={styles.wrapper}>
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          className={`${styles.btn} ${value === opt.value ? styles.active : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}