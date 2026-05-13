export function extractGenres(items = []) {
  const set = new Set()
  items.forEach(item => {
    if (!item.genre) return
    item.genre.split(',').forEach(g => {
      const trimmed = g.trim()
      if (trimmed) set.add(trimmed)
    })
  })
  return Array.from(set).sort()
}