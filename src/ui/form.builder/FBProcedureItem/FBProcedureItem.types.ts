import { FBProcedureProps, FBProviderProps } from "..";

export enum FBProcedureItemType {
  attachments = "attachments",
  materials = "materials",
  equipment = "equipment",
}

export enum FBProcedureItemLocale {
  materials = "form.builder.materials",
  equipment = "form.builder.equipment",
  attachments = "form.builder.attachments",
}

export const FBProcedureItemOmitAction: Partial<FBProcedureItemType[]> = [
  FBProcedureItemType.attachments,
];

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
