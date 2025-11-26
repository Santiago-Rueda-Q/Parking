export class SettingsService {
  // repo debe implementar load/save
  constructor(repo) {
    this.repo = repo
    this.listeners = new Set()
  }

  getDefault() {
    return {
      appName: 'ParkControl',
      language: 'es',
      currencySymbol: '$',
      theme: 'system',
      features: { enableVip: true, enableDisability: true },
      printing: { enableTickets: true, footerText: '¡Gracias por su visita!' },
      businessAddress: '',
      businessPhone: '',
    }
  }

  normalize(x) {
    const d = this.getDefault()
    x = x || {}
    return {
      appName: String(x.appName ?? d.appName),
      language: (x.language === 'en' ? 'en' : 'es'),
      currencySymbol: String(x.currencySymbol ?? d.currencySymbol),
      theme: (['system','light','dark'].includes(x.theme) ? x.theme : 'system'),
      features: {
        enableVip: !!(x.features?.enableVip ?? d.features.enableVip),
        enableDisability: !!(x.features?.enableDisability ?? d.features.enableDisability),
      },
      printing: {
        enableTickets: !!(x.printing?.enableTickets ?? d.printing.enableTickets),
        footerText: String(x.printing?.footerText ?? d.printing.footerText),
      },
      businessAddress: String(x.businessAddress ?? d.businessAddress),
      businessPhone: String(x.businessPhone ?? d.businessPhone),
    }
  }

  async load() {
    const raw = await this.repo.load()
    return this.normalize(raw)
  }

  async save(data) {
    const norm = this.normalize(data)
    await this.repo.save(norm)
    this.emit(norm)
    return norm
  }

  /** @param {(s:any)=>void} fn */
  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn) }
  emit(v) { for (const fn of this.listeners) try { fn(v) } catch {} }
}

// Helper para aplicar el tema al <html>
export function applyTheme(theme) {
  const root = document.documentElement
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  const set = (isDark) => root.classList.toggle('dark', isDark)
  if (theme === 'dark') set(true)
  else if (theme === 'light') set(false)
  else set(mql.matches)
}
