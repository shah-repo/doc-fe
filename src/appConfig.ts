/**
 * Central application configuration.
 *
 * All runtime constants are resolved here with explicit defaults.
 * Individual modules import from this file — they do not read
 * process.env directly and do not hardcode strings.
 *
 * Values can be overridden per-environment via REACT_APP_* env vars
 * (set in .env, .env.production, .env.local, etc.).
 */
export const appConfig = {
  /** Cookie name for sharing the selected company ID with other apps on the same domain. */
  companyCookieName: process.env.REACT_APP_COMPANY_COOKIE_NAME ?? 'enlil_company_id',

  /** How long the company cookie stays alive, in days. */
  companyCookieMaxAgeDays: Number(process.env.REACT_APP_COMPANY_COOKIE_MAX_AGE_DAYS ?? 7),

  /** sessionStorage key used to persist the return URL across the Keycloak OAuth round-trip. */
  returnUrlStorageKey: process.env.REACT_APP_RETURN_URL_STORAGE_KEY ?? 'enlil_return_url',
} as const;
