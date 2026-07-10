import { useEffect, useRef } from 'react'

/**
 * Custom hook for synchronizing horizontal scroll between player header and table sections
 * Uses requestAnimationFrame for optimized performance
 */
export function useSynchronizedScroll() {
  const playerHeaderRef = useRef<HTMLDivElement | null>(null)
  const upperTableRef = useRef<HTMLDivElement | null>(null)
  const lowerTableRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Sheets with a single table only attach some of the refs
    const elements = [playerHeaderRef.current, upperTableRef.current, lowerTableRef.current]
      .filter((el): el is HTMLDivElement => el !== null)

    if (elements.length < 2) return

    let isScrolling = false

    const syncScroll = (source: HTMLDivElement) => {
      if (isScrolling) return

      isScrolling = true
      requestAnimationFrame(() => {
        elements.forEach(target => {
          if (target !== source) {
            target.scrollLeft = source.scrollLeft
          }
        })
        isScrolling = false
      })
    }

    const handlers = elements.map(el => {
      const handler = () => syncScroll(el)
      el.addEventListener('scroll', handler)
      return [el, handler] as const
    })

    return () => {
      handlers.forEach(([el, handler]) => el.removeEventListener('scroll', handler))
    }
  }, [])

  return {
    playerHeaderRef,
    upperTableRef,
    lowerTableRef
  }
}