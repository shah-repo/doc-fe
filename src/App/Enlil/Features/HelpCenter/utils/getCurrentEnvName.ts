export default function getCurrentEnvName(whitelist = ["dev", "demo", "prod", "prod2"], position = 2): string {
  const hostParts = window?.location?.host.split(".").reverse();
  const env = hostParts[position];
  return whitelist.includes(env) ? env : "";
}
