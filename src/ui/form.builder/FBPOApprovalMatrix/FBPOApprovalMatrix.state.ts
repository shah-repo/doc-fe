import _ from "lodash";
import { action, observable, set } from "mobx";
import { FBFormState } from "..";
import { toMembersOptions } from "../../group.management/utils/transform";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { FBPOApprovalMatrixConstructor, POApprovalMatrix, POApprovalMatrixLevel } from "./FBPOApprovalMatrix.types";

const DEFAULT_POAM: POApprovalMatrix = {
  approvalLevels: [] as POApprovalMatrixLevel[],
};

export class FBPOApprovalMatrixState extends FBRequest<POApprovalMatrix, null> {
  @observable public name = "";
  @observable public poam = DEFAULT_POAM;
  public url = FBEndpoint.POApprovalMatrix;
  private formState?: FBFormState;

  public constructor({ formState, approvalLevels }: FBPOApprovalMatrixConstructor) {
    super();
    this.formState = formState;
    this.poam.approvalLevels = approvalLevels || [];
  }

  @action public setItems = (approvalLevels: POApprovalMatrixLevel[]) => {
    set(this.poam, "approvalLevels", approvalLevels);
    this.updateFBStore();
  };

  @action public addItem = (approvalLevel: POApprovalMatrixLevel) => {
    const appLevelIndex = _.findIndex(this.poam.approvalLevels, { id: approvalLevel.id });
    if (appLevelIndex === -1) {
      set(this.poam, "approvalLevels", _.union(this.poam.approvalLevels, [approvalLevel]));
      return;
    }
    const al = [...this.poam.approvalLevels];
    al[appLevelIndex] = approvalLevel;
    set(this.poam, "approvalLevels", al);
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
      id: approvalLevel.signatures[level - 1]?.id,
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

    this.formState?.setFieldValue(`${this.name}-formValues`, values);
    this.updateFBStore();
  };

  @action public initialize = () => {
    if (!this.name) {
      return;
    }
    const value: POApprovalMatrix = this.formState?.getFieldValue(this.name, DEFAULT_POAM);
    this.poam = value;
  };

  @action public clearFormValues = () => {
    this.formState?.setFieldValue(`${this.name}-formValues`, undefined);
    this.formState?.setFieldValue(`${this.name}-formValues.name`, undefined);
    this.formState?.setFieldValue(`${this.name}-formValues.limit`, undefined);
  };

  @action public resetFormValues = () => {
    this.formState?.setFieldValue(`${this.name}-formValues`, undefined);
  };

  private updateFBStore = () => {
    if (!this.name || this.formState?.workspaceState?.mode === "design") {
      return;
    }
    this.formState?.setFieldValue(this.name, this.poam);
    this.formState?.workspaceState?.resetSchema();
  };

}

export default FBPOApprovalMatrixState;
