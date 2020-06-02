import _ from "lodash";
import { action, observable, set } from "mobx";
import * as generateUuid from "uuid/v4";
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
    role = {
      ...role,
      id: generateUuid(),
      index: this.approvalRoles?.length || 0,
    };
    const approvalRoles = _.union(this.approvalRoles || [], [role]);
    const approvalMatrix = _.map(this.approvalMatrix, (am) => {
      _.map(new Array(approvalRoles.length), (_, i) => {
        am.approvalRoles.stage1[i] = am.approvalRoles.stage1[i] || false;
        am.approvalRoles.stage2[i] = am.approvalRoles.stage2[i] || false;
        am.approvalRoles.stage3[i] = am.approvalRoles.stage3[i] || false;
        am.approvalRoles.admStage[i] = am.approvalRoles.admStage[i] || false;
      });
      return am;
    });
    this.setApprovalMatrix(approvalMatrix);
    this.setApprovalRoles(approvalRoles);
  };

  protected onSuccess() {
    this.setApprovalMatrix(this.data?.approvalMatrix);
    this.setApprovalRoles(this.data?.approvalRoles);
  }
}

export default FBApprovalMatrixFieldState;

