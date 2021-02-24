import { FBPartItemStatus, FBProcedureProps, FBProviderProps } from "..";
import { Id } from "../../../state/ducks/common/types";

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
& Pick<FBProviderProps, "dialogState">
& Pick<FBProcedureProps, "name" | "stepIndex" | "disabled" | "isPreview" | "loading">
& {
  onClick?: (part?: FBProcedureItemConfig) => void;
  handleRemove?: (id: string) => void;
  getItem?: (id: string) => string;
  getLot?: (id?: string) => string;
  type: FBProcedureItemType;
  value?: FBProcedureItemConfig[];
};

export interface FBProcedureItemConfig {
  id: string;
  title: string;
  partLot?: string;
  quantity?: number;
  unit?: string;
  status?: FBPartItemStatus;
  attachments?: Id[];
}
