import { FBInputProps } from "..";

export type FBLHRStepProps =
& Pick<FBInputProps, "name" | "label" | "disabled" | "index">
& {
  editorConfig: {
    value: string;
  };
};
