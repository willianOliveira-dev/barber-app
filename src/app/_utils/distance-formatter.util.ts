export class DistanceFormatter {
  /**
   * Formata uma distância em quilômetros para uma string legível.
   * < 1 km → exibida em metros (ex.: "350 m")
   * ≥ 1 km → exibida em km (ex.: "2,4 km")
   */
  formatDistance(km: number): string {
    if (km < 1) {
      return `${Math.round(km * 1000)} m`
    }
    return `${km.toFixed(1)} km`
  }

  /**
   * Limite o valor do raio a um máximo razoável (50 km).
   */
  clampRadius(radiusKm: number): number {
    return Math.min(Math.max(radiusKm, 0.1), 50)
  }
}

export const distanceFormat = new DistanceFormatter()


