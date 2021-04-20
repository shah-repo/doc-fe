import { omit, unionBy } from "lodash";
import { action, get, observable, set } from "mobx";
import { FBAutocompleteAsyncOption, FBAutocompleteAsyncState, FBProcedureItemConfig, FBProcedureItemType, StartMpiBody } from "..";
import { Document, DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

class FBLHRStepState {
  // MARK: @api
  public startMpiApi = new FBRequest<DocumentRevision, StartMpiBody>(FBEndpoint.StartMpi);
  public getDocumentApi = new FBRequest<Document, null>(FBEndpoint.Document);
  public materialsApi = new FBAutocompleteAsyncState({ optionId: this.materialsId });
  public equipmentApi = new FBAutocompleteAsyncState({ optionId: this.equipmentId });
  // MARK @config
  @observable public stepLHRs?: DocumentRevision;
  @observable public isHovering = false;
  @observable public materials: any;
  @observable public equipment: any;

  public constructor(lhrs?: DocumentRevision) {
    this.stepLHRs = lhrs;
  }

  @action public editItem = (item: FBProcedureItemConfig, type: FBProcedureItemType) => {
    const items = unionBy([omit(item, "LHRTparameter")], get(this, `${type}`), "id");
    set(this, type, items.reverse());
  };

  // MARK: @helpers
  public getLHRsDocument = (id?: string) => {
    if (!id) { return; }
    this.getDocumentApi.set({
      url: FBEndpoint.Document,
      urlValues: { id },
      method: "get",
    });
  };

  public get materialsId(): string {
    return FBAutocompleteAsyncOption.materials;
  }

  public get equipmentId(): string {
    return FBAutocompleteAsyncOption.equipment;
  }

  public setLHRs = (lhrs) => set(this, "stepLHRs", lhrs);

  public setMaterials = (materials) => set(this, "materials", materials);
  public setEquipment = (equipment) => set(this, "equipment", equipment);

  public setIsHovering = (isHovering: boolean) => set(this, "isHovering", isHovering);

  public startMpi = (fieldId: string, startQuantity: number, woId?: string, mpiId?: string ) => {
    if (!woId || !mpiId) { return; }
    this.startMpiApi.set({
      url: FBEndpoint.StartMpi,
      method: "post",
      body: {
        wo: {
          id: woId,
        },
        mpi: {
          id: mpiId,
        },
        fieldId,
        startQuantity,
      },
    });
  };
  protected findRevision = (id: string, type: FBProcedureItemType): DocumentRevision | undefined => {
    const itemId = type === FBProcedureItemType.materials
      ? this.materialsId
      : this.equipmentId;

    const item = FBAutocompleteAsyncStore.getValue<DocumentRevision>(itemId, id);
    return item;
  };

  public getItem = (id: string, type: FBProcedureItemType): string | undefined => {
    const item = this.findRevision(id, type);
    if (item) {
      return `${item.document?.docId} - ${item.name}`;
    }
    return id;
  };
}

export default FBLHRStepState;
