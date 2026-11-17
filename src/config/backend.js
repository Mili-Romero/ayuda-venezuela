const API_BASE = import.meta.env.DEV
  ? 'http://localhost/plasist-backend/'
  : 'https://plasist.org'

export function backendUrl(endpoint) {
  return `${API_BASE.replace(/\/$/, '')}/${endpoint}`
}
