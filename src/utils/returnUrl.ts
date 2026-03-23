/**
 * Shared constants and helpers for the cross-app return-URL redirect flow.
 *
 * Used by Login.container and SwitchCompany.container to persist and validate
 * the URL that main-frontend (or another same-domain app) asked to return to
 * after company selection.
 */

import { appConfig } from '../appConfig';

/** sessionStorage key used to persist returnUrl across the Keycloak OAuth round-trip. */
export const RETURN_URL_STORAGE_KEY = appConfig.returnUrlStorageKey;

/**
 * Check whether a URL is safe to redirect to.
 *
 * Accepts localhost, 127.0.0.1, and the current page's own hostname
 * (covers production where all apps share the same domain).
 */
function isSafeReturnUrl (url: string): boolean {
  try {
    const target = new URL(url);
    return (
      target.hostname === 'localhost'
      || target.hostname === '127.0.0.1'
      || target.hostname === window.location.hostname
    );
  } catch {
    return false;
  }
}

/**
 * If ``returnUrl`` is a safe redirect target, navigate the browser there
 * and clear the stored key.  Returns ``true`` if redirect was performed.
 */
export function tryRedirectToReturnUrl (returnUrl: string | null | undefined): boolean {
  if (!returnUrl) return false;
  if (!isSafeReturnUrl(returnUrl)) return false;

  sessionStorage.removeItem(RETURN_URL_STORAGE_KEY);
  window.location.href = returnUrl;
  return true;
}
