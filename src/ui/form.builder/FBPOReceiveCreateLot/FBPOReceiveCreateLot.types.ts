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
  handleDocTypeSelection?: (e, value) => void;
};

export interface FBPOReceiveCreateLotConstructor {
  item: FBPurchaseOrderItem;
  receivableId: string;
}

export interface CreateLotBody {
  receivedQuantity: number;
  lotDocumentType: { id: string };
  lotForm: { id: string };
  partDescription?: string;
  fieldId?: string;
  supplierPartNumber?: string;
  part?: { id: string };
  expirationDate?: Date;
}
