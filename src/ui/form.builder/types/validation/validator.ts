
export interface FBValidatorProps {
  validators?: React.ReactNode[];
}

export type FBValidatorDelimiter = ":" | ",";

export enum FBValidatorTrigger {
  onRelease = "Validate on Release",
}

export interface FBValidatorIndicatorValueProps {
  value: any;
  delimiter: FBValidatorDelimiter;
}
