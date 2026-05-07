import { useEffect, useState } from 'react'
import { api, apiError } from './api'

export function useServiceTiers() {
  const [tiers, setTiers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    api.get('/service-tiers')
      .then(res => { if (alive) setTiers(res.data.tiers) })
      .catch(err => { if (alive) setError(apiError(err, 'Failed to load tiers')) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  return { tiers, loading, error }
}
