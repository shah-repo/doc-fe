import { action } from "mobx";
import { FBTemplateSchema } from "../../types/store";
import FBStore from "./FBStore";
import _ from "lodash";

export class FormBuilderActionStore {
  // @observable public activeAction: string = "";
  // @observable public activeIndicators: Array<Partial<FBValidatorIndicatorProps>> = [];

  // @action public setActiveAction = (name: string) => {
  //     this.activeAction = name;
  //     this.activeIndicators = actionCollection.getIndicators(name) || [];
  // }

  @action public getActions = (): FBTemplateSchema[] => {
    return _.filter(FBStore.getSchema(), (schemaItem) => (
      schemaItem.type === "action"
    ));
  }
}

const FBActionStore = new FormBuilderActionStore();
export default FBActionStore;
