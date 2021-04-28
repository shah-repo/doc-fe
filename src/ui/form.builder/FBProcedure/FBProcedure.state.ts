import { filter, find, get, unionBy } from "lodash";
import { action, computed, observable, set } from "mobx";
import { FBAutocompleteAsyncOption, FBAutocompleteAsyncState, FBProcedureItemConfig, FBProcedureItemType, FBProcedureValue } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

class FBProcedureState {
  // MARK: @config
  public materialsApi = new FBAutocompleteAsyncState({ optionId: this.materialsId });
  public equipmentApi = new FBAutocompleteAsyncState({ optionId: this.equipmentId });
  public lotsApi = new FBAutocompleteAsyncState({ optionId: this.lotsId });
  public isDiffPreview?: boolean;

  // MARK: @observables
  @observable public value?: FBProcedureValue;
  @observable public diffValue?: FBProcedureValue;

  // MARK: @constructor
  public constructor(value?: FBProcedureValue) {
    this.value = value;
  }

  // MARK: @computed
  @computed public get materials(): FBProcedureItemConfig[] | undefined {
    return this.isDiffPreview ? this.diffValue?.materials : this.value?.materials;
  }

  @computed public get equipment(): FBProcedureItemConfig[] | undefined {
    return this.isDiffPreview ? this.diffValue?.equipment : this.value?.equipment;
  }

  // MARK: @actions
  @action public addItem = (item: FBProcedureItemConfig, type: FBProcedureItemType) => {
    if (item.LHRTparameter) {
      const materialsValues: FBProcedureItemConfig[] = get(this, `value.${FBProcedureItemType.materials}`) || [];
      const equipmentValues: FBProcedureItemConfig[] = get(this, `value.${FBProcedureItemType.equipment}`) || [];
      // if item has LHRTparameter checked, generate the letter id
      const ids: string[] = materialsValues.concat(equipmentValues).filter((item) =>
        item.id.length === 1).map((item) => item.id) ||
      [];
      const highestId = ids.sort().pop();
      const nextId = highestId ? highestId?.charCodeAt(0) + 1 : 65;
      // if an edited item has letter id, replace it, dont add new item to the list
      const isExistingItem = find(ids, (id) => id === item.id);
      item = isExistingItem ?
        item :
        { title: item.title, id: String.fromCharCode(nextId),  type: "params", LHRTparameter: item.LHRTparameter };
    }

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

  @action setDiffValue = (value?: FBProcedureValue) => set(this, "diffValue", value);

  // MARK: @helpers
  public get materialsId(): string {
    return FBAutocompleteAsyncOption.materials;
  }

  public get equipmentId(): string {
    return FBAutocompleteAsyncOption.equipment;
  }

  public get lotsId(): string {
    return FBAutocompleteAsyncOption.ebLots;
  }

  public getItem = (id: string, type: FBProcedureItemType): string | undefined => {
    const item = this.findRevision(id, type);
    if (item) {
      return `${item.document?.docId} - ${item.name}`;
    }
    return id;
  };

  public getLot = (id?: string): string | undefined => {
    if (!id) { return "?"; }
    const item = this.findLot(id);
    if (!item) { return id; }
    return item.document?.docId;
  };

  protected findLot = (id: string): DocumentRevision | undefined => {
    const item = FBAutocompleteAsyncStore.getValue<DocumentRevision>(this.lotsId, id);
    return item;
  };

  protected findRevision = (id: string, type: FBProcedureItemType): DocumentRevision | undefined => {
    const itemId = type === FBProcedureItemType.materials
      ? this.materialsId
      : this.equipmentId;

    const item = FBAutocompleteAsyncStore.getValue<DocumentRevision>(itemId, id);
    return item;
  };

  public setDiffPreview = (state: boolean) => set(this, "isDiffPreview", state);
}

export default FBProcedureState;
