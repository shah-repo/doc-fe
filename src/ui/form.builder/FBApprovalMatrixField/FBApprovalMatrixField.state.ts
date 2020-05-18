import _ from "lodash";
import { action, observable, set } from "mobx";
import { FBApprovalMatrixFieldData, FBApprovalRole } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

export class FBApprovalMatrixFieldState extends FBRequest<FBApprovalMatrixFieldData, null> {

  @observable public aprovalRoles?: FBApprovalRole[];
  public url = FBEndpoint.ApprovalMatrix;

  public constructor(data?: FBApprovalMatrixFieldData) {
    super();
    this.setApprovalRoles(data?.approvalRoles);
  }

  @action public setApprovalRoles = (roles?: FBApprovalRole[]) => {
    set(this, "aprovalRoles", roles);
  };

  @action public addApprovalRole = (role: FBApprovalRole) => {
    const approvalRoles = _.union(this.aprovalRoles || [], [role]);
    this.setApprovalRoles(approvalRoles);
  };

  protected onSuccess() {
    this.setApprovalRoles(this.data?.approvalRoles);
  }
}

export default FBApprovalMatrixFieldState;

