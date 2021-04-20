import { FBFormProps, FBPOReceiveProps, FBPurchaseOrderItem } from "..";
import { DocumentType } from "../../../state/ducks/documentRevisions/documentType/types";

export type FBPOReceiveFormProps =
& Pick<FBPOReceiveProps, "name">
& Pick<FBFormProps, "children">
& {
  handleReceive?: () => any;
  handleCancel?: () => any;
  item?: FBPurchaseOrderItem;
};

export interface FBPOReceiveFormConstructor {
  lfpoDocType: DocumentType;
  lotDocType: DocumentType;
  groupOptions: any[];
  item: FBPurchaseOrderItem;
  documentId?: string;
}

export interface ReceiveQuantityBody {
  formInput?: Record<string, any>;
}
