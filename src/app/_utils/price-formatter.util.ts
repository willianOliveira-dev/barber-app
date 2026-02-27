export class PriceFormatter {
  private convertCurrency(price: number) {
    return Intl.NumberFormat("pt-BR", {
      currency: "BRL",
      style: "currency",
    }).format(price)
  }

  format(price: number) {
    return this.convertCurrency(price)
  }

  formatToNumber(price: string) {
    return Number(price.replace(/[R$\s.]/g, "").replace(",", "."))
  }

  priceToCents(price: number) {
    return Math.round(price * 100)
  }

  centsToPrice(cents: number) {
    return cents / 100
  }

  formatToCents(price: string) {
    return this.priceToCents(this.formatToNumber(price))
  }

  formatToPrice(cents: number) {
    return this.convertCurrency(this.centsToPrice(cents))
  }

  validatePrice = (value: string): boolean => {
    const cleaned = value.replace(/[R$\s.]/g, "").replace(",", ".")
    const amount = parseFloat(cleaned)
    return !isNaN(amount) && amount > 0
  }
}

export const priceFormatter = new PriceFormatter()
