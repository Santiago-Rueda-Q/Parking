// src/services/reports.service.js
export class ReportsService {
  /**
   * @param {import('./exits.service').ExitsService} exitsService
   * @param {import('./rates.service').RatesService} ratesService
   */
  constructor(exitsService, ratesService) {
    this.exitsService = exitsService
    this.ratesService = ratesService
  }

  /**
   * Historial crudo de facturas
   * Cada item debería tener: entry, endedAtISO, hours, ratePerHour, total
   */
  async getHistory() {
    const rows = await this.exitsService.history?.()
    return Array.isArray(rows) ? rows : []
  }

  /**
   * Resumen global: cantidad de vehículos, ingresos y conteo por tipo
   */
  async getSummary() {
    const history = await this.getHistory()

    const totalVehicles = history.length
    const totalRevenue = history.reduce(
      (acc, r) => acc + (Number(r.total) || 0),
      0
    )

    const byType = history.reduce((map, r) => {
      const type = r.entry?.type || 'desconocido'
      map[type] = (map[type] || 0) + 1
      return map
    }, {})

    return {
      totalVehicles,
      totalRevenue,
      byType,
    }
  }

  /**
   * Exportar CSV simple del historial de salidas
   */
// src/services/reports.service.js

async exportCsv(filename = 'reportes-parqueadero.csv') {
  // Si tú ya pasas un arreglo filtrado desde la vista, respeta ese parámetro.
  // Si no tienes parámetros, usa la historia completa:
  const history = await this.getHistory()
  if (!history.length) {
    alert('No hay datos para exportar.')
    return
  }

  // 🔥 CABECERAS: ahora incluyen placa, tipo, ingreso, salida
  const headers = [
    'Placa',
    'Tipo',
    'HoraIngreso',
    'HoraSalida',
    'HorasFacturadas',
    'TarifaPorHora',
    'Total',
    'Cliente',
  ]

  const lines = history.map(row => {
    // asumiendo que cada salida tiene una propiedad entry con la info del ingreso
    const e = row.entry || {}
    const plate   = e.plate || ''
    const type    = e.type || ''
    const started = e.startedAtISO || ''
    const ended   = row.endedAtISO || ''
    const hours   = row.hours ?? ''
    const rate    = row.ratePerHour ?? ''
    const total   = row.total ?? ''
    const client  = e.client || 'Cliente Ocasional'

    const vals = [plate, type, started, ended, hours, rate, total, client]

    return vals
      .map(String)
      .map(v => `"${v.replace(/"/g, '""')}"`) // escape CSV
      .join(',')
  })

  const csv = [headers.join(','), ...lines].join('\r\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
}