import { useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function useInView({ rootMargin = '0px 0px -10% 0px', threshold = 0.15, once = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) obs.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin, threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [rootMargin, threshold, once])

  return [ref, inView]
}

export function Reveal({ children, as: Tag = 'div', delay = 0, className = '', style, ...rest }) {
  const [ref, inView] = useInView()
  const reduced = prefersReducedMotion()
  const cls = `reveal${reduced || inView ? ' is-revealed' : ''}${className ? ' ' + className : ''}`
  return (
    <Tag ref={ref} className={cls} style={{ transitionDelay: `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  )
}

export function CountUp({ end, suffix = '', prefix = '', duration = 1400, className, style }) {
  const [ref, inView] = useInView()
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (prefersReducedMotion()) { setVal(end); return }
    const start = performance.now()
    let raf = 0
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setVal(Math.round(end * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, end, duration])

  return <span ref={ref} className={className} style={style}>{prefix}{val}{suffix}</span>
}
