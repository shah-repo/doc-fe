import { Dictionary } from "lodash";
import { FBStoreProps } from "../store";

export type FBValidatorDynamicProps = FBStoreProps & {
  code?: string;
  scope?: {
    [key: string]: any;
  };
  transformCode?: (code: string) => string;
  clear?: () => void;
  onMessageChange?: (ev: React.ChangeEvent) => void;
  errorMessage?: string;
};

export interface FBValidatorConfigProps {
  name: string;
  errorMessage?: string;
  fn: any;
}

export interface FBValidatorTemplate {
  interpolation: string;
  values: Dictionary<string>;
}
