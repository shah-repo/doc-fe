import { find, get, keyBy, remove } from "lodash";
import { action, observable, set } from "mobx";
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
  @observable public editedParameters: any;

  public constructor(lhrs?: DocumentRevision) {
    this.stepLHRs = lhrs;
  }

  @action public editItem = (item: FBProcedureItemConfig, type: FBProcedureItemType) => {
    const findItem = find(this.editedParameters, (parameter) => parameter.paramsId === item.paramsId);
    let parameters;
    const items = get(this, `${type}`).map((value) => {
      // need this condition if material/eq is edited more than once
      if (value.id === item.paramsId || value.paramsId === item.paramsId) {
        return item;
      }
      return value;
    });
    // need this if material/eq is edited more than once
    if (findItem) {
      parameters = remove(this.editedParameters, (param: any) => param.paramsId === item.paramsId);
      set(this, "editedParameters", keyBy( parameters, "paramsId") );
    }
    parameters = keyBy({ ...this.editedParameters, item }, "paramsId");
    set(this, "editedParameters", parameters );
    set(this, type, items);
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
  public setEditedParameters = (editedParameters) => set(this, "editedParameters", editedParameters);

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
