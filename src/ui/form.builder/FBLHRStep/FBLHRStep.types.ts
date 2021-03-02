import { FBInputProps } from "..";

export type FBLHRStepProps =
& Pick<FBInputProps, "name" | "label" | "disabled" | "index">
& {
  startMpi(): void;
  editorConfig: {
    value: string;
  };
  isOutput: boolean;
};
