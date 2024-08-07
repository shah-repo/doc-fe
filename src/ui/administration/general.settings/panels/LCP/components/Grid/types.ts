import { OptionType } from '../../../../../../components/forms/fields/Autocomplete/types';
import { MODE_FIELD } from '../../../../../../components/KendoDataGrid/constants';

export interface LCP {
  id?: string
  category: string
  order?: number
  displayOrder?: number
  internalType: string
  displayLabel: string
  isApprovedSupplierEnforcedOnPO: string
  isAllowedOnLhrProd: string
  isAllowedToBuy: string
  documentTypeIdArr: string[]
  isUserAdded?: boolean
  group?: string
  isUserModified?: boolean
  inEdit?: boolean
  isAdd?: boolean
  isAddPhase?: boolean
  isActive?: boolean
  enlilTypeOptions?: string[]
  otherLabelOptions?: string[]
}

export interface EditableLCP extends LCP {
  [MODE_FIELD]?: boolean
}

export interface CustomGroupDataItem {
  items: LCP[]
  value: string
  field: string
  groupId: string
  expanded: boolean
  isLCPActive?: boolean
}

export interface CustomGroupOptions extends OptionType{
  category: string
}

export interface GroupDocTypes {
  id: string
  documentTypeName: string
  documentTypeAcronym: string
  group: string
}

export interface LCPDocRevOptions {
  id: string
  enlilType: string
  displayLabel: string
  displayOrder: number
  order: number
}

export interface LCPResponse {
  docTypes: GroupDocTypes[]
  phases: LCP[]
}

export interface processLCPType {
  groups: CustomGroupOptions[]
  phases: LCP[]
}

export interface SchemaOptions {
  onConfirm: () => void
  onDiscard: () => void
  hasEditLCPPermission?: boolean
}
