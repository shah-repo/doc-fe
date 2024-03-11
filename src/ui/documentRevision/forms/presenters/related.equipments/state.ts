import { computed, observable, action } from 'mobx';
import { FBEndpoint } from '../../../../form.builder/defaults/FBEndpoint';
import FBRequest from '../../../../form.builder/FBApi/FBApi.request';
import { RelatedEquipment } from './types';
import { Id } from '../../../../../state/ducks/common/types';
import { SecurityListRequest } from '../../../../../state/ducks/documentRevisions/types';
import { stripTags } from '../../../../../common/utils/helpers';

interface ConstructorOptions {
  parentSpecificationId: string
}

interface CreateRelatedEquipmentBody {
  name?: string
  primaryOwner?: string
  location?: string
  parentDocumentRevisionId: string
  formDocument: Id
  document: {
    docId: string
    documentType: Id
    securityList: SecurityListRequest
  }
}

class RelatedEquipmentsState {
  private readonly parentSpecificationId: string;

  @observable relatedEquipments: RelatedEquipment[] = [];

  @observable getRelatedEquipmentsApi = new FBRequest<RelatedEquipment[], never>();
  @observable addRelatedEquipmentApi = new FBRequest<RelatedEquipment, CreateRelatedEquipmentBody>();
  @observable syncRelatedEquipmentApi = new FBRequest<never, never>();
  @observable deleteSyncedSuccessNotifyApi = new FBRequest<never, never>();

  @computed get loading (): boolean {
    return this.getRelatedEquipmentsApi.loading
      || this.addRelatedEquipmentApi.loading;
  }

  constructor ({ parentSpecificationId }: ConstructorOptions) {
    this.parentSpecificationId = parentSpecificationId;
  }

  @action private setRelatedEquipments (value: RelatedEquipment[]): void {
    this.relatedEquipments = value.map(item => ({
      ...item,
      name: stripTags(item.name),
    }));
  }

  public getRelatedEquipments = (): void => {
    this.getRelatedEquipmentsApi.set({
      method: 'get',
      url: `${FBEndpoint.RelatedEquipment}/${this.parentSpecificationId}`,
    }, (data, error) => {
      if (error) {
        return this.getRelatedEquipmentsApi.onError(error);
      }

      this.getRelatedEquipmentsApi.data = data;
      this.getRelatedEquipmentsApi.onSuccess();

      this.setRelatedEquipments(data ?? []);
    });
  };

  public addRelatedEquipment = async (body: CreateRelatedEquipmentBody): Promise<void> => {
    return await new Promise((resolve, reject) => {
      this.addRelatedEquipmentApi.set({
        method: 'post',
        url: FBEndpoint.RelatedEquipment,
        body,
      }, (data, error) => {
        if (error) {
          reject(error);
          return this.addRelatedEquipmentApi.onError(error);
        }

        this.addRelatedEquipmentApi.data = data;
        this.addRelatedEquipmentApi.onSuccess();

        this.getRelatedEquipments();

        resolve();
      });
    });
  };

  public syncRelatedEquipment = async (id: string): Promise<void> => {
    return await new Promise((resolve, reject) => {
      this.syncRelatedEquipmentApi.set({
        method: 'post',
        url: `${FBEndpoint.RelatedEquipment}/sync/${id}`,
      }, (_, error) => {
        if (error) {
          reject(error);
          return this.syncRelatedEquipmentApi.onError(error);
        }

        this.syncRelatedEquipmentApi.onSuccess();
        resolve();
      });
    });
  };

  public deleteSyncedSuccessNotify = async (id: string): Promise<void> => {
    return await new Promise((resolve, reject) => {
      this.deleteSyncedSuccessNotifyApi.set({
        method: 'delete',
        url: `${FBEndpoint.RelatedEquipment}/notify/${id}`,
      }, (_, error) => {
        if (error) {
          reject(error);
          return this.deleteSyncedSuccessNotifyApi.onError(error);
        }

        this.deleteSyncedSuccessNotifyApi.onSuccess();
        resolve();
      });
    });
  };
}

export default RelatedEquipmentsState;
