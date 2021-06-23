import { action } from "mobx";
import { CreateLotBody, FBPOReceiveCreateLotConstructor, FBPurchaseOrderItem } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBPOReceiveCreateLotState  {
  public createLotAPI = new FBRequest<null, CreateLotBody>(FBEndpoint.PatchDocumentRevision);
  public item?: FBPurchaseOrderItem;
  public receivableId: string;

  public constructor({ receivableId, item }: FBPOReceiveCreateLotConstructor) {
    this.createLotAPI.setUrl(FBEndpoint.CreateLot);
    this.receivableId = receivableId;
    this.item = item;
  }

  @action public async submit(values?: any) {
    if (!this.receivableId) {
      return;
    }
    await this.createLot(this.receivableId, values);
  }

  public async createLot(receivableId: string, values: any) {
    const partId = this.item?.partNumber;
    const lotTypeId = values?.["Lot-Type"];
    const lotFormId = values?.["Lot-Form"];

    const body = {
      receivedQuantity: values?.received,
      lotDocumentType: { id: lotTypeId },
      lotForm: { id: lotFormId },
      partDescription: this.item?.partNumberTitle || this.item?.description,
      fieldId: this.item?.id,
      supplierPartNumber: this.item?.supplierPartNumber,
      part: partId ? { id: partId } : undefined,
    };

    this.createLotAPI.set({
      url: FBEndpoint.CreateLot,
      urlValues: { receivableId },
      body,
    });
    await this.createLotAPI.post();
  }
}

export default FBPOReceiveCreateLotState;
