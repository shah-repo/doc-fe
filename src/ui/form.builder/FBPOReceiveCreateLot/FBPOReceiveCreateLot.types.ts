import { FBFormProps, FBPOReceiveProps, FBPurchaseOrderItem } from "..";
import { DocumentTypeByCategoryState, DocumentTypeByIdForm } from "../../../state/ducks/documentRevisions/documentType/types";

export type FBPOReceiveCreateLotProps =
& Pick<FBPOReceiveProps, "name">
& Pick<FBFormProps, "children">
& {
  handleCreateLot?: () => void;
  handleCancel?: () => void;
  item?: FBPurchaseOrderItem;
  formIds?: DocumentTypeByIdForm[];
  documentTypes?: DocumentTypeByCategoryState;
  getDocTypes?: () => void;
  handleDocTypeSelection?: (e, value) => void;
};
