// Clase principal
export class RatesService {
  /** @param {any} repo Debe exponer getRates() o load() */
  constructor(repo) { this.repo = repo }

  // <-- NUEVO: para que ReportsService pueda hacer ratesSvc.load()
  async load() {
    if (typeof this.repo?.getRates === 'function') {
      return await this.repo.getRates()
    }
    if (typeof this.repo?.load === 'function') {
      return await this.repo.load()
    }
    // fallback por si no hay repo aún
    return {
      carPerHour: 5,
      motoPerHour: 3,
      bikePerHour: 1,
      vipDiscountPercent: 0,
      updatedAt: new Date().toISOString(),
    }
  }

  // Tu helper actual (lo conservo)
  async pricePerHour(type, flags = {}) {
    const r = await this.load()
    const t = String(type || '').toLowerCase()

    let base = 0
    if (t.startsWith('car') || t.startsWith('carro')) base = r.carPerHour ?? r.car ?? 0
    else if (t.startsWith('mot')) base = r.motoPerHour ?? r.moto ?? 0
    else base = r.bikePerHour ?? r.bici ?? r.bike ?? 0

    // descuento VIP (%)
    if (flags.vip) base = base * (1 - ((r.vipDiscountPercent ?? 0) / 100))
    // factor de discapacidad si lo manejas (opcional)
    if (flags.disability) base = base * (r.disabilityFactor ?? 1)

    return Math.round(base * 100) / 100
  }

  // Tu helper actual (lo conservo)
  billableHours(startISO, end = new Date()) {
    const ms = new Date(end).getTime() - new Date(startISO).getTime()
    const h = ms / 3_600_000
    return Math.max(1, Math.ceil(h))
  }
}

/**
 * <-- NUEVO: export nombrado requerido por ReportsService
 * Calcula el monto dado minutos, tipo e indicador VIP.
 * policy = 'ceil' cobra por horas completas (mínimo 1 si hay minutos)
 */
export function computeAmount({ minutes, type, isVip }, rates, policy = 'ceil') {
  const hoursRaw = Math.max(0, Number(minutes || 0)) / 60
  const hours = policy === 'exact' ? hoursRaw : Math.ceil(hoursRaw || 0.01)

  const t = String(type || '').toLowerCase()
  let perHour = 0
  if (t.startsWith('car') || t.startsWith('carro')) perHour = rates.carPerHour ?? rates.car ?? 0
  else if (t.startsWith('mot')) perHour = rates.motoPerHour ?? rates.moto ?? 0
  else perHour = rates.bikePerHour ?? rates.bici ?? rates.bike ?? 0

  let total = hours * perHour
  if (isVip) total = total * (1 - ((rates.vipDiscountPercent ?? 0) / 100))

  return Number(total.toFixed(2))
}