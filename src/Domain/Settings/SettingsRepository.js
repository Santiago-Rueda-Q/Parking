// Domain: contrato para persistir Ajustes
export class SettingsRepository {
  /** @returns {Promise<Settings|null>} */
  async load() { throw new Error('Not implemented') }
  /** @param {Settings} data */
  async save(_data) { throw new Error('Not implemented') }
}

/**
 * @typedef {Object} Settings
 * @property {string} appName
 * @property {'es'|'en'} language
 * @property {string} currencySymbol
 * @property {'system'|'light'|'dark'} theme
 * @property {{ enableVip:boolean, enableDisability:boolean }} features
 * @property {{ enableTickets:boolean, footerText:string }} printing
 * @property {string} businessAddress
 * @property {string} businessPhone
 */