import { FBFormProps } from '..';

export type FBLockProps =
& Pick<FBFormProps, 'children'>
& {
  fields?: Array<Record<string, boolean>>
};

export interface FBLockBody {
  fields?: Array<{
    formInput: Array<Record<string, boolean>>
  }>
  documentRevisionId?: string
  ownerId: string
  ownerName: string
  expiresAt?: string
}
export interface FBLockValue {
  fieldName?: string
  lockId?: string
  ownerId?: string
  locked?: boolean
  ownerName?: string
  expiresAt?: string
}
