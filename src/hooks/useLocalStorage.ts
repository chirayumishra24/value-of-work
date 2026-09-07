export function readStored<T>(key: string): T | null {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : null } catch { return null }
}

export function writeStored<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* Storage is optional. */ }
}

export function removeStored(key: string) {
  try { localStorage.removeItem(key) } catch { /* Storage is optional. */ }
}
