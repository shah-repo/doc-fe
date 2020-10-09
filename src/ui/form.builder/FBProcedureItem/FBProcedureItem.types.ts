import { FBProcedureProps, FBProviderProps } from "..";

export type FBProcedureItemType = "materials" | "equipment";

export enum FBProcedureItemLocale {
  materials = "form.builder.materials",
  equipment = "form.builder.equipment"
}

export enum FBProcedureItemActionLocale {
  materials = "form.builder.add.material",
  equipment = "form.builder.add.equipment",
  materialsEdit = "form.builder.edit.material",
  equipmentEdit = "form.builder.edit.equipment",
}

export type FBProcedureItemProps =
& Pick<FBProviderProps, "dialogState" | "formState">
& Pick<FBProcedureProps, "name" | "stepIndex" | "disabled" | "isPreview" | "loading">
& {
  onClick?: (part?: FBProcedureItemConfig) => void;
  handleAdd?: () => void;
  handleCancel?: () => void;
  handleRemove?: (id: string) => void;
  getItem?: (id: string) => string;
  type: FBProcedureItemType;
  value?: FBProcedureItemConfig[];
};

export interface FBProcedureItemConfig {
  id: string;
  title: string;
  quantity?: number;
  unit?: string;
  procedureFieldId?: string;
}
