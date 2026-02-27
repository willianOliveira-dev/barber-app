export const validateOpeningBeforeClosing = (data: {
  openingTime: string
  closingTime: string
  isOpen: boolean
}) => {
  if (!data.openingTime || !data.closingTime || !data.isOpen) return true

  const [openHours, openMinutes] = data.openingTime.split(":").map(Number)
  const [closeHours, closeMinutes] = data.closingTime.split(":").map(Number)

  const openTotal = openHours * 60 + openMinutes
  const closeTotal = closeHours * 60 + closeMinutes

  return closeTotal > openTotal
}
