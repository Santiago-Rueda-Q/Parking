import { normalizePlate, isAnonymousPlate } from '@/Domain/Entries/plate.utils.js';

export class ExitsService {

  constructor(repo, entriesService, ratesService) {
    this.repo = repo
    this.entriesService = entriesService
    this.ratesService = ratesService
  }

  async listActiveFiltered(query = '', page = 1, size = 6) {
    const raw = (query || '').trim()
    const q = raw ? (() => { try { return normalizePlate(raw) } catch { return raw.toUpperCase() } })() : ''
    const all = await this.entriesService.listActive()
    const filtered = q
      ? all.filter(e => {
          try { return normalizePlate(e.plate).includes(q) }
          catch { return (e.plate || '').toUpperCase().includes(String(q).toUpperCase()) }
        })
      : all
    const total = filtered.length
    const start = (page - 1) * size
    const items = filtered.slice(start, start + size)
    return { items, total }
  }

  async findActiveByPlate(plate) {
    const raw = String(plate ?? '').toUpperCase().trim();
    const p = isAnonymousPlate(raw) ? 'SIN-PLT' : (() => {
      try { return normalizePlate(raw) } catch { return raw }
      })();
    const all = await this.entriesService.listActive()
    return all.find(e => {
    try {
      const ep = isAnonymousPlate(e.plate) ? 'SIN-PLT' : normalizePlate(e.plate);
      return ep === p;
    } catch {
      return (e.plate || '').toUpperCase().trim() === p;
    }
    }) || null
  }

  async buildInvoice(plate) {
    const entry = await this.findActiveByPlate(plate)
    if (!entry) throw new Error('No se encontró un ingreso activo con esa placa.')

    const endedAtISO = new Date().toISOString()
    const hours = this.ratesService.billableHours(entry.startedAtISO, endedAtISO)
    const rate  = await this.ratesService.pricePerHour(entry.type, { vip: entry.vip, disability: entry.disability })
    const total = Math.round(hours * rate * 100) / 100

    return { entry, hours, ratePerHour: rate, total, endedAtISO }
  }

  async processExit(plate) {
    const invoice = await this.buildInvoice(plate)
    const removed = await this.entriesService.checkOutByPlate(plate)
    if (!removed) throw new Error('No había un ingreso activo para esa placa.')
    await this.repo.append({
      plate: invoice.entry.plate,
      type: invoice.entry.type,
      space: invoice.entry.slotCode,
      client: invoice.entry.client,
      isVip: !!invoice.entry.vip,
      entryAt: new Date(invoice.entry.startedAtISO).toISOString(),
      exitAt:  invoice.endedAtISO,
      hours: invoice.hours,
      ratePerHour: invoice.ratePerHour,
      total: invoice.total,
    })
    return invoice
  }

  async history() { return await this.repo.list() }
}
