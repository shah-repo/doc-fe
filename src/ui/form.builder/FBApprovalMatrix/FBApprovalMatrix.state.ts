import { action, observable, set } from "mobx";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import FBStore from "../stores/ui/FBStore";
import { ApprovalMatrix, ApprovalMatrixItem, ApprovalRole } from "./FBApprovalMatrix.types";

const DEFAULT_AM: ApprovalMatrix = {
  approvalRoles: [],
  approvalMatrix: [],
};

export class FBApprovalMatrixState {
  @observable public name = "";
  @observable public am = DEFAULT_AM;

  @action public setApprovalRoles = (approvalRoles: ApprovalRole[]) => {
    set(this.am, "approvalRoles", approvalRoles);
  };

  @action public setApprovalMatrix = (approvalMatrix: ApprovalMatrix) => {
    this.setApprovalRoles(approvalMatrix.approvalRoles);
    set(this.am, "approvalMatrix", approvalMatrix.approvalMatrix);
  };

  @action public addApprovalRoleItem = (approvalRoleItem: ApprovalRole) => {
    this.am.approvalRoles.push(approvalRoleItem);
  };

  @action public addApprovalMatrixItem = (approvalMatrixItem: ApprovalMatrixItem) => {
    this.am.approvalMatrix.push(approvalMatrixItem);
  };

  @action public removeAddedItem = () => {
    this.am.approvalMatrix.splice(-1, 1);
  };

  @action public removeAddedRole = () => {
    this.am.approvalRoles.splice(-1, 1);
  };

  @action public editDefaultTraining = (index: number, defaultTraining: boolean) => {
    this.am.approvalMatrix[index].docType.defaultTraining = defaultTraining;
  };

  @action public editApprovalMatrixRole = (
    index: number,
    approvalMatrixItem: boolean,
    stage: string,
    itemIndex: number
  ) => {
    this.am.approvalMatrix[index].approvalRoles[stage][itemIndex] = approvalMatrixItem;
  };

  @action public editApprovalRoles = (
    index: number, approvalRoleItem: OptionType[], type: string
  ) => {
    this.am.approvalRoles[index][type] = approvalRoleItem.map((role) => ({
      id: role.value,
    }));
  };


  @action public editName = (
    index: number, approvalRoleItem: string, type: string
  ) => {
    this.am.approvalRoles[index][type] = approvalRoleItem;
  };

  @action public editApprovalRoleItem = (index: number, item: string, type: string) => {
    this.am.approvalMatrix[index].docType[type] = item;
  };

  @action public initialize = () => {
    if (!this.name) {
      return;
    }
    const value: ApprovalMatrix = FBStore.getValue(this.name) || DEFAULT_AM;
    this.am = value;
    FBStore.setValue(this.name, this.am);
    FBStore.resetSchema();
  };
}

export default FBApprovalMatrixState;
