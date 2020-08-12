import queryString from "query-string";
import { SM_APP_CONFIG } from "../common/constants";
import { LOGIN_WITH_CODE_URL } from "../ui/constants/urls";
import { ThemeEnv } from "../ui/layout/theme/utils/types";

const DEFAULTS = {
  API_ENDPOINT: "/",
  REFRESH_TOKEN_VALIDITY_DAYS: "30",
  SIGNUP_DOMAIN_URL: "/",
  FRONTEND_URL: "/",
  AWS_COGNITO_CLIENT_ID: "default",
  THEME: ThemeEnv.DEV_THEME,
  VALIDATORS_S3_FOLDER_NAME: "",
  AWS_BUCKET_PUBLIC: "",
  AWS_REGION: "",
  HELLOSIGN_TEST_MODE: "",
  HELLOSIGN_CLIENT_ID: "",
  ENV_NAME: "",
  DATADOG_APPLICATION_ID: "",
  DATADOG_CLIENT_TOKEN: "",
};


type ConfigKey = keyof typeof DEFAULTS;

class Config {
  private static PREFIX = "REACT_APP";

  private static get(name: ConfigKey): string {
    return SM_APP_CONFIG[`${this.PREFIX}_${name}`] || DEFAULTS[name];
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
      // eslint-disable-next-line @typescript-eslint/camelcase
      response_type: "code",
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_id: this.AwsCognitoClientId,
      // eslint-disable-next-line @typescript-eslint/camelcase
      redirect_uri: `${this.FrontendUrl}${LOGIN_WITH_CODE_URL}`,
    });

    return `${this.SignUpDomainUrl}/signup?${params}`;
  }

  public static get Theme() {
    return this.get("THEME");
  }

  public static get SlackCompanyUri(): string {
    return `${this.FrontendUrl}/slack/company`;
  }

  public static get SlackUserUri(): string {
    return `${this.FrontendUrl}/slack/user`;
  }

  public static get HelloSignTestMode(): string {
    return this.get("HELLOSIGN_TEST_MODE");
  }

  public static get HelloSignClientId(): string {
    return this.get("HELLOSIGN_CLIENT_ID");
  }

  public static get DatadogApplicationId(): string {
    return this.get("DATADOG_APPLICATION_ID");
  }

  public static get DatadogClientToken(): string {
    return this.get("DATADOG_CLIENT_TOKEN");
  }

  public static get DatadogEnabled(): boolean {
    return ![this.DatadogApplicationId, this.DatadogClientToken].includes("fake");
  }

  public static get EnvironmentName(): string {
    return this.get("ENV_NAME");
  }

  public static get isSandbox(): boolean {
    return this.get("ENV_NAME") === "SANDBOX";
  }
}

export default Config;
