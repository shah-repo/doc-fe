import { filter, get, map, unionBy } from "lodash";
import { action, computed, observable, set } from "mobx";
import { FBAutocompleteAsyncState, FBProcedureItemConfig, FBProcedureItemType, FBProcedureValue } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { FBAutocompleteAsyncOption } from "../FBAutocompleteAsync";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

export class FBProcedureState {
  // MARK: @config
  public materialsApi = new FBAutocompleteAsyncState(this.materialsId);
  public equipmentApi = new FBAutocompleteAsyncState(this.equipmentId);

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

  @action public editItem = (item: FBProcedureItemConfig, type: FBProcedureItemType, id: string) => {
    const newItems = map(get(this, `value.${type}`), (i) => i.id === id ? item : i);
    const value = {
      ...this.value,
      [type]: newItems,
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
  public get materialsId(): string {
    return FBAutocompleteAsyncOption.materials;
  }

  public get equipmentId(): string {
    return FBAutocompleteAsyncOption.equipment;
  }

  public getItem = (id: string, type: FBProcedureItemType): string | undefined => {
    const item = this.findRevision(id, type);
    if (item) {
      return `${item.document?.docId} - ${item.name}`;
    }
    return id;
  };

  protected findRevision = (id: string, type: FBProcedureItemType): DocumentRevision | undefined => {
    const itemId = type === "materials"
      ? this.materialsId
      : this.equipmentId;

    const item = FBAutocompleteAsyncStore.getValue<DocumentRevision>(itemId, id);
    return item;
  };
}

export default FBProcedureState;
