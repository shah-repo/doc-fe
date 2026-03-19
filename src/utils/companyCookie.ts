import { appConfig } from '../appConfig';

const COOKIE_NAME = appConfig.companyCookieName;
const MAX_AGE_SECONDS = appConfig.companyCookieMaxAgeDays * 24 * 60 * 60;

/**
 * Persist the selected company ID as a browser cookie so that other
 * front-end apps on the same domain (e.g. main-frontend) can read it.
 *
 * The cookie is NOT httpOnly — company_id is not a secret (it is visible
 * in API URL paths) and must be readable by client-side JavaScript.
 */
export function setCompanyCookie(companyId: string): void {
  const secure = window.location.protocol === 'https:' ? '; secure' : '';
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(companyId)}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax${secure}`;
}
