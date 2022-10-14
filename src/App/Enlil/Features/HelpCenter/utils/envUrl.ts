import { template } from "lodash";

const getCurrentEnvName = (whitelist = ["dev", "demo", "prod", "prod2"], position = 2) => {
  const hostParts = window?.location?.host.split(".").reverse();
  const env = hostParts[position];
  return whitelist.includes(env) ? env : "";
};

export const envUrl = (url: string) => {
  const envName = getCurrentEnvName();
  const env = envName ? `${envName}.` : "";
  return template(url, { interpolate: /\{(.+?)\}/g })({ env });
};
