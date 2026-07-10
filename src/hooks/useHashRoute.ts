import { useEffect, useState } from 'react'

function getHash(): string {
  return window.location.hash.replace(/^#\/?/, '')
}

/**
 * Minimal hash-based routing so navigation works on GitHub Pages
 * and the browser/phone back gesture behaves as expected
 */
export function useHashRoute(): [string, (route: string) => void] {
  const [route, setRoute] = useState<string>(getHash)

  useEffect(() => {
    const onHashChange = () => setRoute(getHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (next: string) => {
    window.location.hash = next ? `/${next}` : '/'
  }

  return [route, navigate]
}
