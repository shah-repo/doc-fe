function normalizeHostname (hostname: string): string {
  return hostname.toLowerCase().replace(/^\./, '');
}

export function normalizeCookieHostname (hostname: string): string {
  return normalizeHostname(hostname);
}

export function buildCookieName (hostname: string, baseName: string): string {
  return `${normalizeHostname(hostname).split('.').join('_')}__${baseName}`;
}

export function getCookieSecurePart (): string {
  return window.location.protocol === 'https:' ? '; secure' : '';
}

export function expireCookie (cookieName: string, domain?: string): void {
  const domainPart = domain ? `; domain=${domain}` : '';
  document.cookie = `${cookieName}=; path=/; max-age=0; samesite=lax${getCookieSecurePart()}${domainPart}`;
}

export function getCookieSharedDomain (host: string): string | null {
  const normalizedHost = normalizeCookieHostname(host);

  if (normalizedHost === 'localhost' || normalizedHost === '127.0.0.1') {
    return null;
  }

  const labels = normalizedHost.split('.');
  if (labels.length < 2) {
    return null;
  }

  return `.${labels.slice(-2).join('.')}`;
}
