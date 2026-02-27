export const maskPrice = (value: string): string => {
  if (!value) return ""

  const digits = value.replace(/\D/g, "")

  const amount = parseInt(digits, 10) || 0

  return (amount / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
