import template from "lodash/template";
import getCurrentEnvName from "./getCurrentEnvName";

const transformUrlWithEnv = (url: string) => {
  const envName = getCurrentEnvName();
  const env = envName ? `${envName}.` : "";
  return template(url, { interpolate: /\{(.+?)\}/g })({ env });
};

export default transformUrlWithEnv;
