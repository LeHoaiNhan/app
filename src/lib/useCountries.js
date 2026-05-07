import { useEffect, useState } from 'react'
import { api, apiError } from './api'

export function useCountries() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    api.get('/countries')
      .then(res => { if (alive) setCountries(res.data.countries) })
      .catch(err => { if (alive) setError(apiError(err, 'Failed to load countries')) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  return { countries, loading, error }
}
