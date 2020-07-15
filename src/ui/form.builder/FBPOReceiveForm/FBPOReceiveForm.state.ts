import { template } from "lodash";
import { action } from "mobx";
import { FBPOReceiveFormConstructor, FBPurchaseOrderItem } from "..";
import { RevisionChangeType } from "../../../state/ducks/documentRevisions";
import { DocumentType } from "../../../state/ducks/documentRevisions/documentType";
import { documentPreviewPath } from "../../document.revision/utils/paths";
import { toNewVersionRequestBody } from "../../documentRevision/forms/transform";
import { DocumentRevisionFormValues } from "../../documentRevision/forms/types";
import { filterSecurityGroupsForQms } from "../../documentType/list/helpers";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

export class FBPOReceiveFormState  {
  public docIdAPI: FBRequest<any, any> = new FBRequest();
  public createLotAPI: FBRequest<any, any> = new FBRequest();
  public releasedLfpoAPI: FBRequest<any, any> = new FBRequest();
  public lfpoDocType?: DocumentType;
  public lotDocType?: DocumentType;
  public groupOptions: any[] = [];
  public item?: FBPurchaseOrderItem;
  private documentId: string | undefined;

  public constructor({ lfpoDocType, lotDocType, groupOptions, item, documentId }: FBPOReceiveFormConstructor) {
    this.createLotAPI.setUrl(FBEndpoint.DocumentRevisionsUrl);
    this.lfpoDocType = lfpoDocType;
    this.lotDocType = lotDocType;
    this.groupOptions = groupOptions;
    this.item = item;
    this.documentId = documentId;
    const urlTpl = template(FBEndpoint.FetchDocId);
    const url = urlTpl({ documentTypeId: this.lotDocType?.id });
    this.docIdAPI.setUrl(url);
    this.fetchLfpoDocs();
  }

  @action public async submit(values: any, poDocumentId?: string) {
    if (!this.releasedLfpoAPI.data || this.releasedLfpoAPI.data?.length === 0) {
      throw new Error("form.builder.missing.lfpo");
    }
    if (!this.lfpoDocType || !this.lotDocType) {
      throw new Error("form.builder.po.no.document.lot");
    }
    const data = await this.docIdAPI.fetch();
    await this.createLot(data.docId, values, poDocumentId);
  }

  public async createLot(docId: string, values: any, poDocumentId?: string) {
    if (!this.documentId) {
      return;
    }
    const securityGroups = filterSecurityGroupsForQms(this.lotDocType?.isQms, this.groupOptions);

    const reqBody = toNewVersionRequestBody({
      // LOT must not have title
      // name: `${this.item?.glCode}-${this.item?.description}`,
      description: `<p>${this.item?.partNumberDocId}-${this.item?.partNumberTitle}</p>`,
      attachments: [],
      referenceTo: [{ value: this.documentId, label: "" }],
      securityEmployees: [],
      securityGroups,
      operators: [],
      document: {
        docId,
        documentType: { id: this.lotDocType?.id },
      },
      revisionStage: 1,
      revisionChangeType: RevisionChangeType.NextRevision,
      renderHTML: undefined,
    } as unknown as DocumentRevisionFormValues);

    poDocumentId && reqBody.referenceTo.push({ id: poDocumentId });
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
