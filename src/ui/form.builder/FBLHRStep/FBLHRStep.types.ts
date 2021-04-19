import { FBInputProps, FBProcedureItemProps, FBProviderProps } from "..";
import { Nullable } from "../../../state/ducks/common/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";

export type FBLHRStepProps =
& Pick<FBProviderProps, "lhrStepState">
& Pick<FBProcedureItemProps, "onClick" | "dialogState">
& Pick<FBInputProps, "name" | "label" | "disabled" | "index" | "loading">
& {
  startMpi(): void;
  setDisplayToMPI(): void;
  setDisplayToLHRs(): void;
  openLHRs(): void;
  editorConfig: {
    value: string;
  };
  isOutput: boolean;
  stepLHRs?: Nullable<DocumentRevision>;
  isHovering: boolean;
  isDraft: boolean;
  materials: any;
  equipment: any;
};

export interface StartMpiBody {
  wo: {
    id: string;
  };
  mpi: {
    id: string;
  };
  fieldId: string;
  startQuantity: number;
}
