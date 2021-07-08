import { FBFormProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";

export type FBLockProps =
& Pick<FBFormProps, "children">
& {
  fields?: Record<string, boolean>[];
};

export interface FBLockBody {
  fields?: {
    formInput: Record<string, boolean>[];
  }[];
  documentRevisionId?: string;
  ownerId: string;
  ownerName: string;
  expiresAt?: string;
}

export interface FBLockData {
  documentRevision: DocumentRevision;
  lock: {
    id: string;
  };
}

export interface FBLockValue {
  fieldName?: string;
  lockId?: string;
  ownerId?: string;
  locked?: boolean;
  ownerName?: string;
  expiresAt?: string;
}
