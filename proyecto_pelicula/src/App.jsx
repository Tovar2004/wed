import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar             from './components/Navbar'
import MoviesPage         from './pages/MoviesPage'
import SeriesPage         from './pages/SeriesPage'
import EpisodesPage       from './pages/EpisodesPage'
import MoviePage          from './pages/MoviePage'
import SeriesDetailPage   from './pages/SeriesDetailPage'
import EpisodeWatchPage   from './pages/EpisodeWatchPage'
import ExclusivePage      from './pages/ExclusivePage'
import ExclusiveWatchPage from './pages/ExclusiveWatchPage'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"                              element={<MoviesPage />}         />
        <Route path="/series"                        element={<SeriesPage />}         />
        <Route path="/episodes"                      element={<EpisodesPage />}       />
        <Route path="/exclusivo"                     element={<ExclusivePage />}      />
        <Route path="/exclusivo/watch/:id"           element={<ExclusiveWatchPage />} />
        <Route path="/movie/:id"                     element={<MoviePage />}          />
        <Route path="/series/:id"                    element={<SeriesDetailPage />}   />
        <Route path="/watch/tv/:id/:season/:episode" element={<EpisodeWatchPage />}   />
      </Routes>
    </BrowserRouter>
  )
}