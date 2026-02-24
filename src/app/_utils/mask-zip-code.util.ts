export const maskZipCode = (value: string) => {
  if (!value) return ""

  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 9)
}
