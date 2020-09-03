import { map, sortBy, union } from "lodash";
import { action, observable, set } from "mobx";
import * as generateUuid from "uuid/v4";
import { FBApprovalMatrixConstructor, FBApprovalMatrixFieldData, FBApprovalMatrixFieldMode, FBApprovalMatrixItem, FBApprovalRole } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

export class FBApprovalMatrixFieldState extends FBRequest<FBApprovalMatrixFieldData, null> {
  @observable public mode: FBApprovalMatrixFieldMode = "none";
  public url = FBEndpoint.ApprovalMatrix;

  public constructor({ formValue, outputRevision, isOutput }: FBApprovalMatrixConstructor) {
    super();
    if (!isOutput) { return; }
    if (!formValue || outputRevision) {
      this.fetch();
      return;
    }
    this.data = formValue;
  }

  @action public prepareData = (data: FBApprovalMatrixFieldData): FBApprovalMatrixFieldData | undefined => this.data = {
    approvalRoles: data?.approvalRoles || [],
    approvalMatrix: sortBy(data?.approvalMatrix, (row) => row.docType.name.toLowerCase()) || [],
  };

  @action public setMode = (mode: FBApprovalMatrixFieldMode) => {
    set(this, "mode", mode);
  };

  @action public setApprovalRoles = (approvalRoles?: FBApprovalRole[]) => {
    set(this, "data", {
      approvalRoles,
      approvalMatrix: this.data?.approvalMatrix,
    });
  };

  @action public setApprovalMatrix = (approvalMatrix?: FBApprovalMatrixItem[]) => {
    set(this, "data", {
      approvalRoles: this.data?.approvalRoles || [],
      approvalMatrix,
    });
  };

  @action public addApprovalRole = (role: FBApprovalRole) => {
    const approvalRoles = union(this.data?.approvalRoles || [], [{
      ...role,
      id: generateUuid(),
      index: this.data?.approvalRoles?.length || 0,
    }]);
    const approvalMatrix = map(this.data?.approvalMatrix, (am) => {
      map(new Array(approvalRoles.length), (_, i) => {
        am.approvalRoles.stage1[i] = am.approvalRoles.stage1[i] || false;
        am.approvalRoles.stage2[i] = am.approvalRoles.stage2[i] || false;
        am.approvalRoles.stage3[i] = am.approvalRoles.stage3[i] || false;
        am.approvalRoles.admStage[i] = am.approvalRoles.admStage[i] || false;
      });
      return am;
    });
    set(this, "data", { approvalRoles, approvalMatrix });
  };
}

export default FBApprovalMatrixFieldState;

