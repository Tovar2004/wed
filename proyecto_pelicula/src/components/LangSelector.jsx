import styles from './LangSelector.module.css'

const LANGS = [
  { code: 'es', label: '🇪🇸 ES' },
  { code: 'en', label: '🇺🇸 EN' },
]

export default function LangSelector({ value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Idioma</span>
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          className={`${styles.btn} ${value === code ? styles.active : ''}`}
          onClick={() => onChange(code)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}