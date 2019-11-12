import _ from "lodash";
import { action, computed } from "mobx";
import data from "../../../data/validatorGroups.json";
import { FBValidatorGroup } from "../types/editor.js";
import { FBTemplateSchema } from "../types/store.js";

export class FormBuilderValidatorStore {
  public validatorGroups: FBValidatorGroup[] = data;

  @computed get groups(): string[] {
    return data.map((validator) => validator.name);
  }

  @action public fields(name: string): Array<Partial<FBTemplateSchema>> | undefined {
    const validator = _.filter(this.validatorGroups, (group) => group.name === name);
    if (validator.length > 0) {
      return validator[0].fields;
    }
    return;
  }
}

const FBValidatorStore = new FormBuilderValidatorStore();
export default FBValidatorStore;
