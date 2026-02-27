export const maskHours = (value: string): string => {
  if (!value) return ""

  const digits = value.replace(/[^0-9]/g, "").substring(0, 2)

  if (digits.length === 2) {
    const num = parseInt(digits, 10)
    if (num > 23) return "23"
  }

  return digits
}

export const maskMinutes = (value: string): string => {
  if (!value) return ""

  const digits = value.replace(/[^0-9]/g, "").substring(0, 2)

  if (digits.length === 2) {
    const num = parseInt(digits, 10)
    if (num > 59) return "59"
  }

  return digits
}
