import { action, observable, set } from "mobx";
import { FBFormState } from "..";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { ApprovalMatrix, ApprovalMatrixItem, ApprovalRole } from "./FBApprovalMatrix.types";
const DEFAULT_AM: ApprovalMatrix = {
  approvalRoles: [] as ApprovalRole[],
  approvalMatrix: [] as ApprovalMatrixItem[],
};

type SubmitForm = () => void;

export class FBApprovalMatrixState {
  @observable public name = "";
  @observable public am = DEFAULT_AM;
  public submitForm;
  private formState?: FBFormState;

  public constructor(formState?: FBFormState, submitForm?: SubmitForm) {
    this.formState = formState;
    this.submitForm = submitForm;
  }

  @action public setApprovalRoles = (approvalRoles: ApprovalRole[]) => {
    set(this.am, "approvalRoles", approvalRoles);
  };

  @action public setApprovalMatrix = (approvalMatrix: ApprovalMatrix) => {
    this.setApprovalRoles(approvalMatrix.approvalRoles);
    set(this.am, "approvalMatrix", approvalMatrix.approvalMatrix);
    this.updateFBStore();
  };

  @action public updateFBStore = () => {
    this.formState?.setFieldValue(this.name, this.am);
    this.formState?.workspaceState?.resetSchema();
    this.submitForm?.();
  };

  @action public addApprovalRoleItem = (approvalRoleItem: ApprovalRole) => {
    this.am.approvalRoles.push(approvalRoleItem);
    this.am.approvalMatrix.map((row) => {
      row.approvalRoles.admStage.push(false);
      row.approvalRoles.stage1.push(false);
      row.approvalRoles.stage2.push(false);
      row.approvalRoles.stage3.push(false);
      return row;
    });
  };

  @action public addApprovalMatrixItem = (approvalMatrixItem: ApprovalMatrixItem) => {
    this.am.approvalMatrix.push(approvalMatrixItem);
  };

  @action public removeAddedItem = () => {
    this.am.approvalMatrix.splice(-1, 1);
  };

  @action public removeAddedRole = () => {
    this.am.approvalRoles.splice(-1, 1);
    this.updateFBStore();
  };

  @action public editDefaultTraining = (index: number, defaultTraining: boolean) => {
    this.am.approvalMatrix[index].docType.defaultTraining = defaultTraining;
    this.updateFBStore();
  };

  @action public editApprovalMatrixRole = (
    index: number,
    approvalMatrixItem: boolean,
    stage: string,
    itemIndex: number
  ) => {
    this.am.approvalMatrix[index].approvalRoles[stage][itemIndex] = approvalMatrixItem;
    this.updateFBStore();
  };

  @action public editApprovalRoles = (
    index: number, approvalRoleItem: OptionType[], type: string
  ) => {
    this.am.approvalRoles[index][type] = approvalRoleItem.map((role) => ({
      id: role.value,
    }));
    this.updateFBStore();
  };

  @action public editName = (
    index: number, approvalRoleItem: string, type: string
  ) => {
    this.am.approvalRoles[index][type] = approvalRoleItem;
    this.updateFBStore();
  };

  @action public editApprovalRoleItem = (index: number, item: string, type: string) => {
    this.am.approvalMatrix[index].docType[type] = item;
    this.updateFBStore();
  };

  @action public initialize = () => {
    if (!this.name) {
      return;
    }
    const value: ApprovalMatrix = this.formState?.getFieldValue(this.name, DEFAULT_AM);
    this.am = value;
    this.formState?.setFieldValue(this.name, this.am);
    this.updateFBStore();
  };
}

export default FBApprovalMatrixState;
