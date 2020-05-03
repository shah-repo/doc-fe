import { action, observable, set } from "mobx";
import { toMembersOptions } from "../../group.management/utils/transform";
import FBStore from "../stores/ui/FBStore";
import { POApprovalMatrix, POApprovalMatrixLevel } from "./FBPOApprovalMatrix.types";

const DEFAULT_POAM: POApprovalMatrix = {
  approvalLevels: [    {
    name: "Level 1",
    limit: "$500",
    signatures: [
      {
        signatureStage: 1,
        groups: [{ id: "e4ec85a1-c0c8-4fe9-8298-fa8f5e51bcf2" }],
        employees: [{ id: "b3df30a9-34c9-4dd8-8c0e-fc1b32a170fa" }],
      },
      {
        signatureStage: 2,
        groups: [],
        employees: [],
      },
      {
        signatureStage: 3,
        groups: [],
        employees: [],
      },
    ],
  },
  {
    name: "Level 2",
    limit: "$1500",
    signatures: [
      {
        signatureStage: 1,
        groups: [],
        employees: [],
      },
      {
        signatureStage: 2,
        groups: [],
        employees: [],
      },
      {
        signatureStage: 3,
        groups: [],
        employees: [],
      },
    ],
  }] as POApprovalMatrixLevel[],
};

export class FBPOApprovalMatrixState {
  @observable public name = "";
  @observable public poam = DEFAULT_POAM;

  @action public setItems = (approvalLevels: POApprovalMatrixLevel[]) => {
    set(this.poam, "approvalLevels", approvalLevels);
  };

  @action public addItem = (approvalLevel: POApprovalMatrixLevel) => {
    this.poam.approvalLevels.push({
      ...approvalLevel,
    });
    this.updateFBStore();
  };

  @action public editItem = (index: number, approvalLevel: POApprovalMatrixLevel) => {
    this.poam.approvalLevels[index] = approvalLevel;
    this.updateFBStore();
  };

  @action public setFormValues = (approvalLevel: POApprovalMatrixLevel, groupOptions, employees) => {
    let values = {};
    const signatureStage = approvalLevel.signatures.map((sign) => sign.signatureStage);
    const signatures = signatureStage.map((level) => ({
      [`${this.name}-formValues.signature${level}.groups`]: groupOptions.filter((option) => {
        const selectedGroupIds = approvalLevel.signatures[level - 1]?.groups?.map((group) => group.id);
        if (selectedGroupIds?.includes(option.value)) {
          return option;
        }
        return null;
      }),
      [`${this.name}-formValues.signature${level}.employees`]: toMembersOptions(employees).filter((option) => {
        const selectedEmployeeIds = approvalLevel.signatures[level - 1]?.employees?.map((employee) => employee.id);
        if (selectedEmployeeIds?.includes(option.value)) {
          return option;
        }
        return null;
      }),
    }));
    Object.keys(approvalLevel).forEach((key) => {
      values = {
        ...values,
        [`${this.name}-formValues.name`]: approvalLevel.name,
        [`${this.name}-formValues.limit`]: approvalLevel.limit,
        ...signatures.map((signature, index) => signature[index]),
      };
    });
    FBStore.setValues({
      ...FBStore.getValues(),
      ...values,
    });
  };

  @action public initialize = () => {
    if (!this.name) {
      return;
    }
    const value: POApprovalMatrix = FBStore.getValue(this.name) || DEFAULT_POAM;
    this.poam = value;
  };

  @action public clearFormValues = () => {
    FBStore.setValue(`${this.name}-formValues.name`, undefined);
    FBStore.setValue(`${this.name}-formValues.limit`, undefined);
    FBStore.setValue(`${this.name}-formValues.signatures`, undefined);
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
