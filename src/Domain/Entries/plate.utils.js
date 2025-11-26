export function isAnonymousPlate(x){
    return String(x ?? '').toUpperCase().trim() === 'SIN-PLT';
}

export function normalizePlate(raw) {
    const s = String(raw ?? '')
        .toUpperCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[‐-‒–—−]/g, '-') 
        .trim();

    if (isAnonymousPlate(s)) return 'SIN-PLT';
    // si ya viene como AAA-123
    if (/^[A-Z]{3}-\d{3}$/.test(s)) return s;

    // extrae de texto sucio: "AAA 123", "AAA_123", etc.
    const m = s.replace(/[^A-Z0-9]/g, ' ').match(/([A-Z]{3})\s*(\d{3})/);
    if (m) return `${m[1]}-${m[2]}`;

    throw new Error('Formato de placa inválido. Use AAA-123 (tres letras y tres dígitos).');
}
