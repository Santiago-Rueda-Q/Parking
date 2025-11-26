const digitsOnly = (s) => String(s || "").replace(/\D+/g, "");

export class ClientsService {
    constructor(repo) { this.repo = repo }

    async list() {
        if (typeof this.repo.listAll === 'function') return await this.repo.listAll()
        if (typeof this.repo.list    === 'function') return await this.repo.list()
        return []
    }    
    
    async create(data) {
        const name  = (data.name  || '').trim();
        const phone = (data.phone || '').trim();
        const email = (data.email || '').trim();

        if (!name) throw new Error('El nombre es obligatorio.');

        if (phone) {
            const only = digitsOnly(phone);
        if (only.length !== phone.length) {
            throw new Error('El teléfono solo debe contener números.');
        }
        if (only.length < 7 || only.length > 15) {
            throw new Error('El teléfono debe tener entre 7 y 15 dígitos.');
        }
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('El email no es válido.');
        }

        const all = await this.repo.listAll();
        const normalizedEmail = email.toLowerCase();
        const normalizedPhone = digitsOnly(phone);

        const dup = all.some(c =>
            (normalizedEmail && (c.email || '').toLowerCase() === normalizedEmail) ||
            (normalizedPhone && digitsOnly(c.phone) === normalizedPhone)
        );
        if (dup) throw new Error('Ya existe un cliente con el mismo email o teléfono.');

        return await this.repo.create({
            name,
            phone: normalizedPhone || '',
            email: normalizedEmail || '',
            vip: !!data.vip,
        });
    }

    async delete(id) { return await this.repo.delete(id) }
    async searchAndPaginate(query, page = 1, size = 6) {
        const q = (query || '').trim().toLowerCase()
        const all = await this.repo.listAll()
        const filtered = q
        ? all.filter(c =>
            (c.name || '').toLowerCase().includes(q) ||
            (c.phone || '').toLowerCase().includes(q) ||
            (c.email || '').toLowerCase().includes(q))
        : all
        const total = filtered.length
        const start = (page - 1) * size
        const items = filtered.slice(start, start + size)
        return { items, total }
    }
}
