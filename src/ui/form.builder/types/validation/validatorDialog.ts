
export interface FBValidatorCustomProps {
  code?: string;
  scope?: {
    [key: string]: any;
  };
  transformCode?: (code: string) => string;
  clear?: () => void;
}

export interface FBValidatorConfigProps {
  name: string;
  errorMessage?: string;
  fn: any;
}
