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

  @action public setEquipment = (equipment) => {
    const newEquipment = uniqBy(equipment.concat(this.equipment), "id");
    set(this, "equipment", newEquipment);
  };

  @action public setMaterials = (materials) => {
    const newMaterials = uniqBy(materials.concat(this.materials), "id");
    set(this, "materials", newMaterials);
  };
}

export default FBPartsState;
