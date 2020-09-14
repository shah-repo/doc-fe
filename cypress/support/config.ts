/* eslint-disable no-console */
import { plainToClass } from "class-transformer";
import { IsBoolean, IsDefined, IsEmail, IsString, validateSync } from "class-validator";

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
    });

    const errors = validateSync(configEnv, {
      whitelist: true,
      forbidUnknownValues: false,
    });
    if (errors.length) {
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
}


export const CONFIG = ConfigEnv.getInstance();
