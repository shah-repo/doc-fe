enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

const env = (process.env.NODE_ENV || '').trim().toLowerCase();

export const isProd = (): boolean => env === Environment.PRODUCTION;
