import axios from 'axios'

const TOKEN_KEY = 'evisa_token_v1'

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}

export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch { /* ignore quota */ }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  timeout: 15000,
})

api.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) setToken(null)
    return Promise.reject(err)
  },
)

export const isNetworkError = (err) =>
  err?.code === 'ERR_NETWORK' || err?.message === 'Network Error' || !err?.response

const baseUrl = api.defaults.baseURL || ''
const isLocalApi = /^https?:\/\/(localhost|127\.|0\.0\.0\.0)/.test(baseUrl)
const onLocalHost = /^(localhost|127\.|0\.0\.0\.0)/.test(typeof location !== 'undefined' ? location.hostname : '')

export const apiError = (err, fallback = 'Request failed') => {
  if (err?.response?.data?.error) return err.response.data.error
  if (err?.code === 'ERR_NETWORK' || err?.message === 'Network Error') {
    if (isLocalApi && !onLocalHost) {
      return `Cannot reach API at ${baseUrl}. The frontend was built without VITE_API_URL — set it to your deployed backend URL and rebuild.`
    }
    return `Cannot reach API at ${baseUrl}. Check your network or that the backend is running.`
  }
  return err?.message || fallback
}
