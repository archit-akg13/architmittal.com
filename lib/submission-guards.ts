/**
 * Bounds on what a public submission can write to disk.
 *
 * Both public endpoints append to a JSON file that is read back in full on
 * every write. Without caps, a single request can write a megabyte, and a
 * sustained run can grow the file until the disk fills or the read-parse-write
 * cycle stalls the endpoint.
 */

/** Per-field character caps. Longer values are truncated, not rejected. */
export const FIELD_LIMITS = {
  fullName: 120,
  company: 160,
  email: 254, // RFC 5321 maximum
  phone: 32,
  automationNeeds: 2000,
  budget: 80,
  source: 120,
  name: 120,
} as const

/**
 * Record-count ceilings. Reaching these means something is wrong — either an
 * abuse run or a genuine volume the JSON-file approach has outgrown.
 */
export const MAX_INQUIRIES = 5000
export const MAX_SUBSCRIBERS = 20000

/**
 * Coerces to a string and truncates to `max`.
 *
 * Truncating rather than rejecting keeps a real submission from being lost to
 * an over-long paste, which is a plausible thing for a genuine lead to do.
 */
export function capped(value: unknown, max: number): string {
  if (value === null || value === undefined) return ''
  return String(value).slice(0, max)
}

/** True once the store is full. Callers must log loudly rather than fail quietly. */
export function atCapacity(records: unknown[], max: number): boolean {
  return records.length >= max
}
