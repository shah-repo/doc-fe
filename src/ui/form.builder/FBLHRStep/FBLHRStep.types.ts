import { FBInputProps, FBProviderProps } from "..";

export type FBLHRStepProps =
& Pick<FBProviderProps, "lhrStepState">
& Pick<FBInputProps, "name" | "label" | "disabled" | "index" | "loading">
& {
  startMpi(): void;
  editorConfig: {
    value: string;
  };
  isOutput: boolean;
};
