import { FBApprovalMatrixCheckState } from "..";

export interface FBApprovalMatrixCheckProps {
  handleCheck?: () => any;
  approvalMatrixCheckState?: FBApprovalMatrixCheckState;
  checked?: boolean;
  name?: string;
  dataCy?: string;
}
