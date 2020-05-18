import { action, observable, set } from "mobx";
import { toMembersOptions } from "../../group.management/utils/transform";
import FBStore from "../stores/ui/FBStore";
import { POApprovalMatrix, POApprovalMatrixLevel } from "./FBPOApprovalMatrix.types";

const DEFAULT_POAM: POApprovalMatrix = {
  approvalLevels: [] as POApprovalMatrixLevel[],
};

export class FBPOApprovalMatrixState {
  @observable public name = "";
  @observable public poam = DEFAULT_POAM;

  @action public setItems = (approvalLevels: POApprovalMatrixLevel[]) => {
    set(this.poam, "approvalLevels", approvalLevels);
  };

  @action public addItem = (approvalLevel: POApprovalMatrixLevel) => {
    this.poam.approvalLevels.push(approvalLevel);
    this.updateFBStore();
  };

  @action public editItem = (index: number, approvalLevel: POApprovalMatrixLevel) => {
    this.poam.approvalLevels[index] = approvalLevel;
    this.updateFBStore();
  };

  @action public setFormValues = (approvalLevel: POApprovalMatrixLevel, groupOptions, employees) => {
    let values = {};
    const signatureStages = this.poam.approvalLevels
      .map((level) => level.signatures.map((sign) => sign.signatureStage));
    const signaturesByStage = signatureStages.flat().map((level: number) => ({
      id: approvalLevel.signatures[level - 1].id,
      [`signature${level}groups`]: groupOptions.filter((option) => {
        const selectedGroupIds = approvalLevel.signatures[level - 1]?.groups
        ?.map((group) => group.id);
        if (selectedGroupIds?.includes(option.value)) {
          return option;
        }
        return null;
      }),
      [`signature${level}employees`]: toMembersOptions(employees)
        .filter((option) => {
          const selectedEmployeeIds = approvalLevel.signatures[level - 1]?.employees
          ?.map((employee) =>
            employee.id);
          if (selectedEmployeeIds?.includes(option.value)) {
            return option;
          }
          return null;
        }),
    }));
    const signatures = Object.assign({}, ...signaturesByStage?.map((signature) => signature));
    values = {
      name: approvalLevel.name,
      limit: approvalLevel.limit,
      ...signatures,
      ...signaturesByStage,
    };

    FBStore.setValue(`${this.name}-formValues`, values);
    this.updateFBStore();
  };

  @action public initialize = () => {
    if (!this.name) {
      return;
    }
    const value: POApprovalMatrix = FBStore.getValue(this.name) || DEFAULT_POAM;
    this.poam = value;
  };

  @action public clearFormValues = () => {
    FBStore.setValue(`${this.name}-formValues`, undefined);
    FBStore.setValue(`${this.name}-formValues.name`, undefined);
    FBStore.setValue(`${this.name}-formValues.limit`, undefined);
  };

  @action public resetFormValues = () => {
    FBStore.setValue(`${this.name}-formValues`, undefined);
  };

  private updateFBStore = () => {
    if (!this.name || FBStore.mode === "design") {
      return;
    }

    FBStore.setValue(this.name, this.poam);
    FBStore.resetSchema();
  };

}

export default FBPOApprovalMatrixState;
