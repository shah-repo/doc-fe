import _, { Dictionary } from "lodash";
import { action, computed } from "mobx";
import { useIntl } from "react-intl";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { toastError } from "../../components/notifications";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { PurchaseOrderItem } from "../FBPurchaseOrder_/FBPurchaseOrder.types";
import { FBInputProps } from "../types/common";
import { FBEditorElementType } from "../types/editor";

export class FBPOReceiveState extends FBRequest<DocumentRevision, any>  {

  public constructor(id: string) {
    super();
    this.setPOId(id);
  }

  @computed public get docSchema(): FBInputProps[] | undefined {
    return this.data?.formDocument?.formTemplate?.schema;
  }

  @computed public get docValues(): Dictionary<any>| undefined {
    return this.data?.formInput;
  }

  @computed public get items(): PurchaseOrderItem[] | undefined {
    if (!this.docSchema) {
      return;
    }
    const poFieldName = this.docSchema
      .find((schemaItem) => schemaItem.type as FBEditorElementType  === "purchaseorder")
      ?.name;

    if (!poFieldName) {
      // TODO: agree on alternative for notifications
      const intl = useIntl();
      toastError(intl.formatMessage({ id: "form.builder.receive.po.not.found" }));
      return;
    }

    return this.docValues?.[poFieldName]?.items || [];
  }

  @computed public get schema(): FBInputProps[] | undefined {
    if (!this.docSchema) {
      return;
    }
    return _.filter(this.docSchema, (schemaItem: FBInputProps) => {
      if (schemaItem.type !== "purchaseorder") {
        return _.merge(schemaItem, {
          defaultValue: _.get(this.docValues, schemaItem.name || ""),
          disabled: true,
        });
      }
    }) as FBInputProps[];
  }

  @action public setPOId = (id?: string) => {
    if (!id) {
      return;
    }
    const urlTpl = _.template(FBEndpoint.FetchDocumentRevision);
    const url = urlTpl({ documentId: id });
    this.setUrl(url);
    this.fetch();
  };
}

export default FBPOReceiveState;
