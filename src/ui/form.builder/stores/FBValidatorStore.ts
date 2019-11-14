import _, { Dictionary } from "lodash";
import { action, computed } from "mobx";
import { FBValidatorGroup } from "../types/editor";
import { FBTemplateSchema } from "../types/store";
import { FBValidatorRestProps } from "../types/validator";
import FBStore from "./FBStore";

export class FormBuilderValidatorStore {
  public validatorGroups: FBValidatorGroup[] = [];

  @computed get groups(): string[] {
    return this.validatorGroups.map((validator) => validator.name);
  }

  @computed get validators(): FBValidatorRestProps[] {
    const validators: FBValidatorRestProps[] = [];
    FBStore.schema.map((schemaItem) => {
      if (schemaItem.type === "validator") {
        const metadata: Dictionary<string> = {};

        (schemaItem.schema || []).map((schemaSubItem: Partial<FBTemplateSchema>) => {
          metadata[schemaSubItem.metadata || ""] = schemaSubItem.name || "";
        });

        validators.push({
          name: schemaItem.validatorGroup || "",
          fields: metadata,
        });
      }
    });

    return validators;
  }

  @action public fields(name: string): Array<Partial<FBTemplateSchema>> | undefined {
    const validator = _.filter(this.validatorGroups, (group) => group.name === name);
    const uuidv4 = require("uuid/v4");
    if (validator.length > 0) {
      return validator[0].fields.map((field) => {
        return {
          ...field,
          name: uuidv4(),
        };
      });
    }
    return;
  }
}

const FBValidatorStore = new FormBuilderValidatorStore();
export default FBValidatorStore;
