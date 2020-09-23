import { filter, get, unionBy } from "lodash";
import { action, computed, observable, set } from "mobx";
import { FBProcedureItemConfig, FBProcedureItemType, FBProcedureValue } from "..";

export class FBProcedureState {
  // MARK: @config

  // MARK: @observables
  @observable public value?: FBProcedureValue;

  // MARK: @constructor
  public constructor(value?: FBProcedureValue) {
    this.value = value;
  }

  // MARK: @computed
  @computed public get materials(): FBProcedureItemConfig[] | undefined {
    return this.value?.materials;
  }

  @computed public get equipment(): FBProcedureItemConfig[] | undefined {
    return this.value?.equipment;
  }

  // MARK: @actions
  @action public addItem = (item: FBProcedureItemConfig, type: FBProcedureItemType) => {
    const items = unionBy([item], get(this, `value.${type}`), "id");
    const value = {
      ...this.value,
      [type]: items.reverse(),
    };
    set(this, "value", value);
  };

  @action public removeItem = (id: string, type: FBProcedureItemType) => {
    const items = filter(get(this, `value.${type}`), (i) => i.id !== id);
    const value = {
      ...this.value,
      [type]: items,
    };
    set(this, "value", value);
  };

  // MARK: @helpers
}

export default FBProcedureState;
