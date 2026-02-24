import { env } from "@/src/config/env"
import opencage from "opencage-api-client"
import { addressFormatter } from "./address-formatter.util"

export async function getCoordsFromAddress(data: {
  address: string
  zipCode: string
  city: string
  state: string
  streetNumber?: string
  neighborhood?: string
}) {
  const query = addressFormatter.toOpenCageQuery(data)

  try {
    const response = await opencage.geocode({
      q: query,
      key: env.OPENCAGE_API_KEY,
      countrycode: "br",
      no_annotations: 1,
    })

    if (response.status.code === 200 && response.results.length > 0) {
      const { lat, lng } = response.results[0].geometry
      return { latitude: lat.toString(), longitude: lng.toString() }
    }
  } catch (error) {
    console.error("[getCoordsFromAddress] Error:", error)
  }
  return { latitude: undefined, longitude: undefined }
}
