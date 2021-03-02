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

export interface StartMpiBody {
  wo: {
    id: string;
  };
  mpi: {
    id: string;
  };
  fieldId: string;
}
