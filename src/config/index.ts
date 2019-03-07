const DEFAULTS = {
  API_ENDPOINT: "/",
  REFRESH_TOKEN_VALIDITY_DAYS: "30",
};

type ConfigKey = keyof typeof DEFAULTS;

class Config {
  private static PREFIX = "REACT_APP";

  private static get(name: ConfigKey): string {
    return process.env[`${this.PREFIX}_${name}`] || DEFAULTS[name];
  }

  private static getNumber(name: ConfigKey): number {
    return parseInt(this.get(name), 10);
  }

  public static get ApiEndpoint() {
    return `${this.get("API_ENDPOINT")}/v1`;
  }

  public static get RefreshTokenValidityInDays() {
    return this.getNumber("REFRESH_TOKEN_VALIDITY_DAYS");
  }
}

export default Config;
