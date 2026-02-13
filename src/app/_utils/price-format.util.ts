export class PriceFormat {
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
    return Number(price.replace(/\D/g, ""))
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
}

export const priceFormat = new PriceFormat()
