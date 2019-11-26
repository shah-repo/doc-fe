
export interface FBValidatorProps {
  validators?: React.ReactNode[];
}

export type FBValidatorDelimiter = ":" | ",";

export enum FBValidatorTrigger {
  // ON_SUBMIT = "Submit",
  // ON_CHANGE = "Change",
  ON_STATE_TO_IN_REVIEW = "ON_STATE_TO_IN_REVIEW",
}

export interface FBValidatorIndicatorValueProps {
  value: any;
  delimiter: FBValidatorDelimiter;
}
