import { Group } from "../../../state/ducks/auth/types";
import { Employee } from "../../../state/ducks/company/types";

export interface ApprovalMatrix {
  approvalRoles: ApprovalRole[];
  approvalMatrix: ApprovalMatrixItem[];
}

export interface ApprovalRole {
  id: string;
  employees: Employee[];
  groups: Group[];
  name: string;
  index: number;
}

export interface ApprovalMatrixItem {
  id: string;
  docType: DocType;
  approvalRoles: ApprovalRolesStages;
}

interface DocType {
  id?: string;
  acronym: string;
  name: string;
  defaultTraining: boolean;
  group: string;
}

interface ApprovalRolesStages {
  stage1: boolean[];
  stage2: boolean[];
  stage3: boolean[];
  admStage: boolean[];
}
