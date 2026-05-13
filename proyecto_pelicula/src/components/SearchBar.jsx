import { useState, useEffect, useRef } from 'react'
import styles from './SearchBar.module.css'

export default function SearchBar({ onSearch, placeholder = 'Buscar...', isSearching = false }) {
  const [value, setValue] = useState('')
  const debounceRef = useRef(null)

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearch(value.trim())
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [value, onSearch])

  const clear = () => { setValue(''); onSearch('') }

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.bar} ${isSearching ? styles.searching : ''}`}>
        <span className={styles.icon}>
          {isSearching
            ? <span className={styles.spinner} />
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          }
        </span>
        <input
          className={styles.input}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
        />
        {value && (
          <button className={styles.clearBtn} onClick={clear}>✕</button>
        )}
      </div>
      {value.length > 0 && value.length < 2 && (
        <p className={styles.hint}>Escribe al menos 2 caracteres…</p>
      )}
    </div>
  )
}