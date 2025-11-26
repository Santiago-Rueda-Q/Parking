export function isAnonymousPlate(x) {
  return String(x ?? '').toUpperCase().trim() === 'SIN-PLT';
}

/**
 * Normaliza placa al formato AAA-123.
 * - Acepta: "aaa123", "AAA 123", "AAA-123", "  aAa_123  "
 * - Lanza error si no encuentra 3 letras + 3 dígitos.
 */
export function normalizePlate(raw) {
  const s = String(raw ?? '')
    .toUpperCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[‐-‒–—−]/g, '-') // normalizamos guiones raros
    .trim();

  if (!s) {
    throw new Error('La placa no puede estar vacía.');
  }

  if (isAnonymousPlate(s)) return 'SIN-PLT';

  // ya viene bien
  if (/^[A-Z]{3}-\d{3}$/.test(s)) return s;

  // tratar de extraer AAA 123 desde texto sucio
  const m = s.replace(/[^A-Z0-9]/g, ' ').match(/([A-Z]{3})\s*(\d{3})/);
  if (m) return `${m[1]}-${m[2]}`;

  throw new Error('Formato de placa inválido. Use AAA-123 (tres letras y tres dígitos).');
}
