import { uniqBy } from "lodash";
import { action, observable, set } from "mobx";
import { FBProcedureItemConfig } from "..";
import FBRequest from "../FBApi/FBApi.request";

export class FBPartsState extends FBRequest<any, any> {
  @observable public equipment: FBProcedureItemConfig[] = [];
  @observable public materials: FBProcedureItemConfig[] = [];

  public constructor({ equipment, materials }) {
    super();
    this.equipment = equipment || [];
    this.materials = materials || [];
  }

  @action public setEquipment = (equipment: FBProcedureItemConfig[], procedureField?: string) => {
    const equipmentWithoutCurrentProcedure = this.equipment.filter((eq) => eq.procedureFieldId !== procedureField);
    const newEquipment = uniqBy(equipment.concat(equipmentWithoutCurrentProcedure), "id");
    set(this, "equipment", newEquipment);
  };

  @action public setMaterials = (materials: FBProcedureItemConfig[], procedureField?: string) => {
    const materialsWithoutCurrentProcedure = this.materials.filter((m) => m.procedureFieldId !== procedureField);
    const newMaterials = uniqBy(materials.concat(materialsWithoutCurrentProcedure), "id");
    set(this, "materials", newMaterials);
  };
}

export default FBPartsState;
