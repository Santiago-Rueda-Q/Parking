export default class LocalRatesRepository {
  constructor() {
    this.key = "rates_config"
  }

  getRates() {
    const data = localStorage.getItem(this.key)
    if (data) return JSON.parse(data)

    return {
      car: 5,
      moto: 3,
      bike: 1,
      vipDiscount: 20
    }
  }

  saveRates(rates) {
    localStorage.setItem(this.key, JSON.stringify(rates))
    return rates
  }
}
