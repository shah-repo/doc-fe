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
  public docType?: DocumentType;
  public groupOptions: any[] = [];
  public item?: PurchaseOrderItem;

  public constructor(
    { docType, groupOptions, item }:
    { docType?: DocumentType; groupOptions: any[]; item: PurchaseOrderItem }
  ) {
    this.createLotAPI.setUrl(FBEndpoint.DocumentRevisionsUrl);
    this.docType = docType;
    this.groupOptions = groupOptions;
    this.item = item;
  }

  @action public async submit(values: any) {
    if (!this.docType) {
      throw new Error("form.builder.po.no.document.lot");
    }
    const urlTpl = template(FBEndpoint.FetchDocId);
    const url = urlTpl({ documentTypeId: this.docType.id });
    this.docIdAPI.setUrl(url);
    const data = await this.docIdAPI.fetch();
    this.createLot(data.docId, values);
  }

  public async createLot(docId: string, values: any) {
    const securityGroups: any[] = [];
    if (this.docType?.isQms) {
      this.groupOptions.forEach((group) => {
        if (group.tags?.includes(GroupTag.QMS_DEFAULT)) {
          securityGroups.push({ value: group.value, label: group.label });
        }
      });
    }

    // TODO: fix. Values can't be read because name is undefined
    values = "form values";
    const reqBody = toNewVersionRequestBody({
      name: `${this.item?.glCode}-${this.item?.description}`,
      description: `<p>${values}</p>`,
      attachments: [],
      // can't reference this receivables document because it's not released and they are not in the same CR
      referenceTo: [{ value: FBStore.document.document.id, label: "" }],
      securityEmployees: [],
      securityGroups,
      document: {
        docId,
        documentType: { id: this.docType?.id },
      },
      revisionStage: 1,
      revisionChangeType: RevisionChangeType.NextRevision,
      renderHTML: undefined,
    });

    reqBody.formDocument = undefined;
    reqBody.formTemplate = undefined;
    reqBody.formInput = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      lot_number: 5,
      // eslint-disable-next-line @typescript-eslint/camelcase
      lot_part_number: this.item?.partNumber,
      // TODO: item is undefined just like name
    };

    this.createLotAPI.setBody(reqBody);
    const docRev = await this.createLotAPI.post();

    const path = documentPreviewPath(docRev.id, docRev.document.id);
    window.open(path, "_blank");
  }
}

export default FBPOReceiveFormState;
