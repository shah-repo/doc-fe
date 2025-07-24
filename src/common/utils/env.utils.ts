enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

const env = (process.env.REACT_APP_ENV_NAME || '').trim().toLowerCase();

export const isProd = (): boolean => env === Environment.PRODUCTION;
