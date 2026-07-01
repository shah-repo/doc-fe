import { setCompanyCookie } from './companyCookie';

describe('utils/companyCookie', () => {
  const originalLocation = window.location;

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
    jest.restoreAllMocks();
  });

  it('clears the current host variants before writing the host-prefixed company cookie', () => {
    const cookieSetter = jest.spyOn(Document.prototype, 'cookie', 'set');

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalLocation,
        hostname: '.Dev7.Enlil.IO',
        protocol: 'https:',
      },
    });

    setCompanyCookie('company-123');

    expect(cookieSetter.mock.calls).toEqual([
      ['dev7_enlil_io__company_id=; path=/; max-age=0; samesite=lax; secure'],
      ['dev7_enlil_io__company_id=; path=/; max-age=0; samesite=lax; secure; domain=dev7.enlil.io'],
      ['dev7_enlil_io__company_id=; path=/; max-age=0; samesite=lax; secure; domain=.enlil.io'],
      ['dev7_enlil_io__company_id=company-123; path=/; max-age=604800; samesite=lax; secure'],
    ]);
  });

  it('derives the shared parent domain from the prod host without hardcoding it', () => {
    const cookieSetter = jest.spyOn(Document.prototype, 'cookie', 'set');

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalLocation,
        hostname: 'ENLIL.IO',
        protocol: 'https:',
      },
    });

    setCompanyCookie('company-456');

    expect(cookieSetter.mock.calls).toEqual([
      ['enlil_io__company_id=; path=/; max-age=0; samesite=lax; secure'],
      ['enlil_io__company_id=; path=/; max-age=0; samesite=lax; secure; domain=enlil.io'],
      ['enlil_io__company_id=; path=/; max-age=0; samesite=lax; secure; domain=.enlil.io'],
      ['enlil_io__company_id=company-456; path=/; max-age=604800; samesite=lax; secure'],
    ]);
  });
});
