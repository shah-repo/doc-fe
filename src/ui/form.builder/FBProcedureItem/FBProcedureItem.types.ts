import { FBPartItemStatus, FBProcedureProps, FBProviderProps } from '..';
import { Id } from '../../../state/ducks/common/types';
import { Material } from '../FBMaterialEquipmentInfo/FBMaterailEqInfo.types';
import { SUB_ITEMS_FIELD } from '../FBMaterialsTable/MaterialTable/constants';

export enum FBProcedureItemType {
  attachments = 'attachments',
  materials = 'materials',
  equipment = 'equipment',
  serials = 'serials',
}

export enum FBProcedureItemLocale {
  materials = 'form.builder.materials',
  equipment = 'form.builder.equipment',
  attachments = 'form.builder.attachments',
  serials = 'form.builder.serials.items.built',
}

export const FBProcedureItemOmitAction: Partial<FBProcedureItemType[]> = [
  FBProcedureItemType.attachments,
];

export type FBProcedureItemProps =
& Pick<FBProviderProps, 'dialogState'>
& Pick<FBProcedureProps, 'name' | 'stepIndex' | 'disabled' | 'isPreview' | 'loading'>
& {
  onClick?: (part?: FBProcedureItemConfig) => void
  handleRemove?: (id: string) => void
  getItem?: (id: string) => string
  getLot?: (id?: string) => string
  type: FBProcedureItemType
  stepIndex?: number
  value?: FBProcedureItemConfig[]
  locked?: boolean
  item?: FBProcedureItemConfig
  lotDocId?: string
  lotId?: string
};

export interface FBProcedureItemConfig {
  id: string
  title: string
  partLot?: string
  quantity?: number
  unit?: string
  status?: FBPartItemStatus
  attachments?: Id[]
  LHRTparameter?: boolean
  type?: string
  paramsId?: string
  actualId?: string
  plannedId?: string
  [SUB_ITEMS_FIELD]?: [Material]
}
