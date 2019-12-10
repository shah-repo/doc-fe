import { FBValidatorModel } from "../../stores/domain/models/FBValidatorModel";
import { FBInputProps } from "../common";
import { FBValidatorIndicatorProps } from "./validator";

export type FBValidatorOptionProps =
  & Partial<FBValidatorModel>
  & Pick<FBInputProps, "onChange" | "field" | "form">
  & {
    indicatorOnChange?: FBInputProps["onChange"];
    indicator?: FBValidatorIndicatorProps;
    indicatorElements?: () => React.ReactNode[];
    index: number;
  };
