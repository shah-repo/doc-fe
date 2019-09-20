import queryString from "query-string";
import { LOGIN_WITH_CODE_URL } from "../ui/constants/urls";
import { ThemeEnv } from "../ui/layout/theme/utils/types";

const DEFAULTS = {
  API_ENDPOINT: "/",
  REFRESH_TOKEN_VALIDITY_DAYS: "30",
  SIGNUP_DOMAIN_URL: "/",
  FRONTEND_URL: "/",
  AWS_COGNITO_CLIENT_ID: "default",
  AUTO_LOGOUT_TIME: "1800000", // 30 minutes in milliseconds
  THEME: ThemeEnv.DEV_THEME,
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

  public static get SignUpDomainUrl(): string {
    return this.get("SIGNUP_DOMAIN_URL");
  }

  public static get FrontendUrl() {
    return this.get("FRONTEND_URL");
  }

  public static get AwsCognitoClientId() {
    return this.get("AWS_COGNITO_CLIENT_ID");
  }

  public static get SignUpUrl(): string {
    const params = queryString.stringify({
      response_type: "code",
      client_id: this.AwsCognitoClientId,
      redirect_uri: `${this.FrontendUrl}${LOGIN_WITH_CODE_URL}`,
    });

    return `${this.SignUpDomainUrl}/signup?${params}`;
  }

  public static get AutoLogoutTime() {
    return this.getNumber("AUTO_LOGOUT_TIME");
  }

  public static get Theme() {
    return this.get("THEME");
  }
}

export default Config;
