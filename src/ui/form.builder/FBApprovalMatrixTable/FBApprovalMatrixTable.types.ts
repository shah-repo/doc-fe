import { FBApprovalMatrixFieldMode, FBApprovalMatrixItem, FBApprovalRole } from "..";

export interface FBApprovalMatrixTableProps {
  approvalMatrix?: FBApprovalMatrixItem[];
  approvalRoles?: FBApprovalRole[];
  mode?: FBApprovalMatrixFieldMode;
  classes?: Record<"root" | "tableInfo" | "tableStatus", string>;
  name?: string;
}

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
  trainingReq = "form.builder.trainingReq"
}
