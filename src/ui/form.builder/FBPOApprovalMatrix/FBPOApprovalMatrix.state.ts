import { findIndex, isEmpty, union } from "lodash";
import { action, observable, set } from "mobx";
import { FBAutocompleteAsyncOption, FBAutocompleteAsyncState, FBFormState } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { FBPOApprovalMatrixConstructor, POApprovalMatrix, POApprovalMatrixLevel } from "./FBPOApprovalMatrix.types";

const DEFAULT_POAM: POApprovalMatrix = {
  approvalLevels: [] as POApprovalMatrixLevel[],
};

export class FBPOApprovalMatrixState extends FBRequest<POApprovalMatrix, null> {
  public static stages = [1, 2, 3];
  @observable public name = "";
  @observable public poam = DEFAULT_POAM;
  @observable public approvalLevels: POApprovalMatrixLevel[] = [];
  public groupsApi = new FBAutocompleteAsyncState(FBAutocompleteAsyncOption.officialGroups);
  public employeesApi = new FBAutocompleteAsyncState(FBAutocompleteAsyncOption.employees);
  public url = FBEndpoint.POApprovalMatrix;
  private formState?: FBFormState;

  public constructor({ formState, approvalLevels, isOutput, outputRevision }: FBPOApprovalMatrixConstructor) {
    super();
    this.formState = formState;
    if (!isOutput) {
      return;
    }
    if (outputRevision || !approvalLevels || isEmpty(approvalLevels)) {
      this.fetch();
      return;
    }
    this.approvalLevels = approvalLevels || [];
  }

  @action public setItems = (approvalLevels: POApprovalMatrixLevel[]) => {
    set(this, "approvalLevels", approvalLevels);
    this.updateFBStore();
  };

  @action public addItem = (approvalLevel: POApprovalMatrixLevel) => {
    const appLevelIndex = findIndex(this.approvalLevels, { id: approvalLevel.id });
    if (appLevelIndex === -1) {
      set(this, "approvalLevels", union(this.approvalLevels, [approvalLevel]));
      return;
    }
    const al = [...this.approvalLevels];
    al[appLevelIndex] = approvalLevel;
    set(this, "approvalLevels", al);
  };

  @action public editItem = (index: number, approvalLevel: POApprovalMatrixLevel) => {
    this.approvalLevels[index] = approvalLevel;
  };

  @action public setFormValues = (approvalLevel: POApprovalMatrixLevel, groupOptions, employees) => {
    // let values = {};
    // const signatureStages = this.poam.approvalLevels
    //   .map((level) => level.signatures.map((sign) => sign.signatureStage));
    // const signaturesByStage = signatureStages.flat().map((level: number) => ({
    //   id: approvalLevel.signatures[level - 1]?.id,
    //   ["signature." + level + ".groups"]: groupOptions.filter((option) => {
    //     const selectedGroupIds = approvalLevel.signatures[level - 1]?.groups
    //     ?.map((group) => group.id);
    //     if (selectedGroupIds?.includes(option.value)) {
    //       return option;
    //     }
    //     return null;
    //   }),
    //   ["signature." + level + ".employees"]: toMembersOptions(employees)
    //     .filter((option) => {
    //       const selectedEmployeeIds = approvalLevel.signatures[level - 1]?.employees
    //       ?.map((employee) =>
    //         employee.id);
    //       if (selectedEmployeeIds?.includes(option.value)) {
    //         return option;
    //       }
    //       return null;
    //     }),
    // }));
    // const signatures = Object.assign({}, ...signaturesByStage?.map((signature) => signature));
    // values = {
    //   name: approvalLevel.name,
    //   limit: approvalLevel.limit,
    //   ...signatures,
    //   ...signaturesByStage,
    // };

    // this.formState?.setFieldValue(this.name + "-formValues", values);
    // this.updateFBStore();
  };

  @action public initialize = () => {
    if (!this.name) {
      return;
    }
    // const value: POApprovalMatrix = this.formState?.getFieldValue(this.name, DEFAULT_POAM);
    // const { approvalLevels } = value || {};
    // set(this, "approvalLevels", approvalLevels);
    // this.approvalLevels = value;
  };

  @action public clearFormValues = () => {
    // this.formState?.setFieldValue(`${this.name}-formValues`, undefined);
    // this.formState?.setFieldValue(`${this.name}-formValues.name`, undefined);
    // this.formState?.setFieldValue(`${this.name}-formValues.limit`, undefined);
  };

  @action public resetFormValues = () => {
    // this.formState?.setFieldValue(`${this.name}-formValues`, undefined);
  };

  protected onSuccess() {
    if (!this.data) { return; }
    this.setItems(this.data.approvalLevels);
  }

  private updateFBStore = () => {
    if (!this.name || this.formState?.workspaceState?.mode === "design") {
      return;
    }
    // this.formState?.setFieldValue(this.name, this.poam);
    // this.formState?.workspaceState?.resetSchema();
  };
}

export default FBPOApprovalMatrixState;
