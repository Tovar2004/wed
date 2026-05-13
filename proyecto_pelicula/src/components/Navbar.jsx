import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { to: '/',          label: 'Películas'    },
  { to: '/series',    label: 'Series'       },
  { to: '/episodes',  label: 'Episodios'    },
  { to: '/exclusivo', label: '🎬 Exclusivo' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>SV</span>
          <span className={styles.logoText}>StreamVault</span>
        </Link>
        <ul className={styles.links}>
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`${styles.link} ${pathname === to ? styles.active : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}