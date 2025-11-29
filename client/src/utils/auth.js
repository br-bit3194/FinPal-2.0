// utils/auth.js (or inside a separate auth file)
export const isAuthenticated = () => {
  try {
    const raw = localStorage.getItem("user")
    if (!raw) return false
    const parsed = JSON.parse(raw)
    return Boolean(parsed && parsed.token)
  } catch (_) {
    return false
  }
}
