import { FBApprovalMatrixFieldData, FBApprovalMatrixFieldMode, FBApprovalMatrixFieldProps, FBProviderProps } from "..";

export type FBApprovalMatrixTableProps =
& Pick<FBApprovalMatrixFieldProps, "name">
& Pick<FBProviderProps, "approvalMatrixTableState">
& {
  cellHeight?: (height: number, index: number) => number;
  approvalData?: FBApprovalMatrixFieldData;
  mode?: FBApprovalMatrixFieldMode;
  classes?: Record<"tableInfo" | "tableStatus", string>;
  width?: number;
};

export enum FBApprovalMatrixTableRoleHead {
  stage1 = "form.builder.approvals.numeric",
  stage2 = "form.builder.approvals.numeric.alpha",
  stage3 = "form.builder.approvals.alpha",
  admStage = "form.builder.approvals.admin"
}

export enum FBApprovalMatrixTableInfoHead {
  prefix = "form.builder.prefix",
  internalType = "form.builder.internalType",
  documentType = "form.builder.documentType",
  trainingReq = "form.builder.trainingReq",
  needsSignature = "form.builder.needsSignature",
  category = "form.builder.category"
}

export enum FBDocTypeGroup {
  FORM = "FORM",
  OTHER = "OTHER",
  PI = "PI",
  RECORD = "RECORD",
  DYNAMIC_FORM = "DYNAMIC FORM",
  POAM = "POAM",
  PO = "PO",
  DAM = "DAM",
  PART_LOT = "PART_LOT"
}
