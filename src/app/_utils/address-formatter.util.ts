import { formatCEP } from "@brazilian-utils/brazilian-utils"

class AddressFormatter {
  formatStreetNumber(number?: string): string {
    const n = number ? number.trim().toLowerCase() : undefined
    if (!n || n === "s/n" || n === "sn" || n === "sem numero") {
      return "SN"
    }
    return n.toUpperCase()
  }

  toOpenCageQuery(data: {
    address: string
    city: string
    state: string
    zipCode: string
    streetNumber?: string
    neighborhood?: string
  }): string {
    const street = this.formatStreetNumber(data.streetNumber)
    const zip = formatCEP(data.zipCode)

    const parts = [
      `${data.address}, ${street}`,
      data.neighborhood,
      `${data.city} - ${data.state}`,
      zip,
      "Brazil",
    ]

    return parts.filter(Boolean).join(", ")
  }
}

export const addressFormatter = new AddressFormatter()
