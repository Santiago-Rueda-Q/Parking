// Reportes: métricas + utilidades
import { computeAmount } from './rates.service'   // usa el helper del módulo de tarifas

export class ReportsService {
  // entriesSvc y ratesSvc pueden venir null; dejamos fallbacks seguros
  constructor(entriesSvc, ratesSvc) {
    this.entriesSvc = entriesSvc || null
    this.ratesSvc = ratesSvc || {
      load: async () => ({
        carPerHour: 5,
        motoPerHour: 3,
        bikePerHour: 1,
        vipDiscountPercent: 0,
        updatedAt: new Date().toISOString(),
      }),
    }
  }

  normalizeMovement(x) {
    if (!x) return null
    const entryAt = new Date(x.entryAt ?? x.ingreso ?? x.Ingreso ?? x.fchIngreso ?? x.fechaIngreso ?? x.in)
    const exitAt  = x.exitAt  ?? x.endedAtISO ?? x.salida ?? x.Salida ?? x.fchSalida ?? x.fechaSalida ?? x.out
      ? new Date(x.exitAt ?? x.salida ?? x.Salida ?? x.fchSalida ?? x.fechaSalida ?? x.out)
      : null
    const type    = String(x.type ?? x.tipo ?? x.vehicleType ?? 'Car')
    const plate   = String(x.plate ?? x.placa ?? x.Placa ?? 'SIN-PLT')
    const isVip   = !!(x.isVip ?? x.vip ?? x.esVip)
    const client  = x.client ?? x.cliente ?? null
    const space   = x.space ?? x.ubicacion ?? x.slot ?? null
    if (!Number.isFinite(entryAt?.getTime())) return null
    return { entryAt, exitAt, type, plate, isVip, client, space, _raw: x }
  }

  async loadMovements() {
    let list = []
    // 1) intenta por servicio si existe
    try {
      if (this.entriesSvc?.listAll) list = await this.entriesSvc.listAll()
      else if (this.entriesSvc?.getHistory) list = await this.entriesSvc.getHistory()
    } catch {}
    // 2) fallback: localStorage
    if (!Array.isArray(list) || list.length === 0) {
      const keys = []
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && /^pc:(entries|exits|history)/i.test(k)) keys.push(k)
      }
      const raw = keys.flatMap(k => {
        try { return JSON.parse(localStorage.getItem(k)) || [] } catch { return [] }
      })
      list = Array.isArray(raw) ? raw : []
    }
    // solo movimientos cerrados (con salida)
    return list.map(x => this.normalizeMovement(x)).filter(m => m && m.exitAt)
  }

  filterByRange(list, from, to) {
    if (!from && !to) return list
    const start = from ? new Date(from) : null
    const end   = to   ? new Date(to)   : null
    if (end) end.setHours(23,59,59,999)
    return list.filter(m => {
      const t = m.exitAt?.getTime() ?? m.entryAt.getTime()
      if (start && t < start.getTime()) return false
      if (end   && t > end.getTime())   return false
      return true
    })
  }

  minutesBetween(a, b) {
    const ms = Math.max(0, (b?.getTime?.() ?? 0) - (a?.getTime?.() ?? 0))
    return Math.round(ms / 60000)
  }

  groupByDay(list) {
    const map = new Map()
    for (const m of list) {
      const d = (m.exitAt || m.entryAt)
      const key = d.toISOString().slice(0,10)
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(m)
    }
    return map
  }

  async computeStats({ from=null, to=null, rounding='ceil' } = {}) {
    const rates = await (this.ratesSvc?.load?.() ?? Promise.resolve({
      carPerHour: 5, motoPerHour: 3, bikePerHour: 1, vipDiscountPercent: 0
    }))
    const all   = await this.loadMovements()
    const data  = this.filterByRange(all, from, to)

    let totalRevenue = 0
    const rows = []
    const counts = { car:0, moto:0, bike:0 }

    for (const m of data) {
      const minutes = this.minutesBetween(m.entryAt, m.exitAt)
      const amount  = computeAmount({ minutes, type: m.type, isVip: m.isVip }, rates, rounding)
      totalRevenue += amount
      const lt = m.type.toLowerCase()
      if (lt.startsWith('car') || lt.startsWith('carro')) counts.car++
      else if (lt.startsWith('mot')) counts.moto++
      else counts.bike++
      rows.push({
        plate: m.plate, type: m.type, space: m.space,
        entryAt: m.entryAt, exitAt: m.exitAt,
        minutes, hours: +(minutes/60).toFixed(2),
        client: typeof m.client === 'string' ? m.client : (m.client?.name ?? m.client?.nombre ?? ''),
        isVip: m.isVip, amount
      })
    }

    const days = this.groupByDay(data)
    const totalMovs = data.length
    const avgPerDay = days.size ? +(totalMovs / days.size).toFixed(2) : 0

    return {
      totalMovements: totalMovs,
      totalRevenue: +totalRevenue.toFixed(2),
      avgPerDay,
      counts,
      rows,
      period: { from, to, days: days.size }
    }
  }

  exportCSV(stats, filename='reporte-movimientos.csv', currency='$') {
    const sep = ','
    const head = ['Placa','Tipo','Ubicación','Ingreso','Salida','Minutos','Horas','Cliente','VIP','Monto'].join(sep)
    const lines = stats.rows.map(r => [
      r.plate, r.type, r.space ?? '',
      r.entryAt.toLocaleString(), r.exitAt?.toLocaleString() ?? '',
      r.minutes, r.hours, (r.client ?? '').toString().replace(sep,' '),
      r.isVip ? 'Sí' : 'No',
      `${currency}${r.amount}`
    ].join(sep))
    const csv = [head, ...lines].join('\n')
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}
