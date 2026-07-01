import Config from '../config';
import {
  buildCookieName,
  expireCookie,
  getCookieSecurePart,
  getCookieSharedDomain,
  normalizeCookieHostname,
} from './cookie';

const MAX_AGE_SECONDS = Config.CompanyCookieMaxAgeDays * 24 * 60 * 60;

function buildCompanyCookieName (hostname: string): string {
  return buildCookieName(hostname, 'company_id');
}

function clearCompanyCookieVariants (): void {
  const host = normalizeCookieHostname(window.location.hostname);
  const cookieName = buildCompanyCookieName(host);

  expireCookie(cookieName);
  expireCookie(cookieName, host);

  const sharedDomain = getCookieSharedDomain(host);
  if (sharedDomain) {
    expireCookie(cookieName, sharedDomain);
  }
}

/**
 * Persist the selected company ID as a browser cookie so that other
 * front-end apps on the same domain (e.g. main-frontend) can read it.
 *
 * The cookie is NOT httpOnly — company_id is not a secret (it is visible
 * in API URL paths) and must be readable by client-side JavaScript.
 */
export function setCompanyCookie (companyId: string): void {
  const cookieName = buildCompanyCookieName(window.location.hostname);

  clearCompanyCookieVariants();
  document.cookie = `${cookieName}=${encodeURIComponent(companyId)}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax${getCookieSecurePart()}`;
}
