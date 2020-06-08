/* eslint-disable no-console */
import { plainToClass } from "class-transformer";
import { IsDefined, IsString, validateSync } from "class-validator";
console.log({ x: process.env });

// const envFromCypressEnv = () => ({
//   BE_URL: Cypress.env("BE_URL"),
//   BASE_URL: Cypress.env("BASE_URL"),
// });

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
    });
    console.log({ configEnv });
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
}


export const CONFIG = ConfigEnv.getInstance();
