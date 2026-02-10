import { find, get, isUndefined, keyBy, map, omit } from 'lodash';
import { action, observable, set } from 'mobx';
import { FBAutocompleteAsyncOption, FBAutocompleteAsyncState, FBProcedureItemConfig, FBProcedureItemType, StartMpiBody } from '..';
import { Document, DocumentRevision, DocumentRevisionEditRequestBody } from '../../../state/ducks/documentRevisions/types';
import { FBEndpoint } from '../defaults/FBEndpoint';
import FBRequest from '../FBApi/FBApi.request';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { COMMON_INITIAL_VALUES, INDIVIDUAL_INITIAL_VALUES } from '../FBInput/FBInput.wrap';
import { LHRS_END_DATE, LHRS_START_DATE } from './utils';

class FBLHRStepState {
  // MARK: @api
  public startMpiApi = new FBRequest<DocumentRevision, StartMpiBody>(FBEndpoint.StartMpi);
  public getDocumentApi = new FBRequest<Document, null>(FBEndpoint.Document);
  public updateLHRStepApi = new FBRequest<DocumentRevision, Partial<DocumentRevisionEditRequestBody>>(FBEndpoint.DocumentRevisionPatch);
  public materialsApi = new FBAutocompleteAsyncState({ optionId: this.materialsId });
  public equipmentApi = new FBAutocompleteAsyncState({ optionId: this.equipmentId });
  // MARK @config
  @observable public stepLHRs?: DocumentRevision;
  @observable public materials: any;
  @observable public equipment: any;
  @observable public editedParameters: any;
  @observable public approvals: any;
  @observable public isDirty = false;
  @observable public autosave?: boolean;
  private dateUpdateTimeout?: NodeJS.Timeout;
  private pendingDateUpdate = false;

  public constructor (lhrs?: DocumentRevision, autosave?: boolean) {
    this.stepLHRs = lhrs;
    this.autosave = autosave;
  }

  @action public editItem = (item: FBProcedureItemConfig, type: FBProcedureItemType) => {
    const findItem = find(this.editedParameters, (parameter) => parameter.paramsId === item.paramsId);

    const items = get(this, `${type}`).map((value) => {
      // need this condition if material/eq is edited more than once
      if (value.id === item.paramsId || value.paramsId === item.paramsId) {
        return item;
      }
      return value;
    });
    // need this if material/eq is edited more than once
    if (findItem) {
      const params = map(this.editedParameters, (param) => {
        if (param.paramsId === item.paramsId) {
          return omit(item, [...Object.keys({ ...COMMON_INITIAL_VALUES, ...INDIVIDUAL_INITIAL_VALUES })]);
        }
        return param;
      });
      set(this, 'editedParameters', keyBy(params, 'paramsId'));
      set(this, type, items);

      return;
    }
    const paramsToSet = {
      ...this.editedParameters,
      item: omit(item, [...Object.keys({ ...COMMON_INITIAL_VALUES, ...INDIVIDUAL_INITIAL_VALUES })]),
    };
    set(this, 'editedParameters', keyBy(paramsToSet, 'paramsId'));
    set(this, type, items);
  };

  @action public setApproval = (approvals) => set(this, 'approvals', approvals);
  // MARK: @helpers
  public getLHRsDocument = (id?: string) => {
    if (!id) { return; }
    this.getDocumentApi.set({
      url: FBEndpoint.Document,
      urlValues: { id },
      method: 'get',
    });
  };

  public get materialsId (): string {
    return FBAutocompleteAsyncOption.materials;
  }

  public get equipmentId (): string {
    return FBAutocompleteAsyncOption.equipment;
  }

  public setLHRs = (lhrs) => set(this, 'stepLHRs', lhrs);

  public updateLHRStepDates = (startDate?: string, endDate?: string): void => {
    if (!this.stepLHRs) { return; }

    // Clear existing timeout to debounce multiple rapid calls
    if (this.dateUpdateTimeout) {
      clearTimeout(this.dateUpdateTimeout);
    }

    // If there's already a pending update, don't trigger another one
    if (this.pendingDateUpdate) {
      return;
    }

    const updatedFormInput = {
      ...this.stepLHRs.formInput,
      ...(startDate !== undefined && { [LHRS_START_DATE]: startDate }),
      ...(endDate !== undefined && { [LHRS_END_DATE]: endDate }),
    };

    // Update local state immediately
    this.setLHRs({
      ...this.stepLHRs,
      formInput: updatedFormInput,
    });

    // Debounce the API call
    this.dateUpdateTimeout = setTimeout(() => {
      if (this.pendingDateUpdate || !this.stepLHRs) { return; }

      this.pendingDateUpdate = true;

      const apiPromise = this.updateLHRStepApi.set({
        url: FBEndpoint.DocumentRevisionPatch,
        urlValues: { id: this.stepLHRs.id },
        method: 'patch',
        body: {
          formInput: updatedFormInput,
        },
      });

      // Handle the promise if it exists
      if (apiPromise && typeof apiPromise.then === 'function') {
        apiPromise.then(() => {
          this.pendingDateUpdate = false;
        }).catch(() => {
          this.pendingDateUpdate = false;
        });
      } else {
        // If it's not a promise, just reset the flag
        this.pendingDateUpdate = false;
      }
    }, 300); // 300ms debounce
  };

  public cleanup = (): void => {
    if (this.dateUpdateTimeout) {
      clearTimeout(this.dateUpdateTimeout);
      this.dateUpdateTimeout = undefined;
    }
    this.pendingDateUpdate = false;
  };

  public setMaterials = (materials) => set(this, 'materials', materials);
  public setEquipment = (equipment) => set(this, 'equipment', equipment);
  public setEditedParameters = (editedParameters) => set(this, 'editedParameters', editedParameters);

  @action public setDirty = (isDirty: boolean) => {
    set(this, 'isDirty', isDirty);
  };

  @action public setAutosave = (autosave: boolean) => {
    set(this, 'autosave', autosave);
  };

  public saveLHRStep = (formInput?: Record<string, any>): Promise<void> | void => {
    if (!this.stepLHRs) {
      return;
    }

    const body = {
      formInput: formInput || this.stepLHRs.formInput,
    };

    const apiPromise = this.updateLHRStepApi.set({
      url: FBEndpoint.DocumentRevisionPatch,
      urlValues: { id: this.stepLHRs.id },
      method: 'patch',
      body,
    });

    // Safely handle the promise if it exists
    if (apiPromise && typeof apiPromise.then === 'function') {
      return Promise.resolve(apiPromise).then((data: DocumentRevision | undefined) => {
        this.setDirty(false);
        if (data) {
          this.setLHRs(data);
        }
        this.updateLHRStepApi.onSuccess();
      }).catch((error: Error) => {
        this.updateLHRStepApi.onError(error);
      });
    }
  };

  public startMpi = (fieldId: string, woId?: string, mpiId?: string, stepNumber?: number): void => {
    if (!woId || !mpiId || isUndefined(stepNumber)) { return; }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.startMpiApi.set({
      url: FBEndpoint.StartMpi,
      method: 'post',
      body: {
        wo: {
          id: woId,
        },
        mpi: {
          id: mpiId,
        },
        fieldId,
        stepNumber,
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
