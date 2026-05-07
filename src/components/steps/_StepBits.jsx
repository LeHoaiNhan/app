import { cloneElement, isValidElement, useId } from 'react'

export function Field({ label, required, error, hint, children }) {
  const id = useId()
  const errorId = error ? `${id}-err` : undefined
  const hintId = hint && !error ? `${id}-hint` : undefined
  const child = wrapChild(children, { id, errorId, hintId, error })
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}{required && <span className="req"> *</span>}
      </label>
      {child}
      {error ? (
        <p id={errorId} role="alert" style={{ fontSize:11, color:'#B91C1C', marginTop:4, fontWeight:500 }}>{error}</p>
      ) : hint ? (
        <p id={hintId} className="field-hint">{hint}</p>
      ) : null}
    </div>
  )
}

// Inject id/aria attributes onto a single child input/select/textarea or a
// wrapper div containing one (so callers don't need to remember to pass props).
function wrapChild(children, { id, errorId, hintId, error }) {
  if (!isValidElement(children)) return children
  return cloneElement(children, {
    id: children.props.id || id,
    'aria-invalid': error ? 'true' : children.props['aria-invalid'],
    'aria-describedby': [errorId, hintId, children.props['aria-describedby']].filter(Boolean).join(' ') || undefined,
  })
}

export const ERROR_STYLE = { borderColor: '#B91C1C', background: '#FEF2F2' }

export function ErrorBanner({ count }) {
  if (!count) return null
  return (
    <div className="form-error-banner" role="alert">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
      </svg>
      <div><strong>{count} field{count > 1 ? 's' : ''}</strong> need{count === 1 ? 's' : ''} attention. Please review the highlighted items below.</div>
    </div>
  )
}

export function TrustStrip() {
  return (
    <div className="trust-strip">
      <span className="ts-item">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        SSL 256-bit secure
      </span>
      <span className="ts-item">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Money-back guarantee
      </span>
      <span className="ts-item">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        24/7 support
      </span>
    </div>
  )
}
