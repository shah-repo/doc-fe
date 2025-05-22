export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

export const isNotProdEnv = (): boolean => {
  const env = (process.env.NODE_ENV || '').trim().toLowerCase();
  return env !== ENVIRONMENTS.PRODUCTION;
};
