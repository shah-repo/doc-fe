import { FBStoreProps } from "../store";

export type FBValidatorDynamicProps = FBStoreProps & {
  code?: string;
  scope?: {
    [key: string]: any;
  };
  transformCode?: (code: string) => string;
  clear?: () => void;
  onMessageChange?: (ev: React.ChangeEvent) => void;
};

export interface FBValidatorConfigProps {
  name: string;
  errorMessage?: string;
  fn: any;
}
