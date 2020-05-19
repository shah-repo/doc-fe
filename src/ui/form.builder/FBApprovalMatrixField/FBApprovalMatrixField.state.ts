import _ from "lodash";
import { action, observable, set } from "mobx";
import { FBApprovalMatrixFieldData, FBApprovalMatrixFieldMode, FBApprovalMatrixItem, FBApprovalRole } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

export class FBApprovalMatrixFieldState extends FBRequest<FBApprovalMatrixFieldData, null> {

  @observable public approvalRoles?: FBApprovalRole[];
  @observable public mode: FBApprovalMatrixFieldMode = "none";
  public approvalMatrix?: FBApprovalMatrixItem[];
  public url = FBEndpoint.ApprovalMatrix;

  public constructor(data?: FBApprovalMatrixFieldData) {
    super();
    this.setApprovalMatrix(data?.approvalMatrix);
    this.setApprovalRoles(data?.approvalRoles);
  }

  @action public setMode = (mode: FBApprovalMatrixFieldMode) => {
    set(this, "mode", mode);
  };

  @action public setApprovalRoles = (roles?: FBApprovalRole[]) => {
    set(this, "approvalRoles", roles);
  };

  @action public setApprovalMatrix = (approvalMatrix?: FBApprovalMatrixItem[]) => {
    set(this, "approvalMatrix", approvalMatrix);
  };

  @action public addApprovalRole = (role: FBApprovalRole) => {
    const approvalRoles = _.union(this.approvalRoles || [], [role]);
    this.setApprovalRoles(approvalRoles);
  };

  protected onSuccess() {
    this.setApprovalMatrix(this.data?.approvalMatrix);
    this.setApprovalRoles(this.data?.approvalRoles);
  }
}

export default FBApprovalMatrixFieldState;

