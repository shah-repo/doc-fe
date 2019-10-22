import Config from "../../../config";
import { ThemeEnv } from "../../layout/theme/utils/types";

// *NOTE: for POC only; this will be removed
export const formBuilderSubmit = (key: string, data: any) => {
  localStorage.setItem(`form.builder.${key}`, JSON.stringify(data));
};

export const formBuilderGet = (key: string) => {
  const data = localStorage.getItem(`form.builder.${key}`);
  if (data) {
    return JSON.parse(data);
  }
};

export const formBuilderRemove = (key: string) => {
  localStorage.removeItem(`form.builder.${key}`);
};

export const isFBActive = Config.Theme === ThemeEnv.DEV_THEME;
