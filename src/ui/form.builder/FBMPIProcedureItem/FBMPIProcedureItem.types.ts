import { FBInputProps, FBInputType, FBProcedureItemConfig, FBProcedureItemProps, FBProviderProps } from "..";
import { UsedDocumentsInLHRS } from "../../../state/ducks/documentRevisions/types";

export type FBMPIProcedureItemProps =
& FBProcedureItemProps
& Pick<FBProviderProps, "mpiProcedureState">
& Pick<FBInputProps, "defaultValue">
& {
  handleSelect?: (item: FBProcedureItemConfig) => void;
  handleSelectionDelete?: (refId?: string) => void;
  multiplier?: number;
  isOutput?: boolean;
  isSelectVisible?: boolean;
  redlineActive?: boolean;
  usedDocumentsInLHRS?: UsedDocumentsInLHRS[];
  isDocumentMPI?: boolean;
  fieldType?: FBInputType;
};
