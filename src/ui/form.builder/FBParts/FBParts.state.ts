import { unionBy } from "lodash";
import { computed, observable } from "mobx";
import { FBProcedureItemConfig, FBProcedureValue } from "..";
import { FBProcedureState } from "../FBProcedure/FBProcedure.state";

export class FBPartsState extends FBProcedureState {
  // MARK: @config

  // MARK: @observables
  @observable public parts = new Map<string, FBProcedureValue>();

  // MARK: @computed
  @computed public get materials(): FBProcedureItemConfig[] | undefined {
    let materials: FBProcedureItemConfig[] = [];
    this.parts.forEach((value) => {
      materials = unionBy(materials, value?.materials || [], "title");
    });
    return materials;
  }

  @computed public get equipment(): FBProcedureItemConfig[] | undefined {
    let equipment: FBProcedureItemConfig[] = [];
    this.parts.forEach((value) => {
      equipment = unionBy(equipment, value?.equipment || [], "title");
    });
    return equipment;
  }

  // MARK: @helpers
}

export default FBPartsState;
