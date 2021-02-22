import { unionBy, values } from "lodash";
import { computed, observable } from "mobx";
import { FBProcedureItemConfig, FBProcedureItemType, FBProcedureState, FBProcedureValue } from "..";

class FBPartsState extends FBProcedureState {
  // MARK: @config

  // MARK: @observables
  @observable public parts = new Map<string, FBProcedureValue>();
  @observable public diffParts = new Map<string, FBProcedureValue>();

  getNumberOfDigits(number: number): number {
    return (number.toString().split(".")[1] || "").length;
  }

  // MARK: @computed
  @computed public get materials(): FBProcedureItemConfig[] | undefined {
    let materials: FBProcedureItemConfig[] = [];
    const valueParts = !this.diffParts.size ? this.parts : this.diffParts;
    valueParts.forEach((value) => {
      materials = [...materials, ...value?.materials || []];
    });
    const materialValues = materials.reduce((result, obj) => {
      const { title, unit } = obj;
      const key = `${title}-${unit}`;
      const currentQuantity = result[key]?.quantity || 0;
      const quantityToAdd = obj.quantity || 0;

      const numberOfDigits = Math.max(
        this.getNumberOfDigits(currentQuantity),
        this.getNumberOfDigits(quantityToAdd)
      );

      result[key] = {
        ...obj,
        quantity: parseFloat((currentQuantity + quantityToAdd).toFixed(numberOfDigits)),
      };
      return result;
    }, {});
    return values(materialValues);
  }

  @computed public get equipment(): FBProcedureItemConfig[] | undefined {
    let equipment: FBProcedureItemConfig[] = [];
    const valueParts = !this.diffParts.size ? this.parts : this.diffParts;
    valueParts.forEach((value) => {
      equipment = unionBy(equipment, value?.equipment || [], "title");
    });
    return equipment;
  }

  // MARK: @helpers
  public getItemUrl = (id: string, type: FBProcedureItemType): string | undefined => {
    const item = this.findRevision(id, type);
    if (!item) {
      return;
    }
    return `/document_revision/${item?.document.id}/version/${item?.id}`;
  };
}

export default FBPartsState;
