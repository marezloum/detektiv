/** Prefix a `public/` path with Vite's base URL (needed on GitHub Pages). */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL
  if (!path || path.startsWith('http') || path.startsWith('data:')) return path
  if (base !== '/' && path.startsWith(base)) return path
  return `${base}${path.replace(/^\//, '')}`
}
