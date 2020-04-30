import { template } from "lodash";
import { action } from "mobx";
import { GroupTag } from "../../../state/ducks/auth/types";
import { RevisionChangeType } from "../../../state/ducks/documentRevisions";
import { DocumentType } from "../../../state/ducks/documentRevisions/documentType";
import { documentPreviewPath } from "../../document.revision/utils/paths";
import { toNewVersionRequestBody } from "../../documentRevision/forms/transform";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { PurchaseOrderItem } from "../FBPurchaseOrder";
import FBStore from "../stores/ui/FBStore";

export class FBPOReceiveFormState  {
  public docIdAPI: FBRequest<any, any> = new FBRequest();
  public createLotAPI: FBRequest<any, any> = new FBRequest();
  public releasedLfpoAPI: FBRequest<any, any> = new FBRequest();
  public lfpoDocType?: DocumentType;
  public lotDocType?: DocumentType;
  public groupOptions: any[] = [];
  public item?: PurchaseOrderItem;

  public constructor(
    { lfpoDocType, lotDocType, groupOptions, item }:
    { lfpoDocType?: DocumentType; lotDocType?: DocumentType; groupOptions: any[]; item: PurchaseOrderItem }
  ) {
    this.createLotAPI.setUrl(FBEndpoint.DocumentRevisionsUrl);
    this.lfpoDocType = lfpoDocType;
    this.lotDocType = lotDocType;
    this.groupOptions = groupOptions;
    this.item = item;
    const urlTpl = template(FBEndpoint.FetchDocId);
    const url = urlTpl({ documentTypeId: this.lotDocType?.id });
    this.docIdAPI.setUrl(url);
    this.fetchLfpoDocs();
  }

  @action public async submit(values: any) {
    if (!this.releasedLfpoAPI.data || this.releasedLfpoAPI.data?.length === 0) {
      throw new Error("form.builder.missing.lfpo");
    }
    if (!this.lfpoDocType || !this.lotDocType) {
      throw new Error("form.builder.po.no.document.lot");
    }
    const data = await this.docIdAPI.fetch();
    await this.createLot(data.docId, values);
  }

  public async createLot(docId: string, values: any) {
    const securityGroups: any[] = [];
    if (this.lotDocType?.isQms) {
      this.groupOptions.forEach((group) => {
        if (group.tags?.includes(GroupTag.QMS_DEFAULT)) {
          securityGroups.push({ value: group.value, label: group.label });
        }
      });
    }

    if (!FBStore.document?.document?.id) {
      return;
    }

    const reqBody = toNewVersionRequestBody({
      name: `${this.item?.glCode}-${this.item?.description}`,
      description: values.comments ? `<p>${values.comments}</p>` : `<p>${this.item?.description}</p>`,
      attachments: [],
      referenceTo: [{ value: FBStore.document.document.id, label: "" }],
      securityEmployees: [],
      securityGroups,
      document: {
        docId,
        documentType: { id: this.lotDocType?.id },
      },
      revisionStage: 1,
      revisionChangeType: RevisionChangeType.NextRevision,
      renderHTML: undefined,
    });

    reqBody.formDocument = {
      id: this.releasedLfpoAPI.data[0].id,
    };
    reqBody.formTemplate = undefined;
    reqBody.formInput = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      lot_quantity: values.received,
      // eslint-disable-next-line @typescript-eslint/camelcase
      lot_part_number: this.item?.partNumber,
    };

    this.createLotAPI.setBody(reqBody);
    const docRev = await this.createLotAPI.post();

    const path = documentPreviewPath(docRev.id, docRev.document.id);
    window.open(path, "_blank");
  }

  private fetchLfpoDocs() {
    const urlTpl = template(FBEndpoint.FetchDocumentRevisionByAcronym);
    const url = urlTpl({ documentTypeAcronym: this.lfpoDocType?.documentTypeAcronym });
    this.releasedLfpoAPI.setUrl(url);
    this.releasedLfpoAPI.fetch();
  }
}

export default FBPOReceiveFormState;
