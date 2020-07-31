import { FBValidatorModel } from "../../stores/domain/models/FBValidatorModel";
import { FBInputProps } from "../common";

export type FBValidatorProps =
  & Partial<FBValidatorModel>
  & Pick<FBInputProps, "afterChange">
  & {
    index: number;
    indicatorElements?: React.ReactNode[];
  // indicator: FBValidatorIndicatorProps;
  };

export type FBValidatorDelimiter = ":" | ",";

export enum FBValidatorTrigger {
  // ON_SUBMIT = "Submit",
  // ON_CHANGE = "Change",
  ON_STATE_TO_IN_REVIEW = "trigger on state to in review",
}

export type FBValidatorIndicatorProps =
  & FBInputProps
  & {
    validatorDelimiter: FBValidatorDelimiter;
    hasSchemaItem: boolean;
    requiredDocId?: boolean;
  };

export interface FBValidatorIndicatorValueProps {
  value: any;
  delimiter: FBValidatorDelimiter;
}
