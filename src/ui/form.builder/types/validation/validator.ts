
export interface FBValidatorProps {
  validators?: React.ReactNode[];
}

export type FBValidatorDelimiter = ":" | ",";

export interface FBValidatorIndicatorValueProps {
  value: any;
  delimiter: FBValidatorDelimiter;
}
