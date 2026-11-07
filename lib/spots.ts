// Zeigt die genaue Anzahl nur bei knappen Plätzen (als Anreiz zum schnellen Buchen).
export const SCARCITY_THRESHOLD = 3

export function spotsLabel(spotsLeft: number): string {
  if (spotsLeft <= SCARCITY_THRESHOLD) {
    return spotsLeft === 1 ? 'Nur noch 1 Platz frei' : `Nur noch ${spotsLeft} Plätze frei`
  }
  return 'Plätze frei'
}
