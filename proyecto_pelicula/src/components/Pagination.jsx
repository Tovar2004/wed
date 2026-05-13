import styles from './Pagination.module.css'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const delta = 2
  const left  = Math.max(1, page - delta)
  const right = Math.min(totalPages, page + delta)

  if (left > 1)           pages.push(1)
  if (left > 2)           pages.push('...')
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < totalPages - 1) pages.push('...')
  if (right < totalPages)     pages.push(totalPages)

  return (
    <div className={styles.pagination}>
      <button
        className={styles.btn}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        ‹
      </button>

      {pages.map((p, i) =>
        p === '...'
          ? <span key={`dot-${i}`} className={styles.dots}>…</span>
          : <button
              key={p}
              className={`${styles.btn} ${p === page ? styles.active : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
      )}

      <button
        className={styles.btn}
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        ›
      </button>
    </div>
  )
}
