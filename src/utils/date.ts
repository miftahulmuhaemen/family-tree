export function parseBirthYear(birthDate?: string): number | null {
  if (!birthDate) return null;
  const match = birthDate.match(/\b(\d{4})\b/);
  if (match) {
    const year = parseInt(match[1], 10);
    return isNaN(year) ? null : year;
  }
  return null;
}
