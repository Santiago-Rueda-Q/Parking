import { SettingsRepository } from '../../Domain/Settings/SettingsRepository.js'

const STORAGE_KEY = 'pc:settings'

export class LocalSettingsRepository extends SettingsRepository {
  async load() {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  }
  async save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data || {}))
  }
}