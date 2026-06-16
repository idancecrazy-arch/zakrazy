// Helpers for turning a combined Airtable "Name" field (e.g.
// "Bingzhu Zhang & Douglass Henry") into one entry per guest in the party.

/**
 * A slot is a placeholder when it has no real name yet — an empty string or a
 * generic token like "Guest", "& Guest", or "Guest 2" (an unnamed plus-one).
 */
export function isPlaceholderName(name: string): boolean {
  const n = name.trim().toLowerCase().replace(/^&\s*/, '').trim()
  if (!n) return true
  return /^guest(\s*\d+)?$/.test(n)
}

/**
 * Split a combined name field into individual names, padding/truncating so the
 * result always has exactly `partySize` entries. Names are separated by " & ",
 * ", ", or " and ".
 */
export function parseGuestNames(combined: string, partySize: number): string[] {
  const size = Math.max(1, Math.floor(partySize) || 1)
  const names = (combined ?? '')
    .split(/\s*&\s*|\s+and\s+|\s*,\s*/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, size)
  while (names.length < size) names.push('')
  return names
}
