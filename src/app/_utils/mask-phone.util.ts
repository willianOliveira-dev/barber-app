export const maskPhone = (value: string) => {
  if (!value) return ""
  const digits = value.replace(/\D/g, "")
  if (digits.length <= 11) {
    return digits
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15)
  }
  return digits
    .substring(0, 11)
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
}
