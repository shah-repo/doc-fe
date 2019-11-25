import _ , { Dictionary } from "lodash";
import { action, computed } from "mobx";
import { SelectOption } from "../../../components/forms/fields/Select";
import FBStore from "../FBStore";

export class FormBuilderValidatorStore {
  public indicatorValues: Dictionary<Dictionary<string>> = {};

  @computed get schemaItemOptions(): SelectOption[] {
    const schema = FBStore.getSchema();
    return schema.map((schemaItem) => {
      return {
        value: schemaItem.name,
        text: schemaItem.label,
      } as SelectOption;
    });
  }

  @action public getRules = (): string | undefined => {
    const flattenArray = _.map(this.indicatorValues, (v, k) => {
      _.map(v, (val, key) => k += `${key}${val}`);
      return k;
    });
    return flattenArray.join("|");
  }

  @action public resetIndicatorValues = () => {
      this.indicatorValues = {};
  }
}

const FBValidatorStore = new FormBuilderValidatorStore();
export default FBValidatorStore;
