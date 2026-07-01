import { action, computed, observable } from 'mobx';
import { DOC_TYPE_GROUP_OPTION } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { toastError } from '../../components/notifications';
import { FBEndpoint } from '../defaults/FBEndpoint';
import FBRequest from '../FBApi/FBApi.request';
import { isPartHasSerialization, isPartSerializationManual, isPartSerializationSystemGenerated, sanitizeSerials } from './helpers';
import { FBSerialsStateBody, LotAndPart, SerialNumber, SerialNumberExistingCheckBody, SerialNumberStatus, SerialNumberUpdateData, SerialNumberUpdatePayload } from './types';
class FBSerialsState extends FBRequest<SerialNumber[], FBSerialsStateBody> {
  public lotFindRequest = new FBRequest<LotAndPart, Record<string, never>>(
    FBEndpoint.LotForDocRev,
  );

  public existingSerialNumbersRequest = new FBRequest<string[], SerialNumberExistingCheckBody>(
    FBEndpoint.CheckExistingLotSerialNumbers,
  );

  public documentRevision?: DocumentRevision;

  @observable
  public lotData?: LotAndPart;

  public readonly url = FBEndpoint.LotSerialNumbers;
  public data: SerialNumber[] = [];

  public constructor (documentRevision?: DocumentRevision) {
    super();
    this.documentRevision = documentRevision;
  }

  @computed
  public get isForm (): boolean {
    return this.documentRevision?.document?.documentType?.groupOptions?.includes(DOC_TYPE_GROUP_OPTION.FORM) ?? false;
  }

  @computed
  public get lotId (): string | undefined {
    return this.lotData?.lot?.id;
  }

  @computed
  public get partId (): string | undefined {
    return this.lotData?.part?.id;
  }

  @computed
  public get lot (): DocumentRevision | undefined {
    return this.lotData?.lot;
  }

  @computed
  public get part (): DocumentRevision | undefined {
    return this.lotData?.part;
  }

  @computed get shouldShowSerials (): boolean {
    return this.isPartSerialized || this.isForm;
  }

  @computed
  public get isPartSerialized (): boolean {
    return isPartHasSerialization(this.part);
  }

  @computed
  public get isPartSerializationManual (): boolean {
    return isPartSerializationManual(this.part);
  }

  @computed
  public get isPartSerializationSystemGenerated (): boolean {
    return isPartSerializationSystemGenerated(this.part);
  }

  @computed
  public get isLoading (): boolean {
    return this.loading || this.lotFindRequest.loading;
  }

  @computed
  public get serialNumbers (): SerialNumber[] {
    return this.data;
  }

  public reload (): void {
    if (this.documentRevision?.id) {
      this.findLotByDocRevId(this.documentRevision.id).catch(toastError);
    }
  }

  @action
  public load (docRevId?: string): void {
    if (!this.lotData && !this.isLoading) {
      this.findLotByDocRevId(docRevId ?? this.documentRevision?.id).catch(toastError);
    }
  }

  @action
  public async loadSerialNumbers (): Promise<void> {
    if (!this.lotId) {
      return;
    }
    this.setUrl({ lotId: this.lotId });
    await this.fetch();
  }

  public async createSerialNumber (serialNumber: string): Promise<void> {
    return await this.createSerialNumbers([serialNumber]);
  }

  public async checkExistingLotSerialNumbers (serialNumbers: string[]): Promise<string[]> {
    const sanitizedSerialNumbers = sanitizeSerials(serialNumbers);
    if (sanitizedSerialNumbers.length === 0) {
      return [];
    }

    const existingSerialNumbersResponse: unknown = await this.existingSerialNumbersRequest.set({
      method: 'post',
      url: FBEndpoint.CheckExistingLotSerialNumbers,
      body: { serialNumbers: sanitizedSerialNumbers },
    });

    if (!Array.isArray(existingSerialNumbersResponse)) {
      return [];
    }

    return existingSerialNumbersResponse.filter(
      (serialNumber): serialNumber is string => typeof serialNumber === 'string',
    );
  }

  public async createSerialNumbers (serialNumbers: string[]): Promise<void> {
    if (!this.lotId || !Array.isArray(serialNumbers) || serialNumbers.length === 0) {
      return;
    }
    await this.set({
      method: 'post',
      url: this.url,
      urlValues: { lotId: this.lotId },
      body: { serialNumbers },
    });
  }

  public async updateSerialNumber (id: string, data: SerialNumberUpdateData): Promise<void> {
    if (!this.lotId || !id) {
      return;
    }
    await this.updateSerialNumbers([{ id, ...data }]);
  }

  private getShapedUpdatePayload <T extends SerialNumberUpdatePayload>(serialNumber: T): T {
    switch (serialNumber.status) {
      case SerialNumberStatus.ACCEPTED:
      case SerialNumberStatus.REJECTED:
        return {
          ...serialNumber,
          usage: null,
        };
      default:
        return serialNumber;
    }
  }

  public async updateSerialNumbers (serialNumbers: SerialNumberUpdatePayload[]): Promise<void> {
    if (!this.lotId || !serialNumbers.length) {
      return;
    }
    const updatePayload = serialNumbers.map((serialNumber) => this.getShapedUpdatePayload(serialNumber));
    await this.set({
      method: 'patch',
      url: this.url,
      urlValues: { lotId: this.lotId },
      body: { serialNumbers: updatePayload },
    });
  }

  public async deleteSerialNumbers (ids: string[]): Promise<void> {
    if (!this.lotId || !Array.isArray(ids) || ids.length === 0) {
      return;
    }
    await this.set({
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
    await this.set({
      method: 'delete',
      url: this.url,
      urlValues: { lotId: this.lotId },
      body: { data: { ids: [id] } },
    });
  }

  @action
  async findLotByDocRevId (docRevId?: string): Promise<unknown> {
    if (!docRevId || this.isForm) {
      return;
    }
    await this.lotFindRequest.set({
      method: 'get',
      url: FBEndpoint.LotForDocRev,
      urlValues: { docRevId },
    }, (data, error) => {
      this.lotData = data;
      if (data) {
        this.lotFindRequest.onSuccess();
      }
      this.loadSerialNumbers().catch(toastError);
    });
  }
}

export default FBSerialsState;
