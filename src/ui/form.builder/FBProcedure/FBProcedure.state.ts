import { filter, flattenDeep, get, omit } from 'lodash';
import { action, computed, observable, set } from 'mobx';
import { FBAutocompleteAsyncOption, FBAutocompleteAsyncState, FBProcedureItemConfig, FBProcedureItemType, FBProcedureValue } from '..';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { COMMON_INITIAL_VALUES, INDIVIDUAL_INITIAL_VALUES } from '../FBInput/FBInput.wrap';

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
  public constructor (value?: FBProcedureValue) {
    this.value = value;
  }

  // MARK: @computed
  @computed public get materials (): FBProcedureItemConfig[] | undefined {
    return this.isDiffPreview ? this.diffValue?.materials : this.value?.materials;
  }

  @computed public get equipment (): FBProcedureItemConfig[] | undefined {
    return this.isDiffPreview ? this.diffValue?.equipment : this.value?.equipment;
  }

  // MARK: @actions
  @action public addItem = (addedItem: FBProcedureItemConfig, type: FBProcedureItemType, allSteps?: any) => {
    let item = omit(addedItem,
      Object.keys({ ...COMMON_INITIAL_VALUES, ...INDIVIDUAL_INITIAL_VALUES })) as FBProcedureItemConfig;

    if (item.LHRTparameter) {
      let nextId = item.id.charCodeAt(0);
      const materials = allSteps?.filter((item) => item.editorConfig?.materials).map(
        (item) => item.editorConfig.materials);
      const equipment = allSteps?.filter((item) => item.editorConfig?.equipment).map(
        (item) => item.editorConfig.equipment);
      if (!item.type) {
        const ids: string[] = flattenDeep([materials]).concat(flattenDeep([equipment])).filter((item) =>
          item.id.length === 1).map((item) => item.id) || [];
        const highestId = ids.sort().pop();
        nextId = highestId ? highestId?.charCodeAt(0) + 1 : 65;
      }
      item = { title: item.title, id: String.fromCharCode(nextId), type: 'params', LHRTparameter: item.LHRTparameter };
    }

    const existingItems = get(this, `value.${type}`, []);

    const items = existingItems.reduce((acc, curr) => {
      if (curr.id === item.id) {
        return [...acc, item];
      }
      return [...acc, curr];
    }, []);

    const isItemExists = existingItems.some(i => i.id === item.id);

    if (!item.LHRTparameter && isItemExists && item.type) {
      delete item.type;
    }

    const value = {
      ...this.value,
      [type]: isItemExists ? items : [...items, item],
    };
    this.setValue(value);
  };

  @action public removeItem = (id: string, type: FBProcedureItemType) => {
    const items = filter(get(this, `value.${type}`), (i) => i.id !== id);
    const value = {
      ...this.value,
      [type]: items,
    };
    this.setValue(value);
  };

  @action public removeEBChildrenItem = (parentId: string, id: string, type: FBProcedureItemType, subItemsKey: string) => {
    const items = get(this, `value.${type}`, []);
    const updatedItems = items.map((item) => {
      if (item.id !== parentId) return item;

      return {
        ...item,
        [subItemsKey]: (item[subItemsKey] || []).filter((child) => child.id !== id),
      };
    });

    this.setValue({
      ...this.value,
      [type]: updatedItems,
    });
  };

  @action public setValue = (value?: FBProcedureValue) => {
    set(this, 'value', value);
  };

  @action setDiffValue = (value?: FBProcedureValue) => set(this, 'diffValue', value);

  // MARK: @helpers
  public get materialsId (): string {
    return FBAutocompleteAsyncOption.materials;
  }

  public get equipmentId (): string {
    return FBAutocompleteAsyncOption.equipment;
  }

  public get lotsId (): string {
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
    if (!id) { return '?'; }
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

  public setDiffPreview = (state: boolean) => set(this, 'isDiffPreview', state);
}

export default FBProcedureState;
