import styles from './Skeleton.module.css'

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.poster} />
      <div className={styles.line} style={{ width: '80%' }} />
      <div className={styles.line} style={{ width: '50%', height: '12px' }} />
    </div>
  )
}

export function SkeletonGrid({ count = 24 }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
