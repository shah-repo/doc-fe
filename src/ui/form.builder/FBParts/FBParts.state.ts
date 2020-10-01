import { unionBy } from "lodash";
import { computed, observable } from "mobx";
import { FBProcedureItemConfig, FBProcedureItemType, FBProcedureValue } from "..";
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
  public getItemUrl = (id: string, type: FBProcedureItemType): string | undefined => {
    const item = this.findRevision(id, type);
    return item ? `/document_revision/${item?.document.id}/version/${item?.id}` : undefined;
  };
}

export default FBPartsState;
