import {
  buildCookieName,
  expireCookie,
  getCookieSharedDomain,
} from './cookie';

describe('utils/cookie', () => {
  const originalLocation = window.location;

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
    jest.restoreAllMocks();
  });

  it('builds a host-prefixed cookie name from a normalized hostname', () => {
    expect(buildCookieName('.Dev7.Enlil.IO', 'company_id')).toBe('dev7_enlil_io__company_id');
  });

  it('derives a shared parent domain only for multi-label non-local hosts', () => {
    expect(getCookieSharedDomain('Dev7.Enlil.IO')).toBe('.enlil.io');
    expect(getCookieSharedDomain('ENLIL.IO')).toBe('.enlil.io');
    expect(getCookieSharedDomain('localhost')).toBeNull();
    expect(getCookieSharedDomain('127.0.0.1')).toBeNull();
    expect(getCookieSharedDomain('intranet')).toBeNull();
  });

  it('expires a cookie with the current security attributes and optional domain', () => {
    const cookieSetter = jest.spyOn(Document.prototype, 'cookie', 'set');

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalLocation,
        protocol: 'https:',
      },
    });

    expireCookie('dev7_enlil_io__company_id');
    expireCookie('dev7_enlil_io__company_id', '.enlil.io');

    expect(cookieSetter.mock.calls).toEqual([
      ['dev7_enlil_io__company_id=; path=/; max-age=0; samesite=lax; secure'],
      ['dev7_enlil_io__company_id=; path=/; max-age=0; samesite=lax; secure; domain=.enlil.io'],
    ]);
  });
});
