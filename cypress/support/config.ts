/* eslint-disable no-console */
import { plainToClass } from "class-transformer";
import { IsBoolean, IsDefined, IsEmail, IsEnum, IsNumber, IsOptional, IsString, ValidateIf, validateSync } from "class-validator";

export enum RUN_ENVIRONMENT_OPTIONS {
  LOCALDEV = "LOCALDEV",
  LOCALPARALLEL = "LOCALPARALLEL",
  PIPELINE = "PIPELINE"
}

export class ConfigEnv {
  private static instance: ConfigEnv;

  static getInstance(): ConfigEnv {
    if (!ConfigEnv.instance) {
      ConfigEnv.instance = ConfigEnv.buildConfig();
    }
    return ConfigEnv.instance;
  }

  static buildConfig(): ConfigEnv {
    const configEnv: ConfigEnv = plainToClass(ConfigEnv, {
      BE_URL: Cypress.env("BE_URL"),
      FE_URL: Cypress.env("FE_URL"),
      KONFIG_ENV: Cypress.env("KONFIG_ENV"),
      SCREENSHOT_OF_RUN_FAILURE: Cypress.env("SCREENSHOT_OF_RUN_FAILURE"),
      TAKE_SCREENSHOT_AFTER_EACH: Cypress.env("TAKE_SCREENSHOT_AFTER_EACH"),
      SKIP_ON_RUN_FAILURE: Cypress.env("SKIP_ON_RUN_FAILURE"),
      SUPERADMIN_EMAIL: Cypress.env("SUPERADMIN_EMAIL"),
      SUPERADMIN_PASSWORD: Cypress.env("SUPERADMIN_PASSWORD"),
      RUN_ENVIRONMENT: Cypress.env("RUN_ENVIRONMENT"),
      SCREENSHOTS_DIR: Cypress.env("SCREENSHOTS_DIR"),
      TEST_COMPANY_REPLICA_NAME: Cypress.env("TEST_COMPANY_REPLICA_NAME"),
      COMMIT_FE: Cypress.env("COMMIT_FE"),
      COMMIT_BE: Cypress.env("COMMIT_BE"),
      COMMIT_REMOTEJS: Cypress.env("COMMIT_REMOTEJS"),
      JSON_REPORTS_FOLDER: Cypress.env("JSON_REPORTS_FOLDER"),
      ARROW_DURATION: Cypress.env("ARROW_DURATION"),
      TEST_EMAIL: Cypress.env("TEST_EMAIL"),
    });

    const errors = validateSync(configEnv, {
      whitelist: true,
      forbidUnknownValues: false,
      forbidNonWhitelisted: true,
    });

    if (errors.length) {
      console.log({ errors });
      throw new Error(`Config validation errors: ${errors}`);
    }
    return configEnv;
  }

  @IsDefined()
  @IsString()
  BE_URL!: string;

  @IsDefined()
  @IsString()
  FE_URL!: string;

  @IsDefined()
  @IsString()
  TEST_EMAIL!: string;

  @IsDefined()
  @IsNumber()
  ARROW_DURATION!: number;

  @IsDefined()
  @IsString()
  KONFIG_ENV!: string;

  @IsDefined()
  @IsBoolean()
  SCREENSHOT_OF_RUN_FAILURE!: boolean;

  @IsDefined()
  @IsBoolean()
  TAKE_SCREENSHOT_AFTER_EACH!: boolean;

  @IsDefined()
  @IsBoolean()
  SKIP_ON_RUN_FAILURE!: boolean;

  @IsDefined()
  @IsEmail()
  SUPERADMIN_EMAIL!: string;

  @IsDefined()
  @IsString()
  SUPERADMIN_PASSWORD!: string;

  @IsDefined()
  @IsEnum(RUN_ENVIRONMENT_OPTIONS)
  RUN_ENVIRONMENT!: RUN_ENVIRONMENT_OPTIONS;

  @ValidateIf(({ RUN_ENVIRONMENT }) => RUN_ENVIRONMENT === RUN_ENVIRONMENT_OPTIONS.PIPELINE)
  @IsDefined()
  @IsString()
  SCREENSHOTS_DIR!: string;

  @IsOptional()
  @IsString()
  TEST_COMPANY_REPLICA_NAME!: string;

  @ValidateIf(({ RUN_ENVIRONMENT }) => RUN_ENVIRONMENT === RUN_ENVIRONMENT_OPTIONS.PIPELINE)
  @IsDefined()
  @IsString()
  COMMIT_FE!: string;

  @ValidateIf(({ RUN_ENVIRONMENT }) => RUN_ENVIRONMENT === RUN_ENVIRONMENT_OPTIONS.PIPELINE)
  @IsDefined()
  @IsString()
  COMMIT_BE!: string;

  @ValidateIf(({ RUN_ENVIRONMENT }) => RUN_ENVIRONMENT === RUN_ENVIRONMENT_OPTIONS.PIPELINE)
  @IsDefined()
  @IsString()
  COMMIT_REMOTEJS!: string;

  @ValidateIf(({ RUN_ENVIRONMENT }) => RUN_ENVIRONMENT === RUN_ENVIRONMENT_OPTIONS.PIPELINE)
  @IsDefined()
  @IsString()
  JSON_REPORTS_FOLDER!: string;
}


export const CONFIG = ConfigEnv.getInstance();
