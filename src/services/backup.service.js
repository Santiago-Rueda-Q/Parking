export const NS = 'pc:'

export function collectAll() {
  const data = {}
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith(NS)) {
      try { data[k] = JSON.parse(localStorage.getItem(k)) }
      catch { data[k] = localStorage.getItem(k) }
    }
  }
  return data
}

export function exportAll(filename = 'parkcontrol-backup.json') {
  const blob = new Blob([JSON.stringify(collectAll(), null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function importFromFile(file) {
  const text = await file.text()
  const obj = JSON.parse(text)
  Object.entries(obj).forEach(([k, v]) => {
    if (typeof v === 'string') localStorage.setItem(k, v)
    else localStorage.setItem(k, JSON.stringify(v))
  })
}

export function clearHistory() {
  const patterns = [/pc:entries/i, /pc:exits/i, /pc:history/i, /pc:logs/i]
  const removed = []
  const keys = []
  for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i))
  keys.forEach(k => {
    if (k && patterns.some(rx => rx.test(k))) {
      removed.push(k); localStorage.removeItem(k)
    }
  })
  return removed
}

export function hardReset() {
  const removed = []
  const keys = []
  for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i))
  keys.forEach(k => {
    if (k && k.startsWith(NS)) { removed.push(k); localStorage.removeItem(k) }
  })
  return removed
}
