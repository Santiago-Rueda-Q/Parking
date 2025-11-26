export default class FeesService {
  constructor(rules = null) { this.rules = rules ?? { baseCents: 2000, perHourCents: 1000, graceMinutes: 15 } }

  calculate({ type, minutes }) {
    const { baseCents, perHourCents, graceMinutes } = this.rules
    if (minutes <= graceMinutes) return 0
    const hours = Math.ceil(minutes / 60)
    return baseCents + (hours - 1) * perHourCents
  }
}
