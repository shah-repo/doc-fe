import { action, computed, observable } from 'mobx';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { toastError } from '../../components/notifications';
import { checkIsDocumentLot } from '../../documentRevision/helpers/checkDocumentGroup';
import { FBEndpoint } from '../defaults/FBEndpoint';
import FBRequest from '../FBApi/FBApi.request';
import { SerialNumber, SerialNumberStatus } from './types';

class FBSerialsState extends FBRequest<SerialNumber[], null> {
  private lotId?: string;
  public readonly url = FBEndpoint.LotSerialNumbers;
  public createApi: FBRequest<SerialNumber[], { serialNumbers: string[] }> = new FBRequest();
  public updateApi: FBRequest<SerialNumber, { status: SerialNumberStatus | null }> = new FBRequest();
  public deleteApi: FBRequest<void, { data: { ids: string[] } }> = new FBRequest();
  @observable public data: SerialNumber[] = [];

  @computed
  public get serialNumbers (): SerialNumber[] {
    return this.data ?? [];
  }

  @action public prepareData = (data: SerialNumber[]): SerialNumber[] =>
    data.sort((a, b) => a.serialNumber.localeCompare(b.serialNumber));

  public constructor (documentRevision?: DocumentRevision) {
    super();

    if (!documentRevision || !checkIsDocumentLot(documentRevision.document?.documentType?.groupOptions)) {
      this.setData([]);
      return;
    }

    this.lotId = documentRevision.id;
    this.reload();

    this.createApi.onSuccess = () => this.reload();
    this.updateApi.onSuccess = () => this.reload();
    this.deleteApi.onSuccess = () => this.reload();
  }

  public reload (): void {
    this.load().catch(toastError);
  }

  public setLotId (lotId: string): void {
    this.lotId = lotId;
  }

  public async load (): Promise<void> {
    if (!this.lotId) {
      return;
    }
    this.setUrl({ lotId: this.lotId });
    await this.fetch();
  }

  public async createSerialNumbers (serialNumbers: string[]): Promise<void> {
    if (!this.lotId || !Array.isArray(serialNumbers) || serialNumbers.length === 0) {
      return;
    }
    await this.createApi.set({
      method: 'post',
      url: this.url,
      urlValues: { lotId: this.lotId },
      body: { serialNumbers },
    });
  }

  public async updateSerialNumber (id: string, status: Exclude<SerialNumberStatus, null> | null): Promise<void> {
    if (!this.lotId || !id) {
      return;
    }
    await this.updateApi.set({
      method: 'patch',
      url: `${this.url}/${id}`,
      urlValues: { lotId: this.lotId },
      body: { status },
    });
  }

  public async deleteSerialNumbers (ids: string[]): Promise<void> {
    if (!this.lotId || !Array.isArray(ids) || ids.length === 0) {
      return;
    }
    await this.deleteApi.set({
      method: 'delete',
      url: this.url,
      urlValues: { lotId: this.lotId },
      body: { data: { ids } },
    });
  }

  public async deleteSerialNumber (id: string): Promise<void> {
    if (!this.lotId || !id) {
      return;
    }
    await this.deleteApi.set({
      method: 'delete',
      url: this.url,
      urlValues: { lotId: this.lotId },
      body: { data: { ids: [id] } },
    });
  }
}

export default FBSerialsState;
