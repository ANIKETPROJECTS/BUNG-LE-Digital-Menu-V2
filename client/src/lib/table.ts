// Formats a raw tableId (e.g. "Table1", "Table 2") into the short POS-style
// label used throughout the customer-facing UI (e.g. "T1", "T2").
export function formatTableNumber(tableId?: string | null): string {
  if (!tableId) return "T1";
  const trimmed = tableId.trim();
  // Already in "T<number>" form
  if (/^T\d+$/i.test(trimmed)) return trimmed.toUpperCase();
  const match = trimmed.match(/(\d+)/);
  if (match) return `T${match[1]}`;
  return trimmed;
}
