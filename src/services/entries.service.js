import { normalizePlate, isAnonymousPlate } from '@/Domain/Entries/plate.utils.js';

export class EntriesService {
  /** @param {import('@/Domain/Entries/EntriesRepository').EntriesRepository} repo */
  constructor(repo) {
    this.repo = repo;
  }

  async listActive() {
    const list = await this.repo.listActive();
    return list
      .filter(e => e && e.startedAtISO)
      .sort((a, b) => new Date(a.startedAtISO) - new Date(b.startedAtISO));
  }

  async summaryByType() {
    const list = await this.listActive();
    const summary = { car: 0, motorcycle: 0, bicycle: 0, vip: 0, disability: 0 };
    for (const e of list) {
      if (summary[e.type] != null) summary[e.type]++;
      if (e.vip) summary.vip++;
      if (e.disability) summary.disability++;
    }
    return summary;
  }

  async isPlateActive(plate) {
    const list = await this.listActive();
    const p = isAnonymousPlate(plate) ? 'SIN-PLT' : normalizePlate(plate);
    return list.some(e => {
      const ep = isAnonymousPlate(e.plate) ? 'SIN-PLT' : normalizePlate(e.plate);
      return ep === p;
    });
  }

  async isSlotOccupied(slotCode) {
    const list = await this.listActive();
    const code = String(slotCode ?? '').toUpperCase().trim();
    return list.some(e => String(e.slotCode ?? '').toUpperCase().trim() === code);
  }

  /** REGISTRO DE ENTRADA */
  async registerEntry(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Entrada inválida.');
    }
    if (!data.type)     throw new Error('Seleccione tipo de vehículo.');
    if (!data.slotCode) throw new Error('Seleccione espacio.');

    // 🔥 Validación de placa (único sitio donde se decide esto)
    const rawPlate = String(data.plate ?? '').toUpperCase().trim();

    if (!rawPlate) {
      // ESTE es el mensaje que estás viendo
      throw new Error('La placa es obligatoria.');
    }

    const plate = isAnonymousPlate(rawPlate)
      ? 'SIN-PLT'
      : normalizePlate(rawPlate); // aquí puede lanzar "Formato de placa inválido"

    if (plate !== 'SIN-PLT' && await this.isPlateActive(plate)) {
      throw new Error('La placa ya tiene un ingreso activo.');
    }

    if (await this.isSlotOccupied(data.slotCode)) {
      throw new Error('El espacio seleccionado ya está ocupado.');
    }

    const entry = {
      id: (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`),
      plate,
      type: data.type,
      slotCode: String(data.slotCode).toUpperCase().trim(),
      vip: !!data.vip,
      disability: !!data.disability,
      client: data.client?.trim() || 'Cliente Ocasional',
      startedAtISO: new Date().toISOString(),
    };

    await this.repo.add(entry);
    return entry;
  }

  async checkOutByPlate(plate) {
    const raw = String(plate ?? '').toUpperCase().trim();
    const p = isAnonymousPlate(raw) ? 'SIN-PLT' : normalizePlate(raw);
    return await this.repo.removeByPlate(p);
  }
}
